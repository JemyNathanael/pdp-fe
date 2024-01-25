import React, { Dispatch, SetStateAction, useState } from 'react';
import { Button, Form, Modal, Result, TreeSelect } from 'antd';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import useSWR, { mutate } from 'swr';
import { BackendApiUrl, GetCategoryDetail, GetProgress } from '@/functions/BackendApiUrl';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';
import { useRouter } from 'next/router';

interface ChapterModel {
    id: string
    title: string
    secondSubCategories: {
        id: string
        title: string
    }[]
    createdAt: Date
}

type DeleteSubCategoryType = {
    id: string
}

const DeleteSubCategoryModal: React.FC<{
    categoryId: string,
    isModalOpen: boolean,
    setIsModalOpen: Dispatch<SetStateAction<boolean>>
}> = (props) => {

    const [form] = Form.useForm();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isResultOpen, setIsResultOpen] = useState(false);
    const [, setAutoCloseTimeout] = useState<NodeJS.Timeout | null>(null);

    const [formResult, setFormResult] = useState<{ status: 'success' | 'error', message: string }>({
        status: 'success',
        message: ''
    })

    const swrFetcher = useSwrFetcherWithAccessToken()
    const fetch = useFetchWithAccessToken()

    const { data } = useSWR<ChapterModel[]>(BackendApiUrl.getSubCategoryList+ `/${props.categoryId}`, swrFetcher)

    function resetForm() {
        form.resetFields()
        setSelectedId('')
    }

    const handleOk = () => {
        setLoading(true)
        props.setIsModalOpen(false)
        setLoading(false)

        resetForm()

        setIsResultOpen(true)
    }

    const handleCancel = () => {
        props.setIsModalOpen(false)
        resetForm()
    }

    const handleCancelResult = () => {
        setIsResultOpen(false)
        router.push(`/${props.categoryId}`);
    }

    const onFinish = async () => {
        setLoading(true)

        try {
            const res = await fetch.fetchDELETE(BackendApiUrl.deleteSubCategory + '/' + selectedId)
            if (res.error || res.problem) {
                throw res.error ?? res.problem
            }

            setFormResult({
                message: 'Deletion was successfull',
                status: 'success'
            })

        } catch (e) {
            setFormResult({
                message: 'Deletion was failed!',
                status: 'error'
            })
        }
        finally {
            props.setIsModalOpen(false)
            setLoading(false)

            resetForm()

            setIsResultOpen(true)
            const timeout = setTimeout(() => {
                setIsResultOpen(false);
                mutate(BackendApiUrl.getSubCategoryList + `/${props.categoryId}`)
                mutate(GetCategoryDetail(props.categoryId))
                mutate(GetProgress(props.categoryId))
            }, 1500);
            setAutoCloseTimeout(timeout);
        }
    }

    const [selectedId, setSelectedId] = useState<string>();
    const [selectedTitle, setSelectedTitle] = useState<string>();

    function onChange(newValue: string) {
        if (!data) {
            return
        }

        setSelectedId(newValue)
        let selectedItem: {
            title: string
        } = {
            title: ''
        }
        const checkChapter = data.filter(Q => Q.id === newValue)
        if (!checkChapter || checkChapter.length == 0) {
            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < data.length; j++) {
                    if (data[i]?.secondSubCategories[j]?.id === newValue) {
                        selectedItem =
                        {
                            title: data[i]?.secondSubCategories[j]?.title ?? '',
                        }
                    }
                }
            }
        } else {
            selectedItem =
            {
                title: checkChapter[0]?.title ?? '',
            }
        }

        setSelectedTitle(selectedItem.title)
    }

    return (
        <div>
            <Modal
                maskClosable={false}
                width={500}
                centered
                open={props.isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                closable={false} 
                footer={[]}
            >

                <Result
                    style={{ margin: '0', padding: '0', marginTop: '16px'}}
                />

                {
                    !selectedId &&
                    <p style={{ fontSize: '22px', textAlign: 'center' }}>
                        Do you really want to delete this sub - category? Fill the name of the sub - category that you want to delete!
                    </p>
                }

                {
                    selectedId &&
                    <p style={{ fontWeight: 'bold', fontSize: '34px', textAlign: 'center', marginBottom: '20px' }}>Are you sure?</p>
                }

                <Form
                    name="basic"
                    form={form}
                    onFinish={onFinish}
                >

                    {
                        !selectedId &&
                        <div style={{
                            marginTop: '32px',
                            overflow: 'hidden'
                        }}>
                            <p style={{
                                fontSize: '22px',
                                fontWeight: 'bold'
                            }}>Sub - Category Name:</p>

                            <div style={{ paddingTop: '2px' }}>
                                <Form.Item<DeleteSubCategoryType>
                                    name="id"
                                    rules={[{ required: true, message: 'Please select pasal or ayat' }]}
                                >
                                    <TreeSelect
                                        showSearch
                                        style={{ width: '100%' }}
                                        value={selectedId}
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        placeholder="Example Pasal 1"
                                        allowClear
                                        onChange={onChange}
                                        treeDefaultExpandAll
                                        treeNodeFilterProp='title'
                                        treeData={
                                            data?.map(Q => {
                                                return {
                                                    title: Q.title,
                                                    value: Q.id,
                                                    children: Q.secondSubCategories.map(Z => {
                                                        return {
                                                            title: Z.title,
                                                            value: Z.id
                                                        }
                                                    }) ?? []
                                                }
                                            })
                                        }
                                        size='large'
                                    />
                                </Form.Item>
                            </div>
                            <p style={{ color: 'red', marginTop: '-18px' }}>You can only choose one sub-category or cheklist to delete!</p>
                        </div>
                    }

                    {
                        selectedId &&
                        <div style={{ fontSize: '22px', textAlign: 'center' }}>
                            <p>Proceed with <span style={{ color: 'red' }}>{selectedTitle} deletion</span>? All sub-categories and checklists within this category will also be deleted, this process <span style={{ color: 'red' }}>cannot be undone.</span></p>
                        </div>
                    }

                    <br />

                    <Form.Item style={{ textAlign: 'center' }}>
                        <Button key="back" type="default"
                            onClick={handleCancel}
                            size='large'
                            style={{ marginRight: '8px', width: '100px', borderColor:'#3788FD', color:'#3788FD' }}>
                            Back
                        </Button>
                        <Button key="submit" type="default" htmlType='submit' loading={loading}
                            size='large'
                            danger
                            style={{ width: '100px',backgroundColor:'#FF0000', color:'white' }}>
                            Delete
                        </Button>
                    </Form.Item>
                    
                </Form>

            </Modal>

            <Modal
                width={400}
                centered
                open={isResultOpen}
                onCancel={handleCancelResult}
                closable={false} 
                footer={[]}
                maskClosable={false}
            >
                <Result
                    status={formResult.status}
                    title={formResult.message}
                    style={{ fontSize: '32px', fontWeight: 'bold',  color: 'red'}}
                />

            </Modal>
        </div>
    );
};

export default DeleteSubCategoryModal;