import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Radio, RadioChangeEvent, Result, Select } from 'antd';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import useSWR from 'swr';
import { BackendApiUrl } from '@/functions/BackendApiUrl';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';

const { TextArea } = Input

interface ChapterModel {
    id: string,
    title: string
}

type AddSubCategoryType = {
    title: string
    description: string
    isVerse: boolean
    id?: string
    checklist?: {
        description: string
        uploadStatus: {
            name: string
        }
    }[]
}

const AddSubCategoryModal: React.FC<{
    categoryId: string,
    isModalOpen: boolean,
    setIsModalOpen: Dispatch<SetStateAction<boolean>>
}> = (props) => {

    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [isResultOpen, setIsResultOpen] = useState(false);
    const [isDijadikanAyat, setIsDijadikanAyat] = useState(false);
    const [checklistDescriptionList, setChecklistDescriptionList] = useState<string[]>([])

    const [formResult, setFormResult] = useState<{ status: 'success' | 'error', message: string }>({
        status: 'success',
        message: ''
    })

    const swrFetcher = useSwrFetcherWithAccessToken()
    const fetch = useFetchWithAccessToken()

    const { data } = useSWR<ChapterModel[]>(BackendApiUrl.getChapters + `/${props.categoryId}`, swrFetcher);

    useEffect(() => {
        if (isDijadikanAyat) {
            setChecklistDescriptionList([''])
        } else {
            setChecklistDescriptionList([])
        }
    }, [isDijadikanAyat])

    function resetForm() {
        setIsDijadikanAyat(false)
        setChecklistDescriptionList([])
        form.resetFields()
    }

    const handleOk = () => {
        setLoading(true);
        props.setIsModalOpen(false);
        setLoading(false);

        resetForm()

        setIsResultOpen(true)
    };

    const handleCancel = () => {
        props.setIsModalOpen(false);
        resetForm()
    };

    const handleCancelResult = () => {
        setIsResultOpen(false);
    };

    const onAyatRadioChange = (e: RadioChangeEvent) => {
        setIsDijadikanAyat(e.target.value);
    };

    // Filter `option.label` match the user type `input`
    const filterOption = (input: string, option?: { label: string; value: string }) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const onFinish = async (values: AddSubCategoryType) => {
        setLoading(true);

        const formSubmission: AddSubCategoryType = {
            id: values.id ?? props.categoryId,
            title: values.title,
            description: values.description,
            isVerse: values.isVerse,
            checklist: checklistDescriptionList.length === 0 || (checklistDescriptionList.length === 1 && !checklistDescriptionList[0]) ? [] : checklistDescriptionList.map(Q => {
                return {
                    description: Q,
                    uploadStatus: {
                        name: ''
                    }
                }
            })
        }

        try {
            const res = await fetch.fetchPOST(BackendApiUrl.createSubCategory, formSubmission)
            if (res.error || res.problem) {
                throw res.error ?? res.problem
            }

            setFormResult({
                message: 'Successfully Added Sub - Category!',
                status: 'success'
            })

        } catch (e) {
            setFormResult({
                message: 'Failed to Add Sub - Category!',
                status: 'error'
            })
        }
        finally {
            props.setIsModalOpen(false);
            setLoading(false);

            resetForm()

            setIsResultOpen(true)
        }
    };

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
                }}>Add Sub - Category</p>

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
                        }}>Dijadikan Ayat?</p>

                        <div style={{ marginLeft: '48px', paddingTop: '6px', flexGrow: 1 }}>
                            <Form.Item<AddSubCategoryType>
                                name="isVerse"
                                initialValue={false}
                                rules={[{ required: true }]}
                            >
                                <Radio.Group onChange={onAyatRadioChange} value={isDijadikanAyat}>
                                    <Radio value={false}><span style={{ fontSize: '18px' }}>No</span></Radio>
                                    <Radio value={true}><span style={{ fontSize: '18px' }}>Yes</span></Radio>
                                </Radio.Group>
                            </Form.Item>

                            {
                                isDijadikanAyat &&
                                <Form.Item<AddSubCategoryType>
                                    name="id"
                                    rules={[{ required: true, message: 'Please select pasal' }]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Pilih pasal yang akan ditambahkan ayat baru"
                                        optionFilterProp="children"
                                        filterOption={filterOption}
                                        dropdownMatchSelectWidth={false}
                                        options={
                                            data?.map(Q => {
                                                return {
                                                    value: Q.id,
                                                    label: Q.title
                                                }
                                            })
                                        }
                                        size='large'
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                            }
                        </div>
                    </div>

                    <Form.Item<AddSubCategoryType>
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
                                placeholder='Insert title' style={{ fontSize: '18px' }}
                            />
                        </div>
                    </Form.Item>

                    <br />

                    <Form.Item<AddSubCategoryType>
                        name="description"
                        rules={[{ required: true, message: 'Please input description' }]}
                    >
                        <div>
                            <p style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                marginBottom: '8px'
                            }}>Description</p>
                            <TextArea rows={4} placeholder='Insert description' style={{ fontSize: '18px' }} />
                        </div>
                    </Form.Item>


                    <br />

                    {
                        isDijadikanAyat && checklistDescriptionList.map((Q, idx) => {
                            return <div key={`checklist#${idx + 1}`}>
                                <div>
                                    <p style={{
                                        fontSize: '24px',
                                        fontWeight: 'bold',
                                        marginBottom: '8px'
                                    }}>Checklist Description {checklistDescriptionList.length > 1 && ` ${idx + 1}`}</p>
                                    <Input
                                        placeholder='Insert checklist description'
                                        value={Q}
                                        onChange={e => {
                                            const checklistTemp = checklistDescriptionList.slice()
                                            checklistTemp[idx] = e.target.value
                                            setChecklistDescriptionList(checklistTemp)
                                        }}
                                        style={{ fontSize: '18px' }}
                                    />
                                </div>
                                <br />
                            </div>
                        })
                    }

                    {
                        isDijadikanAyat &&
                        <>
                            <Button
                                size='large'
                                onClick={() => {
                                    setChecklistDescriptionList(prev => [...prev, ''])
                                }}>Add another checklist</Button>
                            <Button type='primary'
                                danger
                                size='large'
                                onClick={() => {
                                    setChecklistDescriptionList([''])
                                }} style={{ marginLeft: '16px' }}>Delete checklist</Button>
                        </>
                    }

                    <Form.Item style={{ textAlign: 'right' }}>
                        <Button key="submit" type="default" htmlType='submit' loading={loading}
                            size='large'
                            style={{}}>
                            Add
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

export default AddSubCategoryModal;
