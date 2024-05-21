import { Authorize } from "@/components/Authorize";
import { Button, DatePicker, Input, Row, Select } from 'antd';
import { BackendApiUrl, GetExcelDsr, GetDsrList } from "@/functions/BackendApiUrl";
import { ColumnsType } from "antd/es/table";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faFilter } from '@fortawesome/free-solid-svg-icons';
import { Title } from '@/components/Title';
import { Table } from "antd";
import { useSwrFetcherWithAccessToken } from "@/functions/useSwrFetcherWithAccessToken";
import { useState } from "react";
import { Page } from "@/types/Page";
import { WithCategoryLayout } from '@/components/CategoryLayout';
import router from "next/router";
import useSWR from 'swr';
import dayjs from 'dayjs';
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

interface DataItem {
    id: string;
    requestType: string;
    requestDetail: string;
    requesterName: string;
    requesterEmail: string;
    requesterBirthDate: string;
    requestDate: string;
    dueDate: string;
    picName: string;
    completionDate: string;
    stage: string;
    overdue: string;
    actionDetail: string;
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

const DsrList: React.FC = () => {
    const { TextArea } = Input;
    const [page, setPages] = useState<number>(1);
    const initialFilterData = {
        itemsPerPage: 10,
        page: page,
        requestTypeId: '',
        requesterName: '',
        requestDateBegin: '',
        requestDateEnded: '',
        completionDateBegin: '',
        completionDateEnded: '',
        requestStageIds: [] as string[],
        dueDate: '',
        overDue: '',
        requestDetail: '',
        actionDetail: '',
    };

    const columns: ColumnsType<DataRow> = [
        {
            title: "ID",
            dataIndex: "rowNumber",
            key: "rowNumber",
            align: "left"
        },
        {
            title: "Request Type",
            dataIndex: "requestType",
            key: "requestType",
            align: "left",
            render: (text, record) => (
                <span
                    className="text-left text-[#3788FD] cursor-pointer"
                    onClick={() => router.push(`/${router.query['categoryId']}/DsrList/${record.id}`)}
                >
                    {text}
                </span>
            ),
        },
        {
            title: "Request Detail",
            dataIndex: "requestDetail",
            key: "requestDetail",
            align: "left"
        },
        {
            title: "Requester Name",
            dataIndex: "requesterName",
            key: "requesterName",
            align: "left"
        },
        {
            title: "Request Email",
            dataIndex: "requesterEmail",
            key: "requesterEmail",
            align: "left"
        },
        {
            title: "Request Birth Date",
            dataIndex: "requesterBirthDate",
            key: "requesterBirthDate",
            align: "left"
        },
        {
            title: "Request Date",
            dataIndex: "requestDate",
            key: "requestDate",
            align: "left"
        },
        {
            title: "Due Date",
            dataIndex: "dueDate",
            key: "dueDate",
            align: "left"
        },
        {
            title: "PIC Name",
            dataIndex: "picName",
            key: "picName",
            align: "left",
        },
        {
            title: "Completion Date",
            dataIndex: "completionDate",
            key: "completionDate",
            align: "left"
        },
        {
            title: "Stage",
            dataIndex: "stage",
            key: "stage",
            align: "left",
            render: (text) => {
                let buttonColor;
                let textColor;
                let borderColor;
                switch (text) {
                    case 'Not Started':
                        buttonColor = 'white';
                        textColor = 'black';
                        borderColor = 'black';
                        break;
                    case 'Verification':
                        buttonColor = '#5E5E5E';
                        textColor = 'white';
                        borderColor = '#5E5E5E';
                        break;
                    case 'On Progress':
                        buttonColor = '#FAC710';
                        textColor = 'white';
                        borderColor = '#FAC710';
                        break;
                    case 'Completed':
                        buttonColor = '#8FD14F';
                        textColor = 'white';
                        borderColor = '#8FD14F';
                        break;
                    default:
                        buttonColor = 'bg-white';
                        textColor = 'black';
                        borderColor = 'black';
                }
                return (
                    <Button type="text" style={{ background: buttonColor, borderColor: borderColor, color: textColor }} className="rounded-full">
                        {text}
                    </Button>
                );
            },
        },
        {
            title: "Overdue",
            dataIndex: "overdue",
            key: "overdue",
            align: "left",
            render: (text) => {
                let buttonColor;
                let textColor;
                let borderColor;
                if (text == "Complete") {
                    buttonColor = 'white';
                    textColor = 'black';
                    borderColor = 'black';
                } else if (text != "") {
                    buttonColor = 'white';
                    textColor = '#FF0000';
                    borderColor = '#FF0000';
                } else {
                    return null;
                }
                return (
                    <Button type="text" style={{ background: buttonColor, borderColor: borderColor, color: textColor }} className="rounded-full">
                        {text}
                    </Button>
                );
            },
        },
        {
            title: "Action Detail",
            dataIndex: "actionDetail",
            key: "actionDetail",
            align: "left"
        },
    ];

    const swrFetcher = useSwrFetcherWithAccessToken();
    const [filterData, setFilterData] = useState(initialFilterData);
    const [tempFilterData, setTempFilterData] = useState({ ...filterData });
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const { data, isValidating } = useSWR<DataItems>(GetDsrList(
        filterData.itemsPerPage,
        page,
        filterData.requestTypeId,
        filterData.requesterName,
        filterData.requestStageIds,
        filterData.requestDateBegin,
        filterData.requestDateEnded,
        filterData.completionDateBegin,
        filterData.completionDateEnded,
        filterData.dueDate,
        filterData.overDue,
        filterData.requestDetail,
        filterData.actionDetail
    ), swrFetcher);

    const RenderExcelDsr = () => {
        return (
            <div className='flex justify-end mt-5'>
                <a href={GetExcelDsr(
                    filterData.requestTypeId,
                    filterData.requesterName,
                    filterData.requestStageIds,
                    filterData.requestDateBegin,
                    filterData.requestDateEnded,
                    filterData.completionDateBegin,
                    filterData.completionDateEnded,
                    filterData.dueDate,
                    filterData.overDue,
                    filterData.requestDetail,
                    filterData.actionDetail
                )} download>
                    <Button size="middle" className="bg-blue-500 text-white w-32 mb-4 mr-4">Download Data</Button>
                </a>
                <Button size="middle" className="bg-blue-500 text-white w-32 mb-4 mr-4" onClick={() => router.push(`/${router.query['categoryId']}/DsrList/createDsr`)}>Add Data</Button>
            </div>
        )
    }

    const RenderDsrListFilter = () => {
        const initialDate = {
            fromDate: null,
            toDate: null
        }

        const { data: dsrStage } = useSWR<DropdownModel[]>(BackendApiUrl.getPiaStatus, swrFetcher);
        const dsrStageOptions = dsrStage?.map((item) => ({
            label: item.name,
            value: item.id,
        }));
        const { data: requestTypeDropdown } = useSWR<DropdownModel[]>(BackendApiUrl.getRequestTypeList, swrFetcher);
        const requestTypeDropdownOptions = requestTypeDropdown?.map((item) => ({
            label: item.name,
            value: item.id,
        }));
        const { data: requestNameDropdown } = useSWR<DropdownModel[]>(BackendApiUrl.getRequestNameDropdown, swrFetcher);
        const requestNameDropdownOptions = requestNameDropdown?.map((item) => ({
            label: item.name,
            value: item.name,
        }));

        const overdueDropdownOptions = [
            { label: 'Less than 1 week', value: 1 },
            { label: 'Less than 1 month', value: 2 },
            { label: 'More than 1 month', value: 3 }
        ];

        const handleInputChange = (fieldName, value) => {
            setTempFilterData(prevTempFilterData => ({
                ...prevTempFilterData,
                [fieldName]: value
            }));
        };
        const handleSearch = () => {
            setFilterData({ ...tempFilterData });
            console.log(tempFilterData);
        };

        const handleClear = () => {
            setFilterData(initialFilterData);
            setTempFilterData(initialFilterData);
        };

        const toggleFilter = () => {
            setIsFilterOpen(!isFilterOpen);
        };

        const handleRequestDateChange = (dates) => {
            if (dates) {
                const [requestDateBegin, requestDateEnded] = dates;

                const formattedRequestDateBegin = dayjs(requestDateBegin).format('YYYY-MM-DD');
                const formattedRequestDateEnded = dayjs(requestDateEnded).format('YYYY-MM-DD');

                setTempFilterData({
                    ...tempFilterData,
                    requestDateBegin: formattedRequestDateBegin,
                    requestDateEnded: formattedRequestDateEnded
                });
            }
        };

        const handleCompletionDateChange = (dates) => {
            if (dates) {
                const [completionDateBegin, completionDateEnded] = dates;

                const formattedCompletionDateBegin = dayjs(completionDateBegin).format('YYYY-MM-DD');
                const formattedCompletionDateEnded = dayjs(completionDateEnded).format('YYYY-MM-DD');

                setTempFilterData({
                    ...tempFilterData,
                    completionDateBegin: formattedCompletionDateBegin,
                    completionDateEnded: formattedCompletionDateEnded
                });
            }
        };

        const handleDueDateChange = (dueDate) => {
            if (dueDate) {
                const formattedDueDate = dayjs(dueDate).format('YYYY-MM-DD');

                setTempFilterData({
                    ...tempFilterData,
                    dueDate: formattedDueDate
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
                                    <p className="mr-10 font-bold w-72">Request Type</p>
                                    <Select
                                        className={`border-2 rounded mt-2.5 p-3.5 h-100 custom-select bg-white`}
                                        size={"middle"}
                                        bordered={false}
                                        value={tempFilterData.requestTypeId}
                                        onChange={value => handleInputChange('requestTypeId', value)}
                                        options={requestTypeDropdownOptions}
                                    >
                                    </Select>
                                </div>
                            </div>
                            <div className='flex flex-row mb-4'>
                                <div className='flex flex-row items-center w-1/2'>
                                    <p className="mr-10 font-bold w-72">Request Name</p>
                                    <Select
                                        className={`border-2 rounded mt-2.5 p-3.5 h-100 custom-select bg-white`}
                                        size={"middle"}
                                        bordered={false}
                                        value={tempFilterData.requesterName}
                                        onChange={value => handleInputChange('requesterName', value)}
                                        options={requestNameDropdownOptions}
                                    >
                                    </Select>
                                </div>
                                <div className='flex flex-row items-center w-1/2'>
                                    <p className="ml-10 mr-10 font-bold w-72">Request Date</p>
                                    <div className="border-2 rounded mt-2.5 p-3.5 h-100 custom-select bg-white">
                                        <RangePicker
                                            className="w-full"
                                            size="middle"
                                            bordered={false}
                                            value={(tempFilterData.requestDateBegin === '' && tempFilterData.requestDateEnded === '') ? [initialDate.fromDate, initialDate.toDate] :
                                                [dayjs(tempFilterData.requestDateBegin), dayjs(tempFilterData.requestDateEnded)]}
                                            format={dateFormat}
                                            onChange={(dates) => handleRequestDateChange(dates)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-row mb-4'>
                                <div className='flex flex-row items-center w-1/2'>
                                    <p className="mr-10 font-bold w-72">Completion Date</p>
                                    <div className="border-2 rounded mt-2.5 p-3.5 h-100 custom-select bg-white">
                                        <RangePicker
                                            className="w-full"
                                            size="middle"
                                            bordered={false}
                                            value={(tempFilterData.completionDateBegin === '' && tempFilterData.completionDateEnded === '') ? [initialDate.fromDate, initialDate.toDate] :
                                                [dayjs(tempFilterData.completionDateBegin), dayjs(tempFilterData.completionDateEnded)]}
                                            format={dateFormat}
                                            onChange={(dates) => handleCompletionDateChange(dates)}
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-row items-center w-1/2'>
                                    <p className="ml-10 mr-10 font-bold w-72">Stage</p>
                                    <Select
                                        className={`border-2 rounded mt-2.5 p-3.5 h-100 custom-select bg-white`}
                                        size={"middle"}
                                        bordered={false}
                                        value={tempFilterData.requestStageIds}
                                        onChange={value => handleInputChange('requestStageIds', value)}
                                        options={dsrStageOptions}
                                        mode="multiple"
                                    >
                                    </Select>
                                </div>
                            </div>
                            <div className='flex flex-row mb-4'>
                                <div className='flex flex-row items-center w-1/2'>
                                    <p className="mr-10 font-bold w-72">Due Date</p>
                                    <div className="border-2 rounded mt-2.5 p-3.5 h-100 custom-select bg-white">
                                        <DatePicker
                                            className="w-full"
                                            size="middle"
                                            bordered={false}
                                            format={dateFormat}
                                            value={tempFilterData.dueDate === '' ? null : dayjs(tempFilterData.dueDate)}
                                            onChange={(dates) => handleDueDateChange(dates)}
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-row items-center w-1/2'>
                                    <p className="ml-10 mr-10 font-bold w-72">Overdue</p>
                                    <Select
                                        className={`border-2 rounded mt-2.5 p-3.5 h-100 custom-select bg-white`}
                                        size={"middle"}
                                        bordered={false}
                                        value={tempFilterData.overDue}
                                        onChange={value => handleInputChange('overDue', value)}
                                        options={overdueDropdownOptions}
                                    >
                                    </Select>
                                </div>
                            </div>
                            <div className='flex flex-row mb-4'>
                                <div className='flex flex-row items-center w-full'>
                                    <p className="mr-2 font-bold w-64">Request Detail</p>
                                    <TextArea
                                        className={`border-2 rounded mt-2.5 p-3.5 w-full h-100`}
                                        value={tempFilterData.requestDetail}
                                        onChange={e => handleInputChange('requestDetail', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className='flex flex-row mb-4'>
                                <div className='flex flex-row items-center w-full'>
                                    <p className="mr-2 font-bold w-64">Action Detail</p>
                                    <TextArea
                                        className={`border-2 rounded mt-2.5 p-3.5 w-full h-100`}
                                        value={tempFilterData.actionDetail}
                                        onChange={e => handleInputChange('actionDetail', e.target.value)}
                                    />
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
                requestType: item.requestType,
                requestDetail: item.requestDetail,
                requesterName: item.requesterName,
                requesterEmail: item.requesterEmail,
                requesterBirthDate: item.requesterBirthDate,
                requestDate: item.requestDate,
                dueDate: item.dueDate,
                picName: item.picName,
                completionDate: item.completionDate,
                stage: item.stage,
                overdue: item.overdue,
                actionDetail: item.actionDetail,
            };
            return row;
        })
    }

    const overviewData = dataSource();

    return (
        <div>
            {RenderExcelDsr()}
            {RenderDsrListFilter()}
            <style>
                {`
                    #dsrListTable .ant-table-thead > tr > th {
                        background-color: #d1d5db !important;
                        color: black !important;
                        text-align:left !important;
                        border-top: 1px solid black !important;
                        border-radius: 0 !important; 
                    } 
                    #dsrListTable .ant-table-tbody > tr > td {
                        border-top: 1px solid black !important;
                    }
                    #dsrListTable .ant-table-tbody > tr:last-child > td {
                        border-bottom: 1px solid black !important;
                    }
                `}
            </style>
            <div className="overflow-x-auto">
                <Table
                    dataSource={overviewData}
                    columns={columns}
                    loading={isValidating}
                    id="dsrListTable"
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

const DsrListPage: Page = () => {
    return (
        <Authorize>
            <Title>Request List</Title>
            <div>
                <Row className="mb-4">
                    <p className="text-base font-semibold text-gray-500"> Data Subject Right</p>
                    <p className="text-base font-semibold text-blue-500 ml-1"> / Request List</p>
                </Row>
                <DsrList></DsrList>
            </div>
        </Authorize>
    );
}

DsrListPage.layout = WithCategoryLayout;
export default DsrListPage;