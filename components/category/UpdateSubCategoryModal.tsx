import React, { Dispatch, SetStateAction, useState } from 'react';
import { Button, Form, Input, Modal, Result, TreeSelect } from 'antd';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import useSWR from 'swr';
import { BackendApiUrl } from '@/functions/BackendApiUrl';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';

const { TextArea } = Input

interface ChapterModel {
    id: string
    title: string
    secondSubCategories: {
        id: string
        title: string
    }[]
    createdAt: Date
}

type UpdateSubCategoryType = {
    title: string
    id: string
}

const UpdateSubCategoryModal: React.FC<{
    categoryId: string,
    isModalOpen: boolean,
    setIsModalOpen: Dispatch<SetStateAction<boolean>>
}> = (props) => {

    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [isResultOpen, setIsResultOpen] = useState(false);

    const [updateForm, setUpdateForm] = useState<{
        title: string
    }>({ title: ''})

    const [formResult, setFormResult] = useState<{ status: 'success' | 'error', message: string }>({
        status: 'success',
        message: ''
    })

    const swrFetcher = useSwrFetcherWithAccessToken()
    const fetch = useFetchWithAccessToken()

    const { data } = useSWR<ChapterModel[]>(BackendApiUrl.getSubCategoryList + `/${props.categoryId}`, swrFetcher)

    function resetForm() {
        form.resetFields()
        setUpdateForm({
            title: ''
        })
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

        location.reload();
    }

    const onFinish = async (values: UpdateSubCategoryType) => {
        setLoading(true)
        const formSubmission: UpdateSubCategoryType = {
            id: values.id,
            title: values.title,
        }

        try {
            const res = await fetch.fetchPUT(BackendApiUrl.updateSubCategory, formSubmission)
            if (res.error || res.problem) {
                throw res.error ?? res.problem
            }

            setFormResult({
                message: 'Successfully Updated Sub - Category!',
                status: 'success'
            })

        } catch (e) {
            setFormResult({
                message: 'Failed to Update Sub - Category!',
                status: 'error'
            })
        }
        finally {
            props.setIsModalOpen(false)
            setLoading(false)

            resetForm()

            setIsResultOpen(true)
        }
    }

    const [selectedId, setSelectedId] = useState<string>();

    const onChange = (newValue: string) => {
        if (!data) {
            return
        }

        setSelectedId(newValue);
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
                title: checkChapter[0]?.title ?? ''
            }
        }

        form.setFieldsValue({
            title: selectedItem.title,
        })

        setUpdateForm({
            title: selectedItem.title
        })
    }

    return (
        <div>
            <Modal
                width={800}
                centered
                open={props.isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[]}
            >
                <p style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    textAlign: 'center'
                }}>Update Sub - Category</p>

                <Form
                    name="basic"
                    form={form}
                    onFinish={onFinish}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        marginTop: '32px',
                        overflow: 'hidden'
                    }}>
                        <p style={{
                            fontSize: '24px',
                            fontWeight: 'bold'
                        }}>Sub - Category</p>

                        <div style={{ marginLeft: '48px', paddingTop: '2px', flexGrow: 1 }}>
                            <Form.Item<UpdateSubCategoryType>
                                name="id"
                                rules={[{ required: true, message: 'Please select pasal or ayat' }]}
                            >
                                <TreeSelect
                                    showSearch
                                    style={{ width: '100%' }}
                                    value={selectedId}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    placeholder="Find or choose"
                                    allowClear
                                    treeDefaultExpandAll
                                    onChange={onChange}
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
                                                })
                                            }
                                        })
                                    }
                                    size='large'
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <br />

                    {
                        selectedId &&
                        <>
                            <Form.Item<UpdateSubCategoryType>
                                name="title"
                                rules={[{ required: true, message: 'Please input title' }]}
                            >
                                <div>
                                    <p style={{
                                        fontSize: '24px',
                                        fontWeight: 'bold',
                                        marginBottom: '8px'
                                    }}>Title</p>
                                    <Input
                                        placeholder='Insert title' style={{ fontSize: '18px' }} value={updateForm.title}
                                        onChange={e => setUpdateForm(prev => {
                                            return { ...prev, title: e.target.value }
                                        })}
                                    />
                                </div>
                            </Form.Item>

                            <br />

                            <Form.Item<UpdateSubCategoryType>
                                name="description"
                                rules={[{}]}
                            >
                                <div>
                                    <p style={{
                                        fontSize: '24px',
                                        fontWeight: 'bold',
                                        marginBottom: '8px'
                                    }}>Description</p>
                                    <TextArea rows={4} placeholder='Insert description' style={{ fontSize: '18px' }}
                                        value=""
                                    />
                                </div>
                            </Form.Item>

                            <br />
                        </>
                    }

                    <Form.Item style={{ textAlign: 'right' }}>
                        <Button key="submit" type="default" htmlType='submit' loading={loading}
                            size='large'
                            style={{backgroundColor:'#3788FD', color:'white'}}>
                            Update
                        </Button>
                    </Form.Item>

                </Form>

            </Modal>

            <Modal
                width={400}
                centered
                open={isResultOpen}
                onCancel={handleCancelResult}
                footer={[]}
            >
                <Result
                    status={formResult.status}
                    title={formResult.message}
                    style={{ fontSize: '32px', fontWeight: 'bold' }}
                />

            </Modal>
        </div>
    );
};

export default UpdateSubCategoryModal;
