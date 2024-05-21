import { Authorize } from "@/components/Authorize";
import { Button, DatePicker, Input, Row, Select } from 'antd';
import { BackendApiUrl, GetExcelConsentRecord, GetConsentRecordList } from "@/functions/BackendApiUrl";
import { ColumnsType } from "antd/es/table";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faDownload, faFilter } from '@fortawesome/free-solid-svg-icons';
import { Title } from '@/components/Title';
import { Table } from "antd";
import { useSwrFetcherWithAccessToken } from "@/functions/useSwrFetcherWithAccessToken";
import { useState } from "react";
import { Page } from "@/types/Page";
import { WithCategoryLayout } from '@/components/CategoryLayout';
import router from "next/router";
import useSWR from 'swr';
import dayjs from 'dayjs';
import { useFetchWithAccessToken } from "@/functions/useFetchWithAccessToken";
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

interface DataItem {
    id: string;
    dataSubject: string;
    name: string;
    dob: string;
    uploadBy: string;
    uploadAt: string;
}

interface DataItems {
    datas: DataItem[]
    totalData: number
}

interface DataRow extends DataItem {
    rowNumber: number,
    key: React.Key
}

interface DropdownModel {
    id: number,
    name: string
}

interface ResponseUri{
    success: string,
    fileName: string
}

