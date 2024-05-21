import { Authorize } from "@/components/Authorize";
import { Input, Row, Switch } from 'antd';
import { Title } from '@/components/Title';
import { Page } from "@/types/Page";
import { WithCategoryLayout } from '@/components/CategoryLayout';
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { Controller, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useFetchWithAccessToken } from "@/functions/useFetchWithAccessToken";
import { BackendApiUrl, GetCategoryDetail } from "@/functions/BackendApiUrl";
import useSWR from 'swr';
import router from "next/router";
import { useSwrFetcherWithAccessToken } from "@/functions/useSwrFetcherWithAccessToken";

const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false
});

interface ReminderTemplate {
    subject: string,
    description: string,
    isNeedRemind: boolean
}

interface CategoryDetailModel {
    title: string;
}

const ReminderTemplate: React.FC = () => {
    const categoryId = router.query['categoryId']?.toString() ?? '';
    const swrFetcher = useSwrFetcherWithAccessToken();
    const { data } = useSWR<CategoryDetailModel>(GetCategoryDetail(categoryId), swrFetcher);
    const { fetchPUT } = useFetchWithAccessToken();
    const [showReminder, setShowReminder] = useState<boolean>();
    const { data: subject } = useSWR<ReminderTemplate>(`${BackendApiUrl.getDsrReminder}?ProcessTypeId=36`, swrFetcher);
    const { data: incident } = useSWR<ReminderTemplate>(`${BackendApiUrl.getDsrReminder}?ProcessTypeId=35`, swrFetcher);

    useEffect(() => {
        if (subject) {
            setShowReminder(subject.isNeedRemind)
        }
    }, [subject])

    const { control, handleSubmit } = useForm<ReminderTemplate>({
        defaultValues: {
            subject: data?.title.includes("Incident") ? incident?.subject : subject?.subject,
            description: data?.title.includes("Incident") ? incident?.description : subject?.description,
        },
    });

    const { data: session } = useSession();
    const displayUserName = session?.user?.name;

    const onChange = (checked: boolean) => {
        setShowReminder(checked);
    };

    const onSubmit = async (formData: ReminderTemplate) => {
        const payload = {
            ProcessTypeId: data?.title.includes("Incident") ? 35 : 36,
            UserName: displayUserName,
            IsNeedRemind: showReminder,
            Subject: formData.subject,
            Description: formData.description.replace(/<[^>]+>/g, '')
        }

        if (data?.title.includes("Incident")) {
            const response = await fetchPUT(BackendApiUrl.createIncidentReminder, payload);
            if (response.data) {
                window.location.reload();
            }
        }

        if (data?.title.includes("Data Subject Right")) {
            const response = await fetchPUT(BackendApiUrl.createDsrReminder, payload);
            if (response.data) {
                window.location.reload();
            }
        }
    };

    return (
        <div>
            <Row className="mb-4">
                <p className="text-base font-semibold text-gray-500"> {data?.title.includes("Incident") ? "Data Breach and Incident Management" : "Data Subject Right"}</p>
                <p className="text-base font-semibold text-blue-500 ml-1"> / Reminder Template</p>
            </Row>

            <p className="font-bold text-xl">Need Reminder?</p>
            <Switch checked={showReminder} onChange={onChange} />

            {showReminder && (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mt-10">
                        <p className="font-bold text-lg mb-2 bg">Subject / Title</p>
                        <Controller
                            name="subject"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    className={`border-2 rounded mt-2.5 p-2`}
                                    placeholder="Input subject / title"
                                    {...field}
                                />
                            )}
                        />
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <p className="font-bold text-lg mb-2 bg">Description</p>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <ReactQuill
                                    className="bg-white"
                                    theme="snow"
                                    {...field}
                                />
                            )}
                        />
                    </div>

                    <div className="fixed bottom-0 left-0 right-0 bg-gray-100">
                        <hr style={{ margin: '20px 0' }} />
                        <div className='flex justify-end px-5 py-3'>
                            <button type="submit" className={`bg-[#3788FD] text-white px-5 py-2 rounded w-[100px]`}>Save</button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}

const ReminderTemplatePage: Page = () => {
    return (
        <Authorize>
            <Title>Reminder Template</Title>
            <ReminderTemplate></ReminderTemplate>
        </Authorize>
    );
}

ReminderTemplatePage.layout = WithCategoryLayout;
export default ReminderTemplatePage;