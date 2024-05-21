import { Authorize } from "@/components/Authorize";
import { Input, Row, Tabs, TabsProps } from 'antd';
import { BackendApiUrl } from "@/functions/BackendApiUrl";
import { Title } from '@/components/Title';
import { useSwrFetcherWithAccessToken } from "@/functions/useSwrFetcherWithAccessToken";
import { Page } from "@/types/Page";
import { WithCategoryLayout } from '@/components/CategoryLayout';
import { useRouter } from "next/router";
import useSWR from 'swr';
import { useEffect, useState } from "react";
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { useFetchWithAccessToken } from "@/functions/useFetchWithAccessToken";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPerson } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false
});

interface IncidentDetail {
    id: string;
    processStageId: number;
    incidentTypeName: string;
    incidentDetail: string;
    reportBy: string;
    picUserName: string;
    reportDate: string;
    dueDate: string;
    rootCause: string,
    remediationAction: string,
    feedback: string,
    histories: IncidentHistory[]
}

interface IncidentHistory {
    history: string,
}

interface IncidentInvestigating {
    RootCause: string,
    RemediationAction: string,
}

interface IncidentRemediation {
    IsNeedRevision: boolean,
    IsActionValid: boolean,
    Feedback: string,
}

const incidentInvestigatingSchema = z.object({
    RootCause: z.string({ required_error: 'Root cause can\'t be empty' }).min(1, 'Root cause can\'t be empty'),
    RemediationAction: z.string({ required_error: 'Remediation action can\'t be empty' }).min(1, 'Remediation action can\'t be empty'),
})

