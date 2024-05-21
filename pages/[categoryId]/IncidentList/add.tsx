import { Authorize } from "@/components/Authorize";
import { DatePicker, Input, Row, Select } from 'antd';
import { Title } from '@/components/Title';
import { Page } from "@/types/Page";
import { WithCategoryLayout } from '@/components/CategoryLayout';
import { Controller, useForm } from "react-hook-form";
import { useFetchWithAccessToken } from "@/functions/useFetchWithAccessToken";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BackendApiUrl } from "@/functions/BackendApiUrl";
import { useSwrFetcherWithAccessToken } from "@/functions/useSwrFetcherWithAccessToken";
import { useState } from "react";
import useSWR from 'swr';
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false
});

interface Incident {
    incidentTypeId: number;
    incidentDetail: string;
    reportBy: string;
    picUserId: string;
    reportDate: Date;
    dueDate: Date;
}

interface DropdownModel {
    id: number,
    name: string
}

interface DropdownModelString {
    id: string,
    email: string
}

const addIncidentSchema = z.object({
    incidentTypeId: z.number({ required_error: 'Incident type can\'t be empty' }).min(1, 'Incident type can\'t be empty'),
    incidentDetail: z.string({ required_error: 'Incident detail can\'t be empty' }).min(1, 'Incident detail can\'t be empty'),
    reportBy: z.string({ required_error: 'Report by can\'t be empty' }).min(1, 'Report by can\'t be empty'),
    picUserId: z.string({ required_error: 'Assign to can\'t be empty' }).min(1, 'Assign to can\'t be empty'),
    reportDate: z.string({ required_error: "Report date cannot be empty" }),
    dueDate: z.string({ required_error: "Due date cannot be empty" }),
});

