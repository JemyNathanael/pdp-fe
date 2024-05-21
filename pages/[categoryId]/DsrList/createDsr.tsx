import { Authorize } from "@/components/Authorize";
import { DatePicker, Input, Row } from 'antd';
import { Title } from '@/components/Title';
import { Page } from "@/types/Page";
import React, { useState } from "react";
import { WithCategoryLayout } from "@/components/CategoryLayout";
import useSWR from 'swr';
import { BackendApiUrl } from "@/functions/BackendApiUrl";
import { useSwrFetcherWithAccessToken } from "@/functions/useSwrFetcherWithAccessToken";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import dayjs from "dayjs";
import { useFetchWithAccessToken } from "@/functions/useFetchWithAccessToken";
import { addDays } from 'date-fns';

const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false
});

interface DropdownModel {
    id: number,
    name: string
}

interface Dsr {
    requestTypeId: number;
    requestDetail: string;
    requesterName: string;
    requesterEmail: string;
    dob: Date;
    requestDate: Date;
}

const createDsrSchema = z.object({
    requestTypeId: z.number({ required_error: 'Request type can\'t be empty' }).min(1, 'Request type can\'t be empty'),
    requestDetail: z.string({ required_error: 'Request detail can\'t be empty' }).min(1, 'Request detail can\'t be empty'),
    requesterName: z.string({ required_error: 'Name can\'t be empty' }).min(1, 'Name can\'t be empty'),
    requesterEmail: z.string({ required_error: 'Email can\'t be empty' }).min(1, 'Email can\'t be empty'),
    dob: z.string({ required_error: "Birth date cannot be empty" }),
    requestDate: z.string({ required_error: "Request date cannot be empty" }),
});