const IncidentDetail: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const swrFetcher = useSwrFetcherWithAccessToken();
    const { fetchPOST, fetchPUT } = useFetchWithAccessToken();
    const { data } = useSWR<IncidentDetail>(`${BackendApiUrl.getIncidentDetail}?Id=${id}`, swrFetcher);
    const { data: session } = useSession();
    const displayUserEmail = session?.user?.email;
    const [processStage, setProcessStage] = useState(data?.processStageId);

    useEffect(() => {
        if (data && data.processStageId !== undefined) {
            setProcessStage(data.processStageId);
        }
    }, [data]);

    const RenderProgressStageTria = ({ id }) => {
        const progressStages = [
            { id: 41, name: 'Not Started', color: 'bg-[#FFFACB]' },
            { id: 42, name: 'Investigating', color: 'bg-[#FFFACB]' },
            { id: 43, name: 'Remediating', color: 'bg-[#FFFACB]' },
            { id: 44, name: 'Completed', color: 'bg-[#FFFACB]' }
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

    const RenderIncidentDetail = ({ data }) => {
        return (
            <form>
                <div className="w-full">
                    <span className="font-bold text-xl">Incident Type</span>
                    <Input value={data?.incidentTypeName} className={`border-2 rounded mt-2.5 p-3.5`} />
                </div>

                <div className="w-full mt-5">
                    <span className="font-bold text-xl">Incident Detail</span>
                    <Input.TextArea rows={4} value={data?.incidentDetail} className={`border-2 rounded mt-2.5 p-3.5`} />
                </div>

                <div className="mt-5 flex justify-between">
                    <div className="w-full mr-5">
                        <span className="font-bold text-xl">Report By</span>
                        <Input value={data?.reportBy} className={`border-2 rounded mt-2.5 p-3.5`} />
                    </div>
                    <div className="w-full">
                        <span className="font-bold text-xl">Assign To</span>
                        <Input value={data?.picUserName} className={`border-2 rounded mt-2.5 p-3.5`} />
                    </div>
                </div>


                <div className="mt-5 flex justify-between" style={{ marginBottom: 90 }}>
                    <div className="w-full mr-5">
                        <span className="font-bold text-xl">Report Date</span>
                        <Input type="date" value={data?.reportDate.substring(0, 10)} className={`border-2 rounded mt-2.5 p-3.5`} />
                    </div>
                    <div className="w-full">
                        <span className="font-bold text-xl">Due Date</span>
                        <Input type="date" value={data?.dueDate.substring(0, 10)} className={`border-2 rounded mt-2.5 p-3.5`} />
                    </div>
                </div>

                {processStage == 41 &&
                    <div className="fixed bottom-0 left-0 right-0 bg-gray-100">
                        <hr style={{ margin: '20px 0' }} />
                        <div className='flex justify-end px-5 py-3'>
                            <button className={`bg-[#3788FD] text-white px-5 py-2 rounded w-[100px]`} onClick={() => setProcessStage(42)}>Next</button>
                        </div>
                    </div>
                }
            </form>
        );
    }

    const RenderInvestigatingTask = () => {
        const { control, formState: { errors }, handleSubmit } = useForm<IncidentInvestigating>({
            resolver: zodResolver(incidentInvestigatingSchema),
        });

        const onSubmit = async (formData: IncidentInvestigating, action: 'save' | 'submit') => {
            if (processStage) {
                const payload = {
                    Id: id,
                    RootCause: formData.RootCause.replace(/<[^>]+>/g, ''),
                    RemediationAction: formData.RemediationAction.replace(/<[^>]+>/g, ''),
                    Actor: displayUserEmail,
                    IsSubmitted: action === 'submit' ? true : false,
                    ProcessStageId: action === 'submit' ? 43 : 42,
                };

                const response = await fetchPOST<IncidentInvestigating>(BackendApiUrl.createIncidentInvestigating, payload);
                if (response.data) {
                    if (action === 'submit') {
                        setProcessStage(43);
                    }
                    if (action === 'save') {
                        setProcessStage(42);
                        router.push(`/${router.query['categoryId']}/IncidentList`);
                    }
                }
            }
        };

        return (
            <div>
                <div className="w-full">
                    <p className="font-bold text-lg mb-2 bg">Root Cause</p>
                    <Controller
                        name="RootCause"
                        control={control}
                        render={({ field }) => (
                            <ReactQuill
                                className="bg-white"
                                theme="snow"
                                value={field.value || data?.rootCause}
                                onChange={(value) => {
                                    field.onChange(value)
                                }}
                            />
                        )}
                    />
                    {errors.RootCause && (
                        <p className="text-md text-red-600 font-normal font-body mt-1.5">{errors.RootCause?.message}</p>
                    )}
                </div>

                <div className="w-full mt-10" style={{ marginBottom: 90 }}>
                    <p className="font-bold text-lg">Remediation Action</p>
                    <Controller
                        name="RemediationAction"
                        control={control}
                        render={({ field }) => (
                            <ReactQuill
                                className="bg-white"
                                theme="snow"
                                value={field.value || data?.remediationAction}
                                onChange={(value) => {
                                    field.onChange(value)
                                }}
                            />
                        )}
                    />
                    {errors.RemediationAction && (
                        <p className="text-md text-red-600 font-normal font-body mt-1.5">{errors.RemediationAction?.message}</p>
                    )}
                </div>

                <div className="fixed bottom-0 left-0 right-0 bg-gray-100">
                    <hr style={{ margin: '20px 0' }} />
                    <div className='flex justify-end px-5 py-3'>
                        <form onSubmit={handleSubmit((formData) => onSubmit(formData, 'save'))}>
                            <button type="button" className={`border border-[#3788FD] text-[#3788FD] px-5 py-2 mr-3 rounded`}>Save & Exit</button>
                        </form>
                        <form onSubmit={handleSubmit((formData) => onSubmit(formData, 'submit'))}>
                            <button type="submit" className={`bg-[#3788FD] text-white px-5 py-2 rounded w-[100px]`}>Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    const RenderRemediationTask = () => {
        const { control, handleSubmit } = useForm<IncidentRemediation>({
            defaultValues: {
                Feedback: "-" || data?.feedback
            }
        });

        const [needsRevision, setNeedsRevision] = useState(false);
        const [actionValid, setActionValid] = useState(false);

        const handleRevisiClick = (value) => {
            setNeedsRevision(value);
        };

        const handleActionClick = (value) => {
            setActionValid(value);
        };

        const revisiData = [
            { label: 'Ya', value: true },
            { label: 'Tidak', value: false }
        ];

        const actionData = [
            { label: 'Sesuai', value: true },
            { label: 'Tidak Sesuai', value: false }
        ];

        const onSubmit = async (formData: IncidentRemediation, action: 'save' | 'submit') => {
            if (processStage) {
                const payload = {
                    Id: id,
                    IsNeedRevision: needsRevision,
                    IsActionValid: actionValid,
                    Actor: displayUserEmail,
                    IsReviewSubmitted: action === 'submit' ? true : false,
                    ProcessStageId: action === 'submit' ? 44 : 43,
                    Feedback: formData.Feedback.replace(/<[^>]+>/g, '')
                };
                const response = await fetchPUT<IncidentRemediation>(BackendApiUrl.createIncidentRemdiation, payload);
                if (response.data) {
                    if (action === 'submit') {
                        setProcessStage(44);
                    }
                    if (action === 'save') {
                        setProcessStage(43);
                        router.push(`/${router.query['categoryId']}/IncidentList`);
                    }
                }
            }
        };

        return (
            <div>
                <div className="w-full">
                    <span className="font-bold text-xl">Root Cause</span>
                    <Input.TextArea rows={4} value={data?.rootCause || ""} className={`border-2 rounded mt-2.5 p-3.5`} />

                    <div className="mt-3">
                        <p className="font-bold text-base mb-3">Perlu Revisi</p>
                        <div className="flex flex-row">
                            {revisiData.map((button) => (
                                <div key={button.label}
                                    className={`rounded font-medium px-5 py-1 mr-3 ${needsRevision === button.value ? 'bg-[#3788FD] text-white' : 'border-2 border-[#3788FD] text-[#3788FD]'}`}
                                    onClick={() => handleRevisiClick(button.value)}
                                >
                                    {button.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="w-full mt-5" style={{ marginBottom: 90 }}>
                    <span className="font-bold text-xl">Remediation Action</span>
                    <Input.TextArea rows={4} value={data?.remediationAction || ""} className={`border-2 rounded mt-2.5 p-3.5`} />
                    <div className="mt-3">
                        <p className="font-bold text-base mb-3">Hasil</p>
                        <div className="flex flex-row mb-5">
                            {actionData.map((button) => (
                                <div key={button.label}
                                    className={`rounded font-medium px-5 py-1 mr-3 ${actionValid === button.value ? 'bg-[#3788FD] text-white' : 'border-2 border-[#3788FD] text-[#3788FD]'}`}
                                    onClick={() => handleActionClick(button.value)}
                                >
                                    {button.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: 90 }}>
                    {(needsRevision || !actionValid) &&
                        <Controller
                            name="Feedback"
                            control={control}
                            render={({ field }) => (
                                <ReactQuill
                                    className="bg-white"
                                    theme="snow"
                                    value={field.value}
                                    onChange={(value) => {
                                        field.onChange(value);
                                    }}
                                />
                            )}
                        />
                    }
                </div>

                <div className="fixed bottom-0 left-0 right-0 bg-gray-100">
                    <hr style={{ margin: '20px 0' }} />
                    <div className='flex justify-end px-5 py-3'>
                        <form onSubmit={handleSubmit((formData) => onSubmit(formData, 'save'))}>
                            <button type="button" className={`border border-[#3788FD] text-[#3788FD] px-5 py-2 mr-3 rounded`}>Save & Exit</button>
                        </form>
                        <form onSubmit={handleSubmit((formData) => onSubmit(formData, 'submit'))}>
                            <button type="submit" className={`bg-[#3788FD] text-white px-5 py-2 rounded w-[100px]`}>Complete</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    const RenderRemediationHistory = () => {
        return (
            <div>
                {data && (
                    data.histories.map((item, index) => (
                        <div className="flex items-center mb-3" key={index}>
                            <p className="bg-slate-300 p-3 rounded-full w-10 h-10 flex items-center justify-center mr-5">
                                <FontAwesomeIcon icon={faPerson} color="black"></FontAwesomeIcon>
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
                <div className="w-full">
                    <span className="font-bold text-xl">Root Cause</span>
                    <Input.TextArea rows={4} value={data?.rootCause} className={`border-2 rounded mt-2.5 p-3.5`} />
                </div>

                <div className="w-full mt-5">
                    <span className="font-bold text-xl">Remediation Action</span>
                    <Input.TextArea rows={4} value={data?.remediationAction || ""} className={`border-2 rounded mt-2.5 p-3.5`} />
                </div>

                <div className="fixed bottom-0 left-0 right-0 bg-gray-100">
                    <hr style={{ margin: '20px 0' }} />
                    <div className='flex justify-end px-5 py-3'>
                        <button className={`bg-[#3788FD] text-white px-5 py-2 rounded`}
                            onClick={() => router.push(`/${router.query['categoryId']}/IncidentList`)}>Return to List</button>
                    </div>
                </div>
            </div>
        )
    }

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Detail',
            children: <RenderIncidentDetail data={data} />,
        },
        {
            key: '2',
            label: 'Task',
            children: <RenderInvestigatingTask />,
        },
        {
            key: '3',
            label: 'Task',
            children: <RenderRemediationTask />,
        },
        {
            key: '4',
            label: 'History',
            children: <RenderRemediationHistory />,
        },
    ];

    return (
        <div>
            <RenderProgressStageTria id={processStage} />
            {processStage == 41 && <RenderIncidentDetail data={data} />}
            {processStage == 42 && <Tabs defaultActiveKey="2" items={items.filter(item => item.key <= '2')} />}
            {processStage == 43 && <Tabs defaultActiveKey="3" items={items.filter(item => item.key !== '2')} />}
            {processStage == 44 && <RenderCompleted />}
        </div>
    );
}

const IncidentDetailPage: Page = () => {
    return (
        <Authorize>
            <Title>Incident List</Title>
            <div>
                <Row className="mb-4">
                    <p className="text-base font-semibold text-gray-500"> Data Breach and Incident Management / Incident List</p>
                    <p className="text-base font-semibold text-blue-500 ml-1"> / Detail</p>
                </Row>
                <IncidentDetail></IncidentDetail>
            </div>
        </Authorize>
    );
}

IncidentDetailPage.layout = WithCategoryLayout;
export default IncidentDetailPage;
