import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Radio, RadioChangeEvent, Result, TreeSelect } from 'antd';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import useSWR, { mutate } from 'swr';
import { BackendApiUrl, GetCategoryDetail, GetProgress } from '@/functions/BackendApiUrl';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';

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

type AddSubCategoryType = {
    title: string
    isSecond: boolean
    id?: string
    checklist?: {
        description: string
        uploadStatus: {
            name: string
        }
    }[]
    createdBy: string | null
}

const AddSubCategoryModal: React.FC<{
    categoryId: string,
    isModalOpen: boolean,
    setIsModalOpen: Dispatch<SetStateAction<boolean>>
}> = (props) => {

    const [form] = Form.useForm();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [isResultOpen, setIsResultOpen] = useState(false);
    const [isDijadikanAyat, setIsDijadikanAyat] = useState(false);
    const [checklistDescriptionList, setChecklistDescriptionList] = useState<string[]>([])
    const [, setAutoCloseTimeout] = useState<NodeJS.Timeout | null>(null)

    const username = session?.user?.name;


    const [formResult, setFormResult] = useState<{ status: 'success' | 'error', message: string }>({
        status: 'success',
        message: ''
    })

    const swrFetcher = useSwrFetcherWithAccessToken()
    const fetch = useFetchWithAccessToken()

    const { data } = useSWR<ChapterModel[]>(BackendApiUrl.getSubCategoryList + `/${props.categoryId}`, swrFetcher);

    const dataArray = data ? Object.values(data) : [];

    const [addForm, setAddForm] = useState<{
        ayat: boolean,
        title: string,
        subCategory: string
        checkList: string[]
    }>({ ayat: false, title: '', subCategory: '',  checkList: [] })

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
        setAddForm({ ayat: false, title: '', subCategory: '', checkList: [] })
    };

    const handleCancelResult = () => {
        setIsResultOpen(false);

        location.reload();
    };

    const onAyatRadioChange = (e: RadioChangeEvent) => {
        setIsDijadikanAyat(e.target.value);
        setAddForm(prev => {
            return { ...prev, ayat: e.target.value }
        })
    };

    // Filter `option.label` match the user type `input`
    // const filterOption = (input: string, option?: { label: string; value: string }) =>
    //     (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const onFinish = async (values: AddSubCategoryType) => {
        setLoading(true);

        const formSubmission: AddSubCategoryType = {
            id: values.id ?? props.categoryId,
            title: values.title,
            isSecond: values.isSecond,
            checklist: checklistDescriptionList.length === 0 || (checklistDescriptionList.length === 1 && !checklistDescriptionList[0]) ? [] : checklistDescriptionList.map(Q => {
                return {
                    description: Q,
                    uploadStatus: {
                        name: ''
                    }
                }
            }),
            createdBy: username ? null : "Administrator"
        }

        try {
            const res = await fetch.fetchPOST(BackendApiUrl.createSubCategory, formSubmission)
            if (res.error || res.problem) {
                throw res.error ?? res.problem
            }

            setFormResult({
                message: 'Successfully Added \n Sub - Category!',
                status: 'success'
            });


        } catch (e) {
            setFormResult({
                message: 'Failed to Add \n Sub - Category!',
                status: 'error'
            })
        }
        finally {
            props.setIsModalOpen(false);
            setLoading(false);

            resetForm()

            setIsResultOpen(true);

            const timeout = setTimeout(() => {
                setIsResultOpen(false);
                mutate(BackendApiUrl.getSubCategoryList + `/${props.categoryId}`)
                mutate(GetCategoryDetail(props.categoryId))
                mutate(GetProgress(props.categoryId))
            }, 1500);
            setAutoCloseTimeout(timeout);
        }
    };

    function checkAddButton() {
        const isChecklistFill = checklistDescriptionList.every((item) => item.trim())
        // console.log(addForm)
        if (!addForm.ayat) {
            if (!addForm.title) {
                return true
            }
            else {
                return false
            }
        }
        else if (addForm.ayat) {
            // tidak ada di isi
            if (!addForm.subCategory && !addForm.title && !isChecklistFill) {
                return true
            }
            // cuma isi sub category
            else if (addForm.subCategory && !addForm.title && !isChecklistFill) {
                return true
            }
            // cuma isi checklist
            else if (!addForm.subCategory && !addForm.title && isChecklistFill) {
                return true
            }
            // cuma isi title
            else if (!addForm.subCategory && addForm.title && !isChecklistFill) {
                return true
            }
            // cuma isi sub category & title
            else if (addForm.subCategory && addForm.title && !isChecklistFill) {
                return true
            }
            // cuma isi sub category & checklist
            else if (addForm.subCategory && !addForm.title && isChecklistFill) {
                return true
            }
            // cuma isi title & checklist
            else if (!addForm.subCategory && addForm.title && isChecklistFill) {
                return true
            }
            else {
                return false
            }
        }
        return false
    }

    function checkBackgroundColor() {
        const isChecklistFill = checklistDescriptionList.every((item) => item.trim())
        if (!addForm.ayat) {
            if (!addForm.title) {
                return '#A3A3A3'
            }
            else {
                return '#3788FD'
            }
        }
        else if (addForm.ayat) {
            // tidak ada di isi
            if (!addForm.subCategory && !addForm.title && !isChecklistFill) {
                return '#A3A3A3'
            }
            // cuma isi sub category
            else if (addForm.subCategory && !addForm.title && !isChecklistFill) {
                return '#A3A3A3'
            }
            // cuma isi checklist
            else if (!addForm.subCategory && !addForm.title && isChecklistFill) {
                return '#A3A3A3'
            }
            // cuma isi title
            else if (!addForm.subCategory && addForm.title && !isChecklistFill) {
                return '#A3A3A3'
            }
            // cuma isi sub category & title
            else if (addForm.subCategory && addForm.title && !isChecklistFill) {
                return '#A3A3A3'
            }
            // cuma isi sub category & checklist
            else if (addForm.subCategory && !addForm.title && isChecklistFill) {
                return '#A3A3A3'
            }
            // cuma isi title & checklist
            else if (!addForm.subCategory && addForm.title && isChecklistFill) {
                return '#A3A3A3'
            }
            else {
                return '#3788FD'
            }
        }
        return '#A3A3A3'
    }

    function checkColor() {
        const isChecklistFill = checklistDescriptionList.every((item) => item.trim())
        if (!addForm.ayat) {
            if (!addForm.title) {
                return 'black'
            }
            else {
                return 'white'
            }
        }
        else if (addForm.ayat) {
            // tidak ada di isi
            if (!addForm.subCategory && !addForm.title && !isChecklistFill) {
                return 'black'
            }
            // cuma isi sub category
            else if (addForm.subCategory && !addForm.title && !isChecklistFill) {
                return 'black'
            }
            // cuma isi checklist
            else if (!addForm.subCategory && !addForm.title && isChecklistFill) {
                return 'black'
            }
            // cuma isi title
            else if (!addForm.subCategory && addForm.title && !isChecklistFill) {
                return 'black'
            }
            // cuma isi sub category & title
            else if (addForm.subCategory && addForm.title && !isChecklistFill) {
                return 'black'
            }
            // cuma isi sub category & checklist
            else if (addForm.subCategory && !addForm.title && isChecklistFill) {
                return 'black'
            }
            // cuma isi title & checklist
            else if (!addForm.subCategory && addForm.title && isChecklistFill) {
                return 'black'
            }
            else {
                return 'white'
            }
        }
        return 'black'
    }



    return (
        <div>
            <Modal
                width={800}
                centered
                open={props.isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                closeIcon={<FontAwesomeIcon icon={faCircleXmark} style={{ color: "#3788fd", fontSize: '24px' }} />}
                footer={[]}
                maskClosable={false}
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
                        }}>Set as Checklist?</p>

                        <div style={{ marginLeft: '48px', paddingTop: '6px', flexGrow: 1 }}>
                            <Form.Item<AddSubCategoryType>
                                name="isSecond"
                                initialValue={false}
                                rules={[{ required: true }]}
                            >
                                <Radio.Group
                                    onChange={onAyatRadioChange}
                                    value={isDijadikanAyat}>
                                    <Radio value={false}><span style={{ fontSize: '18px' }}>No</span></Radio>
                                    <Radio value={true}><span style={{ fontSize: '18px' }}>Yes</span></Radio>
                                </Radio.Group>
                            </Form.Item>

                            {
                                isDijadikanAyat &&
                                <Form.Item<AddSubCategoryType>
                                    name="id"
                                    rules={[{ required: true, message: 'Please select sub-category' }]}
                                >
                                    <TreeSelect
                                        showSearch
                                        placeholder="Choose the sub-category that will be given a checklist"
                                        // optionFilterProp="children"
                                        // filterOption={filterOption}
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        treeDefaultExpandAll
                                        dropdownMatchSelectWidth={false}
                                        treeData={
                                            dataArray?.map(Q => {
                                                return {
                                                    title: Q.title,
                                                    value: Q.id,
                                                }
                                            })
                                        }
                                        size='large'
                                        style={{ width: '100%' }}
                                        onChange={(value) => {
                                            setAddForm(prev => {
                                                return { ...prev, subCategory: value }
                                            })
                                        }}
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
                                onChange={e => setAddForm(prev => {
                                    return { ...prev, title: e.target.value }
                                })}
                                placeholder='Insert title' style={{ fontSize: '18px' }}
                            />
                        </div>
                    </Form.Item>
                    <br />
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
                                    <TextArea
                                        rows={4}
                                        placeholder='Insert checklist description'
                                        value={Q}
                                        required
                                        onChange={e => {
                                            setAddForm(prev => {
                                                return { ...prev, checkList: [e.target.value] }
                                            })
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
                                }} style={{ backgroundColor: '#3788FD', color: 'white' }}>Add another checklist</Button>
                            <Button type='primary'
                                danger
                                size='large'
                                onClick={() => {
                                    const updatedList = checklistDescriptionList.slice(0, 1);
                                    setAddForm(prev => {
                                        return { ...prev, checkList: updatedList }
                                    })
                                    setChecklistDescriptionList(updatedList);
                                }} style={{ marginLeft: '16px' }}
                                disabled={checklistDescriptionList.length === 1}>Delete checklist</Button>
                        </>
                    }

                    <Form.Item style={{ textAlign: 'right' }}>
                        <Button key="submit" type="default" htmlType='submit' loading={loading}
                            size='large'
                            style={{
                                backgroundColor: checkBackgroundColor(),
                                color: checkColor(),
                            }}
                            disabled={
                                checkAddButton()
                            }>
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
                closable={false}
                maskClosable={false}
            >
                <Result
                    status={formResult.status}
                    title={formResult.message.split('\n').map((line, index) => (
                        <React.Fragment key={index}>
                            {line}
                            {index < formResult.message.split('\n').length - 1 && <br />}
                        </React.Fragment>
                    ))}
                    style={{ fontSize: '32px', fontWeight: 'bold' }}
                />


            </Modal>
        </div>
    );
};

export default AddSubCategoryModal;
