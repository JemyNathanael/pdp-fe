import { Authorize } from "@/components/Authorize";
import { Input, Row, Select } from 'antd';
import { Title } from '@/components/Title';
import { Page } from "@/types/Page";
import { WithCategoryLayout } from '@/components/CategoryLayout';
import { Controller, useForm } from "react-hook-form";
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import useSWR from 'swr';
import { BackendApiUrl } from "@/functions/BackendApiUrl";
import { useSwrFetcherWithAccessToken } from "@/functions/useSwrFetcherWithAccessToken";
import { useFetchWithAccessToken } from "@/functions/useFetchWithAccessToken";
import { useRouter } from "next/router";

const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false
});

interface SendNotification {
    groupUser: number[],
    recipientEmail: string[],
    subject: string, 
    description: string,
}

interface DropdownModel {
    id: number,
    name: string,
    email: string,
}

const SendNotification: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const swrFetcher = useSwrFetcherWithAccessToken();
    const { fetchPOST } = useFetchWithAccessToken();
    const { control, handleSubmit, reset } = useForm<SendNotification>({});
    const { data: recipient } = useSWR<DropdownModel[]>(BackendApiUrl.getEmailList, swrFetcher);
    const { data: groupUser } = useSWR<DropdownModel[]>(BackendApiUrl.getGroupUserList, swrFetcher);

    const groupUserOption = groupUser?.map((item) => ({
        label: item.name,
        value: item.id,
    }));

    const groupRecipientOption = recipient?.map((item) => ({
        label: item.email,
        value: item.email,
    }));

    const onSubmit = async (formData: SendNotification) => {
        const payload = {
            Id: id,
            GroupUser: formData.groupUser,
            RecipientEmail: formData.recipientEmail,
            Subject: formData.subject,
            Description: formData.description.replace(/<[^>]+>/g, '')
        }

        const response = await fetchPOST(BackendApiUrl.createIncidentNotification, payload);
        if (response.data) {
            reset()
            console.log(formData)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-10">
                <p className="font-bold text-lg mb-2 bg">Input Group User</p>
                <Controller
                    name="groupUser"
                    control={control}
                    render={({ field }) => (
                        <Select
                            className={`border-2 rounded mt-2.5 p-2 h-100 custom-select bg-white`}
                            size={"middle"}
                            bordered={false}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            options={groupUserOption}
                            mode="multiple"
                        >
                        </Select>
                    )}
                />
            </div>

            <div className="mt-10">
                <p className="font-bold text-lg mb-2 bg">Input Recipient Email</p>
                <Controller
                    name="recipientEmail"
                    control={control}
                    render={({ field }) => (
                        <Select
                            className={`border-2 rounded mt-2.5 p-2 h-100 custom-select bg-white`}
                            size={"middle"}
                            bordered={false}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            options={groupRecipientOption}
                            mode="multiple"
                        >
                        </Select>
                    )}
                />
            </div>

            <div className="mt-10">
                <p className="font-bold text-lg mb-2 bg">Subject / Title</p>
                <Controller
                    name="subject"
                    control={control}
                    render={({ field }) => (
                        <Input
                            className={`border-2 rounded mt-2.5 p-2 h-100`}
                            {...field}
                        />
                    )}
                />
            </div>

            <div className="mt-10">
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
                    <button type="submit" className={`bg-[#3788FD] text-white px-5 py-2 rounded w-[100px]`}>Sent</button>
                </div>
            </div>
        </form>
    );
}

const SendNotificationPage: Page = () => {
    return (
        <Authorize>
            <Title>Incident List</Title>
            <Row className="mb-4">
                <p className="text-base font-semibold text-gray-500">Data Breach and Incident Management/ Incident List</p>
                <p className="text-base font-semibold text-blue-500 ml-1"> / Send Notification</p>
            </Row>
            <SendNotification></SendNotification>
        </Authorize>
    );
}

SendNotificationPage.layout = WithCategoryLayout;
export default SendNotificationPage;