const ConsentRecordList: React.FC = () => {
    const [page, setPages] = useState<number>(1);
    const initialFilterData = {
        itemsPerPage: 10,
        page: page,
        name: '',
        dataSubjectId: '',
        dob: '',
        uploadBy: '',
        uploadAtBegin: '',
        uploadAtEnded: ''
    };

    const downloadConsentImage = async (id: string) => {
        const { data } = await fetchGET<ResponseUri>(`${BackendApiUrl.downloadConsentImage}?id=${id}`);
        if(data){
            const res = await fetch(data.success, {
                method: 'GET',
              });
            const blob = await res.blob();
            const newBlob = new Blob([blob]);
            const blobUrl = window.URL.createObjectURL(newBlob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', `${data.fileName}`);
            document.body.appendChild(link);
            link.click();
            if(link.parentNode){
                link.parentNode.removeChild(link);
            }
            window.URL.revokeObjectURL(blobUrl);
        }
    }

    const columns: ColumnsType<DataRow> = [
        {
            title: "ID",
            dataIndex: "rowNumber",
            key: "rowNumber",
            align: "left"
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            align: "left"
        },
        {
            title: "DOB",
            dataIndex: "dob",
            key: "dob",
            align: "left"
        },
        {
            title: "Data Subject Category",
            dataIndex: "dataSubject",
            key: "dataSubject",
            align: "left"
        },
        {
            title: "Upload By",
            dataIndex: "uploadBy",
            key: "uploadBy",
            align: "left"
        },
        {
            title: "Upload At",
            dataIndex: "uploadAt",
            key: "uploadAt",
            align: "left"
        },
        {
            title: 'Action',
            key: 'action',
            render: (record) => (
                <div className="flex">
                    <button className="bg-blue-500 text-white py-2 px-4 rounded mr-2" onClick={() => downloadConsentImage(record.id)}>
                        <FontAwesomeIcon icon={faDownload} />
                    </button>
                </div>
            ),
        },
    ];

    const swrFetcher = useSwrFetcherWithAccessToken();
    const { fetchGET } = useFetchWithAccessToken();
    const [filterData, setFilterData] = useState(initialFilterData);
    const [tempFilterData, setTempFilterData] = useState({ ...filterData });
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const { data, isValidating } = useSWR<DataItems>(GetConsentRecordList(
        filterData.itemsPerPage,
        page,
        filterData.name,
        filterData.dataSubjectId,
        filterData.dob,
        filterData.uploadBy,
        filterData.uploadAtBegin,
        filterData.uploadAtEnded
    ), swrFetcher);

    const RenderExcelConsentRecord = () => {
        return (
            <div className='flex justify-end mt-5'>
                <a href={GetExcelConsentRecord(
                    filterData.name,
                    filterData.dataSubjectId,
                    filterData.dob,
                    filterData.uploadBy,
                    filterData.uploadAtBegin,
                    filterData.uploadAtEnded
                )} download>
                    <Button size="middle" className="bg-blue-500 text-white w-32 mb-4 mr-4">Download Data</Button>
                </a>
                <Button size="middle" className="bg-blue-500 text-white w-32 mb-4 mr-4" onClick={() => router.push(`/${router.query['categoryId']}/ConsentRecordList/uploadConsent`)}>Upload Consent</Button>
            </div>
        )
    }

    const RenderConsentRecordListFilter = () => {
        const initialDate = {
            fromDate: null,
            toDate: null
        }
        const { data: dataSubjectDropdown } = useSWR<DropdownModel[]>(BackendApiUrl.getDataSubjectDropdown, swrFetcher);
        const dataSubjectDropdownOptions = dataSubjectDropdown?.map((item) => ({
            label: item.name,
            value: item.id,
        }));
        const { data: uploadByDropdown } = useSWR<DropdownModel[]>(BackendApiUrl.getUserNameList, swrFetcher);
        const uploadByDropdownOptions = uploadByDropdown?.map((item) => ({
            label: item.name,
            value: item.name,
        }));

        const handleInputChange = (fieldName, value) => {
            setTempFilterData(prevTempFilterData => ({
                ...prevTempFilterData,
                [fieldName]: value
            }));
        };
        const handleSearch = () => {
            setFilterData({ ...tempFilterData });
        };

        const handleClear = () => {
            setFilterData(initialFilterData);
            setTempFilterData(initialFilterData);
        };

        const toggleFilter = () => {
            setIsFilterOpen(!isFilterOpen);
        };

        const handleUploadAtChange = (dates) => {
            if (dates) {
                const [uploadAtBegin, uploadAtEnded] = dates;

                const formattedUploadAtBegin = dayjs(uploadAtBegin).format('YYYY-MM-DD');
                const formattedUploadAtEnded = dayjs(uploadAtEnded).format('YYYY-MM-DD');

                setTempFilterData({
                    ...tempFilterData,
                    uploadAtBegin: formattedUploadAtBegin,
                    uploadAtEnded: formattedUploadAtEnded
                });
            }
        };

        const handleDobChange = (dob) => {
            if (dob) {
                const formattedDob = dayjs(dob).format('YYYY-MM-DD');

                setTempFilterData({
                    ...tempFilterData,
                    dob: formattedDob
                });
            }
        };

        return (
            <div className="mb-4">
                <div className={`flex flex-row justify-between items-center p-3 border cursor-pointer ${isFilterOpen ? 'bg-[#E7F1FF]' : 'bg-white'}`} onClick={toggleFilter}>
                    <div className='flex  items-center'>
                        <FontAwesomeIcon icon={faFilter} color={`${isFilterOpen ? '#3788FD' : 'black'}`} ></FontAwesomeIcon>
                        <p className={`ml-3 ${isFilterOpen ? 'text-[#3788FD]' : 'text-black'}`}>Filter</p>
                    </div>
                    <FontAwesomeIcon icon={faChevronDown} color={`${isFilterOpen ? '#3788FD' : 'black'}`} className={`${isFilterOpen ? 'transform rotate-180' : ''}`}></FontAwesomeIcon>
                </div>
                {isFilterOpen && (
                    <div className='bg-white p-3 border'>
                        <div className='bg-[#E7F1FF] border-dotted border-2 border-sky-500 p-3'>
                            <div className='flex flex-row mb-4'>
                                <div className='flex flex-row items-center w-1/2'>
                                    <p className="mr-10 font-bold w-72">Name</p>
                                    <Input
                                        className={`border-2 rounded mt-2.5 p-3.5 w-full h-11`}
                                        value={tempFilterData.name}
                                        onChange={e => handleInputChange('name', e.target.value)}
                                    />
                                </div>
                                <div className='flex flex-row items-center w-1/2'>
                                    <p className="ml-10 mr-10 font-bold w-72">DOB</p>
                                    <div className="border-2 rounded mt-2.5 p-3.5 h-100 custom-select bg-white">
                                        <DatePicker
                                            className="w-full"
                                            size="middle"
                                            bordered={false}
                                            value={tempFilterData.dob === ''? null : dayjs(tempFilterData.dob)}
                                            format={dateFormat}
                                            onChange={(dates) => handleDobChange(dates)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-row mb-4'>
                                <div className='flex flex-row items-center w-1/2'>
                                    <p className="mr-10 font-bold w-72">Data Subject Category</p>
                                    <Select
                                        className={`border-2 rounded mt-2.5 p-3.5 h-100 custom-select bg-white`}
                                        size={"middle"}
                                        bordered={false}
                                        value={tempFilterData.dataSubjectId}
                                        onChange={value => handleInputChange('dataSubjectId', value)}
                                        options={dataSubjectDropdownOptions}
                                    >
                                    </Select>
                                </div>
                            </div>
                            <div className='flex flex-row mb-4'>
                                <div className='flex flex-row items-center w-1/2'>
                                    <p className="mr-10 font-bold w-72">Upload By</p>
                                    <Select
                                        className={`border-2 rounded mt-2.5 p-3.5 h-100 custom-select bg-white`}
                                        size={"middle"}
                                        bordered={false}
                                        value={tempFilterData.uploadBy}
                                        onChange={value => handleInputChange('uploadBy', value)}
                                        options={uploadByDropdownOptions}
                                    >
                                    </Select>
                                </div>
                                <div className='flex flex-row items-center w-1/2'>
                                    <p className="ml-10 mr-10 font-bold w-72">Upload At</p>
                                    <div className="border-2 rounded mt-2.5 p-3.5 h-100 custom-select bg-white">
                                        <RangePicker
                                            className="w-full"
                                            size="middle"
                                            bordered={false}
                                            value={(tempFilterData.uploadAtBegin === '' && tempFilterData.uploadAtEnded === '') ? [initialDate.fromDate, initialDate.toDate] :
                                                [dayjs(tempFilterData.uploadAtBegin), dayjs(tempFilterData.uploadAtEnded)]}
                                            format={dateFormat}
                                            onChange={(dates) => handleUploadAtChange(dates)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-end mt-5'>
                                <Button size="middle" className="border border-blue-500 text-blue-500 mr-5" onClick={handleClear}>Clear</Button>
                                <Button size="middle" className="bg-blue-500 text-white" onClick={handleSearch}>Search</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    function dataSource(): DataRow[] {
        if (!data) {
            return [];
        }

        const startingIndex = (page - 1) * 10;
        return data.datas.map((item, index) => {
            const row: DataRow = {
                key: startingIndex + index + 1,
                rowNumber: startingIndex + index + 1,
                id: item.id,
                name: item.name,
                dataSubject: item.dataSubject,
                dob: item.dob,
                uploadBy: item.uploadBy,
                uploadAt: item.uploadAt,
            };
            return row;
        })
    }

    const overviewData = dataSource();

    return (
        <div>
            {RenderExcelConsentRecord()}
            {RenderConsentRecordListFilter()}
            <style>
                {`
                    #consentRecordListTable .ant-table-thead > tr > th {
                        background-color: #d1d5db !important;
                        color: black !important;
                        text-align:left !important;
                        border-top: 1px solid black !important;
                        border-radius: 0 !important; 
                    } 
                    #consentRecordListTable .ant-table-tbody > tr > td {
                        border-top: 1px solid black !important;
                    }
                    #consentRecordListTable .ant-table-tbody > tr:last-child > td {
                        border-bottom: 1px solid black !important;
                    }
                `}
            </style>
            <div className="overflow-x-auto">
                <Table
                    dataSource={overviewData}
                    columns={columns}
                    loading={isValidating}
                    id="consentRecordListTable"
                    pagination={{
                        position: ['bottomCenter'],
                        simple: true, defaultCurrent: 1,
                        total: data?.totalData,
                        onChange: (page) => {
                            setPages(page);
                        },
                        current: page,
                        pageSize: 10
                    }}
                />
            </div>
        </div>
    );
}

const ConsentRecordListPage: Page = () => {
    return (
        <Authorize>
            <Title>Consent Records</Title>
            <div>
                <Row className="mb-4">
                    <p className="text-base font-semibold text-gray-500"> Consent and Privacy Management</p>
                    <p className="text-base font-semibold text-blue-500 ml-1"> / Consent Records</p>
                </Row>
                <ConsentRecordList></ConsentRecordList>
            </div>
        </Authorize>
    );
}

ConsentRecordListPage.layout = WithCategoryLayout;
export default ConsentRecordListPage;