const AddIncident: React.FC = () => {
    const { data: session } = useSession();
    const displayUserName = session?.user?.name || "";
    const swrFetcher = useSwrFetcherWithAccessToken();
    const { fetchPOST } = useFetchWithAccessToken();
    const [selectedIncidentType, setSelectedIncidentType] = useState<number | null>(null);
    const { data: emailList } = useSWR<DropdownModelString[]>(BackendApiUrl.getEmailList, swrFetcher);
    const { data: incidentType } = useSWR<DropdownModel[]>(BackendApiUrl.getIncidentTypeDropdown, swrFetcher);
    const incidentTypeOptions = incidentType?.map((item) => ({
        label: item.name,
        value: item.id,
    }));

    const { control, formState: { errors }, handleSubmit, setValue } = useForm<Incident>({
        resolver: zodResolver(addIncidentSchema),
        defaultValues: {
            reportBy: displayUserName
        },
    });

    const handleSelectIncidentType = (typeId: number) => {
        setSelectedIncidentType(typeId);
    };

    const onSubmit = async (formData: Incident) => {
        setValue("reportBy", displayUserName);

        const payload = {
            ...formData,
        };

        const response = await fetchPOST<Incident>(BackendApiUrl.createIncident, payload);
        if (response.data) {
            window.location.reload();
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} >
                <div className="w-full">
                    <p className="font-bold text-lg">Incident Type</p>
                    <p className="text-base">Pilih salah satu dari pilihan berikut:</p>
                    <div className="flex flex-wrap mt-2">
                        {incidentTypeOptions?.map((option) => (
                            <Controller
                                key={option.value}
                                name="incidentTypeId"
                                control={control}
                                render={({ field }) => (
                                    <button
                                        {...field}
                                        className={`rounded font-medium px-5 py-1 mr-3 ${selectedIncidentType === option.value ? 'bg-[#3788FD] text-white' : 'border-2 border-[#3788FD] text-[#3788FD]'}`}
                                        onClick={() => { field.onChange(option.value); handleSelectIncidentType(option.value); }}
                                    >
                                        {option.label}
                                    </button>
                                )}
                            />
                        ))}
                    </div>
                    {errors.incidentTypeId && (
                        <p className="text-md text-red-600 font-normal font-body mt-1.5">{errors.incidentTypeId?.message}</p>
                    )}
                </div>

                <div className="w-full mt-5">
                    <p className="font-bold text-lg">Incident Detail</p>
                    <Controller
                        name="incidentDetail"
                        control={control}
                        render={({ field }) => (
                            <ReactQuill
                                className="bg-white"
                                theme="snow"
                                value={field.value}
                                placeholder="Insert Detail"
                                onChange={(value) => {
                                    field.onChange(value)
                                }}
                            />
                        )}
                    />
                    {errors.incidentDetail && (
                        <p className="text-md text-red-600 font-normal font-body mt-1.5">{errors.incidentDetail?.message}</p>
                    )}
                </div>

                <div className="flex mt-5">
                    <div className="w-full mr-5">
                        <span className="font-bold text-lg">Report By</span>
                        <Controller
                            name="reportBy"
                            control={control}
                            render={() => (
                                <Input
                                    className={`border-2 rounded mt-2.5 p-3.5`}
                                    defaultValue={displayUserName}
                                    disabled
                                ></Input>
                            )}
                        />
                        {errors.reportBy && (
                            <p className="text-md text-red-600 font-normal font-body mt-1.5">{errors.reportBy?.message}</p>
                        )}
                    </div>

                    <div className="w-full">
                        <span className="font-bold text-lg">Assign To</span>
                        <Controller
                            name="picUserId"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    showSearch
                                    className={`border-2 rounded mt-2.5 p-2.5 w-full bg-white`}
                                    bordered={false}
                                    placeholder="Input email of PIC"
                                    options={emailList?.map(item => ({
                                        label: item.email,
                                        value: item.id
                                    })) || []}
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                />
                            )}
                        />
                        {errors.picUserId && (
                            <p className="text-md text-red-600 font-normal font-body mt-1.5">{errors.picUserId?.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex mt-5" style={{ marginBottom: 90 }}>
                    <div className="w-full mr-5">
                        <span className="font-bold text-lg">Report Date</span>
                        <Controller
                            name="reportDate"
                            control={control}
                            render={({ field }) =>
                                <DatePicker
                                    value={field.value ? dayjs(field.value) : null}
                                    onChange={(date) => { field.onChange(date ? date.toISOString() : null) }}
                                    className={`border-2 rounded mt-2.5 p-3.5 w-full`}
                                />
                            }
                        />
                        {errors.reportDate && (
                            <p className="text-md text-red-600 font-normal font-body mt-1.5">{errors.reportDate?.message}</p>
                        )}
                    </div>

                    <div className="w-full">
                        <span className="font-bold text-lg">Due Date</span>
                        <Controller
                            name="dueDate"
                            control={control}
                            render={({ field }) =>
                                <DatePicker
                                    value={field.value ? dayjs(field.value) : null}
                                    onChange={(date) => { field.onChange(date ? date.toISOString() : null) }}
                                    className={`border-2 rounded mt-2.5 p-3.5 w-full`}
                                />
                            }
                        />
                        {errors.dueDate && (
                            <p className="text-md text-red-600 font-normal font-body mt-1.5">{errors.dueDate?.message}</p>
                        )}
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 bg-gray-100">
                    <hr style={{ margin: '20px 0' }} />
                    <div className='flex justify-end px-5 py-3'>
                        <button className={`bg-[#3788FD] text-white px-5 py-2 rounded w-[100px]'}`}>Save</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

const AddIncidentPage: Page = () => {
    return (
        <Authorize>
            <Title>Incident List</Title>
            <div>
                <Row className="mb-4">
                    <p className="text-base font-semibold text-gray-500">Data Breach and Incident Management/ Incident List</p>
                    <p className="text-base font-semibold text-blue-500 ml-1"> / Add Data</p>
                </Row>
                <AddIncident></AddIncident>
            </div>
        </Authorize>
    );
}

AddIncidentPage.layout = WithCategoryLayout;
export default AddIncidentPage;
