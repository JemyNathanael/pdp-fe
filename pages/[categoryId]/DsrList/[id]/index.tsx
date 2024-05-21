import { Authorize } from "@/components/Authorize";
import { AutoComplete, Input, Row, Tabs, TabsProps, Modal, DatePicker, Select } from 'antd';
import { BackendApiUrl } from "@/functions/BackendApiUrl";
import { Title } from '@/components/Title';
import { useSwrFetcherWithAccessToken } from "@/functions/useSwrFetcherWithAccessToken";
import { Page } from "@/types/Page";
import { WithCategoryLayout } from '@/components/CategoryLayout';
import { useRouter } from "next/router";
import useSWR from 'swr';
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFetchWithAccessToken } from "@/functions/useFetchWithAccessToken";
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false
});

interface DsrDetail {
    id: string;
    processStageId: number;
    requestTypeName: string;
    requestDetail: string;
    requesterName: string;
    requesterEmail: string;
    dob: string;
    requestDate: string;
    dueDate: string,
    assignToUserId: string,
    histories: DsrHistory[]
}

interface DsrHistory {
    history: string
}

interface Pic {
    assignToUserId: string,
}

interface DropdownModel {
    id: string,
    name: string
}

interface DsrVerification {
    isValidIdentity: boolean,
    isValidRequest: boolean,
}

interface DsrOnProgress {
    completionDate: Date,
    actionDetail: string,
}

const createDsrPicSchema = z.object({
    assignToUserId: z.string({ required_error: 'PIC name can\'t be empty' }).min(1, 'PIC name can\'t be empty'),
});

const createDsrVerificationSchema = z.object({
    isValidIdentity: z.boolean({ required_error: 'Valid Identity name can\'t be empty' }),
    isValidRequest: z.boolean({ required_error: 'Valid Request can\'t be empty' })
});

const createDsrOnProgressSchema = z.object({
    completionDate: z.string({ required_error: 'Completion date can\'t be empty' }),
    actionDetail: z.string({ required_error: 'Action detail can\'t be empty' }).min(1, 'Action Detail can\'t be empty'),
});

