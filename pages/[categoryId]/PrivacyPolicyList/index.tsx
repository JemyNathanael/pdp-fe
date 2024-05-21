import { Authorize } from "@/components/Authorize";
import { Button, DatePicker, Input, Row, Select } from 'antd';
import { BackendApiUrl, GetExcelPrivacyPolicy, GetPrivacyPolicyList } from "@/functions/BackendApiUrl";
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
    policyType: string;
    policyName: string;
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

const PrivacyPolicyList: React.FC = () => {
    const [page, setPages] = useState<number>(1);
    const initialFilterData = {
        itemsPerPage: 10,
        page: page,
        policyName: '',
        policyTypeId: '',
        uploadAtBegin: '',
        uploadAtEnded: '',
        uploadBy: ''
    };

    const downloadPrivacyPolicyImage = async (id: string) => {
        const { data } = await fetchGET<ResponseUri>(`${BackendApiUrl.downloadPrivacyPolicyImage}?id=${id}`);
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
            title: "Jenis Policy",
            dataIndex: "policyType",
            key: "policyType",
            align: "left",
            render: (text, record) => (
                <span
                    className="text-left text-[#3788FD] cursor-pointer"
                    onClick={() => router.push(`/${router.query['categoryId']}/PrivacyPolicyList/${record.id}`)}
                >
                    {text}
                </span>
            ),
        },
        {
            title: "Policy Name",
            dataIndex: "policyName",
            key: "policyName",
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
                    <button className="bg-blue-500 text-white py-2 px-4 rounded mr-2" onClick={() => downloadPrivacyPolicyImage(record.id)}>
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

    const { data, isValidating } = useSWR<DataItems>(GetPrivacyPolicyList(
        filterData.itemsPerPage,
        page,
        filterData.policyName,
        filterData.policyTypeId,
        filterData.uploadBy,
        filterData.uploadAtBegin,
        filterData.uploadAtEnded
    ), swrFetcher);

    const RenderExcelPrivacyPolicy = () => {
        return (
            <div className='flex justify-end mt-5'>
                <a href={GetExcelPrivacyPolicy(
                    filterData.policyName,
                    filterData.policyTypeId,
                    filterData.uploadBy,
                    filterData.uploadAtBegin,
                    filterData.uploadAtEnded
                )} download>
                    <Button size="middle" className="bg-blue-500 text-white w-32 mb-4 mr-4">Download Data</Button>
                </a>
                <Button size="middle" className="bg-blue-500 text-white w-32 mb-4 mr-4" onClick={() => router.push(`/${router.query['categoryId']}/PrivacyPolicyList/add`)}>Upload Policy</Button>
            </div>
        )
    }

    const RenderPrivacyPolicyListFilter = () => {
        const initialDate = {
            fromDate: null,
            toDate: null
        }
        const { data: policyTypeDropdown } = useSWR<DropdownModel[]>(BackendApiUrl.getPolicyTypeDropdown, swrFetcher);
        const policyTypeDropdownOptions = policyTypeDropdown?.map((item) => ({
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
                                    <p className="mr-10 font-bold w-72">Policy Name</p>
                                    <Input
                                        className={`border-2 rounded mt-2.5 p-3.5 w-full h-11`}
                                        value={tempFilterData.policyName}
                                        onChange={e => handleInputChange('policyName', e.target.value)}
                                    />
                                </div>
                                <div className='flex flex-row items-center w-1/2'>
                                    <p className="ml-10 mr-10 font-bold w-72">Jenis Policy</p>
                                    <Select
                                        className={`border-2 rounded mt-2.5 p-3.5 h-100 custom-select bg-white`}
                                        size={"middle"}
                                        bordered={false}
                                        value={tempFilterData.policyTypeId}
                                        onChange={value => handleInputChange('policyTypeId', value)}
                                        options={policyTypeDropdownOptions}
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
                policyType: item.policyType,
                policyName: item.policyName,
                uploadBy: item.uploadBy,
                uploadAt: item.uploadAt,
            };
            return row;
        })
    }

    const overviewData = dataSource();

    return (
        <div>
            {RenderExcelPrivacyPolicy()}
            {RenderPrivacyPolicyListFilter()}
            <style>
                {`
                    #privacyPolicyListTable .ant-table-thead > tr > th {
                        background-color: #d1d5db !important;
                        color: black !important;
                        text-align:left !important;
                        border-top: 1px solid black !important;
                        border-radius: 0 !important; 
                    } 
                    #privacyPolicyListTable .ant-table-tbody > tr > td {
                        border-top: 1px solid black !important;
                    }
                    #privacyPolicyListTable .ant-table-tbody > tr:last-child > td {
                        border-bottom: 1px solid black !important;
                    }
                `}
            </style>
            <div className="overflow-x-auto">
                <Table
                    dataSource={overviewData}
                    columns={columns}
                    loading={isValidating}
                    id="privacyPolicyListTable"
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

const PrivacyPolicyListPage: Page = () => {
    return (
        <Authorize>
            <Title>Policy Records</Title>
            <div>
                <Row className="mb-4">
                    <p className="text-base font-semibold text-gray-500"> Policy</p>
                    <p className="text-base font-semibold text-blue-500 ml-1"> / Policy Records</p>
                </Row>
                <PrivacyPolicyList></PrivacyPolicyList>
            </div>
        </Authorize>
    );
}

PrivacyPolicyListPage.layout = WithCategoryLayout;
export default PrivacyPolicyListPage;