const CreateDsr: React.FC = () => {
    const swrFetcher = useSwrFetcherWithAccessToken();
    const { fetchPOST } = useFetchWithAccessToken();
    const [selectedRequestType, setSelectedRequestType] = useState<number | null>(null);
    const { data: requestType } = useSWR<DropdownModel[]>(BackendApiUrl.getRequestTypeList, swrFetcher);
    const requestTypeOptions = requestType?.map((item) => ({
        label: item.name,
        value: item.id,
    }));

    const { control, formState: { errors }, handleSubmit, watch, reset } = useForm<Dsr>({
        resolver: zodResolver(createDsrSchema),
    });

    const handleSelectRequestType = (typeId: number) => {
        setSelectedRequestType(typeId);
    };

    const onSubmit = async (formData: Dsr) => {
        const payload = {
            requestTypeId: formData.requestTypeId,
            requestDetail: formData.requestDetail.replace(/<[^>]+>/g, ''),
            requesterName: formData.requesterName,
            requesterEmail: formData.requesterEmail,
            dob: formData.dob,
            requestDate: formData.requestDate,
            dueDate: dueDate.toISOString()
        }
        console.log(payload)
        const response = await fetchPOST(BackendApiUrl.createDsr, payload);
        if (response.data) {
            reset();
        }
    }

    const requestDateStr = watch('requestDate');
    const requestDate = new Date(requestDateStr);
    const dueDate = addDays(requestDate, 3);

    function formatDateToYYYYMMDD(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="w-full">
                    <p className="font-bold text-lg">Request Type</p>
                    <p className="text-base">Pilih salah satu dari pilihan berikut:</p>
                    <div className="flex flex-wrap mt-2">
                        {requestTypeOptions?.map((option) => (
                            <Controller
                                key={option.value}
                                name="requestTypeId"
                                control={control}
                                render={({ field }) => (
                                    <button
                                        {...field}
                                        className={`rounded font-medium px-5 py-1 mr-3 ${selectedRequestType === option.value ? 'bg-[#3788FD] text-white' : 'border-2 border-[#3788FD] text-[#3788FD]'}`}
                                        onClick={() => { field.onChange(option.value); handleSelectRequestType(option.value); }}
                                    >
                                        {option.label}
                                    </button>
                                )}
                            />
                        ))}
                    </div>
                    {errors.requestTypeId && (
                        <p className="text-md text-red-600 font-normal font-body mt-1.5">{errors.requestTypeId?.message}</p>
                    )}
                </div>

                <div className="w-full mt-5">
                    <p className="font-bold text-lg mb-2">Request Detail</p>
                    <Controller
                        name="requestDetail"
                        control={control}
                        render={({ field }) => (
                            <ReactQuill
                                className="bg-white"
                                theme="snow"
                                value={field.value}
                                placeholder="Insert Request"
                                onChange={(value) => {
                                    field.onChange(value)
                                }}
                            />
                        )}
                    />
                    {errors.requestDetail && (
                        <p className="text-md text-red-600 font-normal font-body mt-1.5">{errors.requestDetail?.message}</p>
                    )}
                </div>

                <p className="font-bold text-lg mb-2 mt-5">Requester</p>

                <div className="flex mt-5">
                    <div className="w-full mr-5">
                        <span className="font-base text-lg">Name</span>
                        <Controller
                            name="requesterName"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Insert Full Name"
                                    className={`border-2 rounded mt-2.5 p-3.5`}
                                />
                            )}
                        />
                        {errors.requesterName && (
                            <p className="text-md text-red-600 font-normal font-body mt-1.5">{errors.requesterName?.message}</p>
                        )}
                    </div>

                    <div className="w-full mr-5">
                        <span className="font-base text-lg">Email</span>
                        <Controller
                            name="requesterEmail"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Insert Email"
                                    className={`border-2 rounded mt-2.5 p-3.5`}
                                />
                            )}
                        />
                        {errors.requesterEmail && (
                            <p className="text-md text-red-600 font-normal font-body mt-1.5">{errors.requesterEmail?.message}</p>
                        )}
                    </div>

                    <div className="w-full">
                        <span className="font-base text-lg">Birth Date</span>
                        <Controller
                            name="dob"
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    value={field.value ? dayjs(field.value) : null}
                                    onChange={(date) => { field.onChange(date ? date.toISOString() : null) }}
                                    className={`border-2 rounded mt-2.5 p-3.5 w-full`}
                                />
                            )}
                        />
                        {errors.dob && (
                            <p className="text-md text-red-600 font-normal font-body mt-1.5">{errors.dob?.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex mt-5">
                    <div className="w-full mr-5">
                        <span className="font-base text-lg">Request Date</span>
                        <Controller
                            name="requestDate"
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    value={field.value ? dayjs(field.value) : null}
                                    onChange={(date) => { field.onChange(date ? date.toISOString() : null) }}
                                    className={`border-2 rounded mt-2.5 p-3.5 w-full`}
                                />
                            )}
                        />
                        {errors.requestDate && (
                            <p className="text-md text-red-600 font-normal font-body mt-1.5">{errors.requestDate?.message}</p>
                        )}
                    </div>

                    <div className="w-full mr-5">
                        <span className="font-base text-lg">Due Date</span>
                        <Input
                            value={formatDateToYYYYMMDD(dueDate) ?? ""}
                            className={`border-2 rounded mt-2.5 p-3.5 w-full`}
                            disabled
                        />
                    </div>

                    <div className="w-full"></div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 bg-gray-100">
                    <hr style={{ margin: '20px 0' }} />
                    <div className='flex justify-end px-5 py-3'>
                        <button type="submit" className={`bg-[#3788FD] text-white px-5 py-2 rounded w-[100px]'}`}>Save</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

const CreateDsrPage: Page = () => {
    return (
        <Authorize>
            <Title>Incident List</Title>
            <div>
                <Row className="mb-4">
                    <p className="text-base font-semibold text-gray-500">Data Subject Right / Request List</p>
                    <p className="text-base font-semibold text-blue-500 ml-1"> / Add Data</p>
                </Row>
                <CreateDsr></CreateDsr>
            </div>
        </Authorize>
    );
}

CreateDsrPage.layout = WithCategoryLayout;
export default CreateDsrPage;