const DsrtDetail: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const swrFetcher = useSwrFetcherWithAccessToken();
    const { fetchPUT } = useFetchWithAccessToken();
    const { data } = useSWR<DsrDetail>(`${BackendApiUrl.getDsrDetail}?Id=${id}`, swrFetcher);
    const [processStage, setProcessStage] = useState(data?.processStageId);

    useEffect(() => {
        if (data && data.processStageId !== undefined) {
            setProcessStage(data.processStageId);
        }
    }, [data]);

    const RenderProcessStage = ({ id }) => {
        const progressStages = [
            { id: 45, name: 'Not Started', color: 'bg-[#FFFACB]' },
            { id: 46, name: 'Verification', color: 'bg-[#FFFACB]' },
            { id: 47, name: 'On Progress', color: 'bg-[#FFFACB]' },
            { id: 48, name: 'Completed', color: 'bg-[#FFFACB]' }
        ];

        const stages = progressStages.map(stage => {
            const shouldColor = (stage.id === id || (stage.id < id));
            return {
                ...stage,
                color: shouldColor ? 'bg-[#FFE500]' : stage.color
            };
        });

        return (
            <div className="grid grid-cols-4 mt-10 mb-10 ">
                {stages.map((stage, index) => (
                    <div key={index} className={`${stage.color} p-3 ${index === 0 ? 'rounded rounded-l-full' : (index === stages.length - 1 ? 'rounded rounded-r-full' : '')} ${index !== stages.length - 1 ? 'border-r-2 border-black' : ''}`}>
                        <p className="font-bold text-center">{stage.name}</p>
                    </div>
                ))}
            </div>
        );
    }

    const RenderDsrDetail = ({ data }) => {
        const [inputValue, setInputValue] = useState('');

        const { control, formState: { errors }, handleSubmit, setValue } = useForm<Pic>({
            resolver: zodResolver(createDsrPicSchema),
        });

        const onSubmit = async (formData: Pic) => {
            const payload = {
                Id: id,
                ...formData
            }
            console.log(payload)
            const response = await fetchPUT(BackendApiUrl.createAssignPic, payload);
            if (response.data) {
                window.location.reload();
            }
        }

        const { data: picList } = useSWR<DropdownModel[]>(`${BackendApiUrl.getUserNameList}`, swrFetcher);
        const picOption = picList?.map((item) => ({
            label: item.name,
            value: item.id,
        }));

        // set selected option and render the label
        const onSelect = (data, option) => {
            setInputValue(option.label);
        };

        // on input change
        const onChange = (data) => {
            setInputValue(data)
            setValue("assignToUserId", data);
        };

        return (
            <div>
                <div className="w-full mt-5">
                    <span className="font-bold text-xl">Request Type</span>
                    <Input value={data?.requestTypeName} className={`border-2 rounded mt-2.5 p-3.5`} />
                </div>

                <div className="w-full mt-5">
                    <span className="font-bold text-xl">Request Detail</span>
                    <Input.TextArea rows={4} value={data?.requestDetail} className={`border-2 rounded mt-2.5 p-3.5`} />
                </div>

                <p className="font-bold text-xl mb-2 mt-5">Requester</p>
                <div className="flex mt-5">
                    <div className="w-full mr-5">
                        <span className="font-base text-xl">Name</span>
                        <Input value={data?.requesterName} className={`border-2 rounded mt-2.5 p-3.5`} />
                    </div>

                    <div className="w-full mr-5">
                        <span className="font-base text-xl">Email</span>
                        <Input value={data?.requesterEmail} className={`border-2 rounded mt-2.5 p-3.5`} />
                    </div>

                    <div className="w-full">
                        <span className="font-base text-xl">Birth Date</span>
                        <Input value={data?.dob.substring(0, 10)} className={`border-2 rounded mt-2.5 p-3.5`} />
                    </div>
                </div>

                <div className="flex mt-5">
                    <div className="w-full mr-5">
                        <span className="font-bold text-xl">Request Date</span>
                        <Input value={data?.requestDate.substring(0, 10)} className={`border-2 rounded mt-2.5 p-3.5`} />
                    </div>

                    <div className="w-full mr-5">
                        <span className="font-bold text-xl">Due Date</span>
                        <Input value={data?.dueDate.substring(0, 10)} className={`border-2 rounded mt-2.5 p-3.5`} />
                    </div>

                    <div className="w-full"></div>
                </div>

                {processStage == 45 ?
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="w-full mt-5" style={{ marginBottom: 90 }}>
                            <span className="font-bold text-xl">PIC Name</span>
                            <Controller
                                name="assignToUserId"
                                control={control}
                                render={(field) => (
                                    <div>
                                        <AutoComplete
                                            {...field}
                                            value={inputValue}
                                            options={picOption}
                                            style={{ width: 1000 }}
                                            filterOption={(inputValue, option) =>
                                                option.label.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                            }
                                            onSelect={onSelect}
                                            onChange={onChange}
                                            bordered={false}
                                            className={`border-2 rounded mt-2.5 p-3 bg-white`}
                                        />
                                    </div>
                                )}
                            />
                            {errors.assignToUserId && (
                                <p className="text-md text-red-600 font-normal font-body mt-1.5">{errors.assignToUserId?.message}</p>
                            )}
                        </div>

                        <div className="fixed bottom-0 left-0 right-0 bg-gray-100">
                            <hr style={{ margin: '20px 0' }} />
                            <div className='flex justify-end px-5 py-3'>
                                <button className={`bg-[#3788FD] text-white px-5 py-2 rounded w-[100px]`}>Next</button>
                            </div>
                        </div>
                    </form>
                    :
                    <div className="w-full mt-5">
                        <span className="font-bold text-xl">PIC Name</span>
                        <Input value={data?.assignToUserId} className={`border-2 rounded mt-2.5 p-3.5`} />
                    </div>
                }
            </div>
        );
    }

    const RenderVerificationTask = () => {
        const [rejectModalVisible, setRejectModalVisible] = useState<boolean>(false);
        const [rejectValue, setRejectValue] = useState("");
        const { control, formState: { errors }, handleSubmit } = useForm<DsrVerification>({
            resolver: zodResolver(createDsrVerificationSchema),
        });

        const { TextArea } = Input;

        const onSubmit = async (formData: DsrVerification) => {
            const payload = {
                Id: id,
                RejectReason: rejectValue,
                ...formData
            }

            const response = await fetchPUT(BackendApiUrl.createDsrVerification, payload);
            if (response.data) {
                window.location.reload();
            }
        }

        const handleRejectReasonChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
            const value = event.target.value;
            setRejectValue(value);
        };

        const handleSubmitReject = () => {
            setRejectModalVisible(false);
        };

        return (
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="w-full mt-5">
                        <span className="font-bold text-xl">Is the Identity valid?</span>
                        <Controller
                            name="isValidIdentity"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    className={`border-2 rounded mt-2.5 p-3.5 h-100 custom-select bg-white`}
                                    size={"middle"}
                                    bordered={false}
                                    options={[{ value: true, label: 'Yes' }, { value: false, label: 'No' }]}
                                ></Select>
                            )}
                        />
                        {errors.isValidIdentity && <p className="text-md text-red-600 font-normal font-body mt-1.5">{errors.isValidIdentity?.message}</p>}
                    </div>

                    <div className="w-full mt-5">
                        <span className="font-bold text-xl">Is the Request valid?</span>
                        <Controller
                            name="isValidRequest"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    className={`border-2 rounded mt-2.5 p-3.5 h-100 custom-select bg-white`}
                                    size={"middle"}
                                    bordered={false}
                                    options={[{ value: true, label: 'Yes' }, { value: false, label: 'No' }]}
                                ></Select>
                            )}
                        />
                        {errors.isValidRequest && <p className="text-md text-red-600 font-normal font-body mt-1.5">{errors.isValidRequest?.message}</p>}
                    </div>

                    <div className="fixed bottom-0 left-0 right-0 bg-gray-100">
                        <hr style={{ margin: '20px 0' }} />
                        <div className='flex justify-end px-5 py-3'>
                            <button type="button" className={`border border-[#3788FD] text-[#3788FD] px-5 py-2 rounded w-[100px] mr-5`} onClick={() => setRejectModalVisible(true)}>Reject</button>
                            <button type="submit" className={`bg-[#3788FD] text-white px-5 py-2 rounded w-[100px]`}>Next</button>
                        </div>
                    </div>

                </form >
                {rejectModalVisible &&
                    <Modal
                        open={rejectModalVisible}
                        onCancel={() => setRejectModalVisible(false)}
                        centered
                        footer={false}
                    >
                        <div className='p-5'>
                            <h4 className='text-md sm:text-lg font-body mb-2 sm:mb-3'>Harap masukkan alasan penolakan request</h4>
                            <TextArea
                                rows={5}
                                className='text-slate-500'
                                value={rejectValue}
                                onChange={handleRejectReasonChange}
                            />
                            <div className="flex justify-end mt-3">
                                <button onClick={handleSubmitReject} className={`bg-[#3788FD] text-white px-5 py-2 rounded w-[100px]`}>Reject</button>
                            </div>
                        </div>
                    </Modal>
                }
            </div>
        )
    }

    const RenderProgressTask = () => {
        const { control, formState: { errors }, handleSubmit } = useForm<DsrOnProgress>({
            resolver: zodResolver(createDsrOnProgressSchema),
        });

        const onSubmit = async (formData: DsrOnProgress) => {
            const payload = {
                Id: id,
                CompletionDate: formData.completionDate,
                ActionDetail: formData.actionDetail.replace(/<[^>]+>/g, '')
            }
            const response = await fetchPUT(BackendApiUrl.createDsrProgress, payload);
            if (response.data) {
                window.location.reload();
            }
        }

        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="w-full mt-5">
                    <span className="font-bold text-lg">PIC Name</span>
                    <Input value={data?.assignToUserId} className={`border-2 rounded mt-2.5 p-3.5`} />
                </div>

                <div className="flex mt-5">
                    <div className="w-96">
                        <span className="font-bold text-lg">Completion Date</span>
                        <Controller
                            name="completionDate"
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    value={field.value ? dayjs(field.value) : null}
                                    onChange={(date) => { field.onChange(date ? date.toISOString() : null) }}
                                    className={`border-2 rounded mt-2.5 p-3.5 w-full`}
                                />
                            )}
                        />
                        {errors.completionDate && (
                            <p className="text-md text-red-600 font-normal font-body mt-1.5">{errors.completionDate?.message}</p>
                        )}
                    </div>
                </div>

                <div className="w-full mt-5" style={{ marginBottom: 90 }}>
                    <p className="font-bold text-lg mb-2 bg">Action Detail</p>
                    <Controller
                        name="actionDetail"
                        control={control}
                        render={({ field }) => (
                            <ReactQuill
                                className="bg-white"
                                theme="snow"
                                placeholder="Insert action detail"
                                value={field.value}
                                onChange={(value) => {
                                    field.onChange(value)
                                }}
                            />
                        )}
                    />
                    {errors.actionDetail && (
                        <p className="text-md text-red-600 font-normal font-body mt-1.5">{errors.actionDetail?.message}</p>
                    )}
                </div>

                <div className="fixed bottom-0 left-0 right-0 bg-gray-100">
                    <hr style={{ margin: '20px 0' }} />
                    <div className='flex justify-end px-5 py-3'>
                        <button type="submit" className={`bg-[#3788FD] text-white px-5 py-2 rounded`}>Complete This Request</button>
                    </div>
                </div>
            </form>
        )
    }

    const RenderProgressHistory = () => {
        return (
            <div className="mt-5">
                {data && (
                    data.histories.map((item, index) => (
                        <div className="flex items-center mb-3" key={index}>
                            <p className="bg-slate-300 p-3 rounded-full w-10 h-10 flex items-center justify-center mr-5">
                                <FontAwesomeIcon icon={faUser} color="black"></FontAwesomeIcon>
                            </p>
                            <div>
                                <p>{item.history}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        )
    }

    const RenderCompleted = () => {
        return (
            <div>
                <p className="font-bold text-lg">Request yang anda terima telah selesai ditangani, anda masih dapat melihat detail request ini dengan memilih request dari halaman daftar request.</p>
                <div className="fixed bottom-0 left-0 right-0 bg-gray-100">
                    <hr style={{ margin: '20px 0' }} />
                    <div className='flex justify-end px-5 py-3'>
                        <button type="submit" className={`bg-[#3788FD] text-white px-5 py-2 rounded`}
                            onClick={() => router.push(`/${router.query['categoryId']}/DsrList`)}>Return To List</button>
                    </div>
                </div>
            </div>
        )
    }

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Detail',
            children: <RenderDsrDetail data={data} />,
        },
        {
            key: '2',
            label: 'Task',
            children: <RenderVerificationTask />,
        },
        {
            key: '3',
            label: 'Task',
            children: <RenderProgressTask />,
        },
        {
            key: '4',
            label: 'History',
            children: <RenderProgressHistory />,
        },
    ];

    return (
        <div>
            <RenderProcessStage id={processStage} />
            {processStage == 45 && <RenderDsrDetail data={data} />}
            {processStage == 46 && <Tabs defaultActiveKey="2" items={items.filter(item => item.key <= '2')} />}
            {processStage == 47 && <Tabs defaultActiveKey="2" items={items.filter(item => item.key != '2')} />}
            {processStage == 48 && <RenderCompleted />}
        </div>
    );
}

const DsrDetailPage: Page = () => {
    return (
        <Authorize>
            <Title>Data Subject Right</Title>
            <div>
                <Row className="mb-4">
                    <p className="text-base font-semibold text-gray-500"> Data Subject Right / Request List</p>
                    <p className="text-base font-semibold text-blue-500 ml-1"> / Detail</p>
                </Row>
                <DsrtDetail></DsrtDetail>
            </div>
        </Authorize>
    );
}

DsrDetailPage.layout = WithCategoryLayout;
export default DsrDetailPage;
