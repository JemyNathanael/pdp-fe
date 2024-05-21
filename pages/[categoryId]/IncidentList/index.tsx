import { Authorize } from "@/components/Authorize";
import { Button, DatePicker, Input, Row, Select } from 'antd';
import { BackendApiUrl, GetExcelIncident, GetIncidentList } from "@/functions/BackendApiUrl";
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
import { faBell } from "@fortawesome/free-regular-svg-icons";
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

interface DataItem {
    id: string;
    incidentType: string;
    incidentDetail: string;
    reportBy: string;
    picName: string;
    reportDate: string;
    completeDate: string;
    dueDate: string;
    sendNotificationDate: string;
    rootCause: string;
    remediationAction: string;
    stage: string;
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

interface DropdownReporterIncident {
    name: string
}

const IncidentList: React.FC = () => {
    const { TextArea } = Input;
    const [page, setPages] = useState<number>(1);
    const initialFilterData = {
        itemsPerPage: 10,
        page: page,
        incidentTypeId: '',
        reportBy: '',
        picNameId: '',
        incidentStageIds: [] as string[],
        incidentDetail: '',
        reportDateBegin: '',
        reportDateEnded: '',
        dueDate: '',
        overDue: '',
    };

    const columns: ColumnsType<DataRow> = [
        {
            title: "ID",
            dataIndex: "rowNumber",
            key: "rowNumber",
            align: "left"
        },
        {
            title: "Incident Type",
            dataIndex: "incidentType",
            key: "incidentType",
            align: "left",
            render: (text, record) => (
                <span
                    className="text-left text-[#3788FD] cursor-pointer"
                    onClick={() => router.push(`/${router.query['categoryId']}/IncidentList/${record.id}`)}
                >
                    {text}
                </span>
            ),
        },
        {
            title: "Incident Detail",
            dataIndex: "incidentDetail",
            key: "incidentDetail",
            align: "left"
        },
        {
            title: "Report By",
            dataIndex: "reportBy",
            key: "reportBy",
            align: "left"
        },
        {
            title: "PIC Name",
            dataIndex: "picName",
            key: "picName",
            align: "left",
        },
        {
            title: "Report Date",
            dataIndex: "reportDate",
            key: "reportDate",
            align: "left"
        },
        {
            title: "Complete Date",
            dataIndex: "completeDate",
            key: "completeDate",
            align: "left"
        },
        {
            title: "Due Date",
            dataIndex: "dueDate",
            key: "dueDate",
            align: "left"
        },
        {
            title: "Send Notification Date",
            dataIndex: "sendNotificationDate",
            key: "sendNotificationDate",
            align: "left"
        },
        {
            title: "Root Cause",
            dataIndex: "rootCause",
            key: "rootCause",
            align: "left"
        },
        {
            title: "Remediation Action",
            dataIndex: "remediationAction",
            key: "remediationAction",
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
                    case 'Investigating':
                        buttonColor = '#5E5E5E';
                        textColor = 'white';
                        borderColor = '#5E5E5E';
                        break;
                    case 'Remediating':
                        buttonColor = '#FAC710';
                        textColor = 'white';
                        borderColor = '#FAC710';
                        break;
                    case 'Complete':
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
                    <Button type="text" style={{ background: buttonColor, borderColor: borderColor, color: textColor}} className="rounded-full">
                        {text}
                    </Button>
                );
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (record) => (
                <div className="flex">
                    <button className="bg-blue-500 text-white py-2 px-4 rounded">
                        <FontAwesomeIcon icon={faBell}  onClick={() => router.push(`/${router.query['categoryId']}/IncidentList/${record.id}/sendNotification`)}/>
                    </button>
                </div>
            ),
        },
    ];

    const swrFetcher = useSwrFetcherWithAccessToken();
    const [filterData, setFilterData] = useState(initialFilterData);
    const [tempFilterData, setTempFilterData] = useState({ ...filterData });
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const { data, isValidating } = useSWR<DataItems>(GetIncidentList(
        filterData.itemsPerPage,
        page,
        filterData.incidentTypeId,
        filterData.reportBy,
        filterData.incidentStageIds,
        filterData.picNameId,
        filterData.reportDateBegin,
        filterData.reportDateEnded,
        filterData.dueDate,
        filterData.overDue,
        filterData.incidentDetail
    ), swrFetcher);

    const RenderExcelIncident = () => {
        return (
            <div className='flex justify-end mt-5'>
                <a href={GetExcelIncident(
                    filterData.incidentTypeId,
                    filterData.reportBy,
                    filterData.incidentStageIds,
                    filterData.picNameId,
                    filterData.reportDateBegin,
                    filterData.reportDateEnded,
                    filterData.dueDate,
                    filterData.overDue,
                    filterData.incidentDetail
                )} download>
                    <Button size="middle" className="bg-blue-500 text-white w-32 mb-4 mr-4">Download Data</Button>
                </a>
                <Button size="middle" className="bg-blue-500 text-white w-32 mb-4 mr-4"  onClick={() => router.push(`/${router.query['categoryId']}/IncidentList/add`)}>Add Data</Button>
            </div>
        )
    }

    const RenderIncidentListFilter = () => {
        const initialDate = {
            fromDate: null,
            toDate: null
        }

        const { data: incidentStage } = useSWR<DropdownModel[]>(BackendApiUrl.getPiaStatus, swrFetcher);
        const incidentStageOptions = incidentStage?.map((item) => ({
            label: item.name,
            value: item.id,
        }));
        const { data: incidentTypeDropdown } = useSWR<DropdownModel[]>(BackendApiUrl.getIncidentTypeDropdown, swrFetcher);
        const incidentTypeDropdownOptions = incidentTypeDropdown?.map((item) => ({
            label: item.name,
            value: item.id,
        }));
        const { data: picNameDropdown } = useSWR<DropdownModel[]>(BackendApiUrl.getPicIncidentDropdown, swrFetcher);
        const picNameDropdownOptions = picNameDropdown?.map((item) => ({
            label: item.name,
            value: item.id,
        }));
        const { data: reporterIncidentDropdown } = useSWR<DropdownReporterIncident[]>(BackendApiUrl.getReporterIncidentDropdown, swrFetcher);
        const reporterIncidentDropdownOptions = reporterIncidentDropdown?.map((item) => ({
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
        };

        const handleClear = () => {
            setFilterData(initialFilterData);
            setTempFilterData(initialFilterData);
        };

        const toggleFilter = () => {
            setIsFilterOpen(!isFilterOpen);
        };

        const handleReportDateChange = (dates) => {
            if (dates) {
                const [reportDateBegin, reportDateEnded] = dates;

                const formattedStartDateBegin = dayjs(reportDateBegin).format('YYYY-MM-DD');
                const formattedStartDateEnded = dayjs(reportDateEnded).format('YYYY-MM-DD');

                setTempFilterData({
                    ...tempFilterData,
                    reportDateBegin: formattedStartDateBegin,
                    reportDateEnded: formattedStartDateEnded
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
                                    <p className="mr-10 font-bold w-72">Incident Type</p>
                                    <Select
                                        className={`border-2 rounded mt-2.5 p-3.5 h-100 custom-select bg-white`}
                                        size={"middle"}
                                        bordered={false}
                                        value={tempFilterData.incidentTypeId}
                                        onChange={value => handleInputChange('incidentTypeId', value)}
                                        options={incidentTypeDropdownOptions}
                                    >
                                    </Select>
                                </div>
                            </div>
                            <div className='flex flex-row mb-4'>
                                <div className='flex flex-row items-center w-1/2'>
                                    <p className="mr-10 font-bold w-72">Report By</p>
                                    <Select
                                        className={`border-2 rounded mt-2.5 p-3.5 h-100 custom-select bg-white`}
                                        size={"middle"}
                                        bordered={false}
                                        value={tempFilterData.reportBy}
                                        onChange={value => handleInputChange('reportBy', value)}
                                        options={reporterIncidentDropdownOptions}
                                    >
                                    </Select>
                                </div>
                                <div className='flex flex-row items-center w-1/2'>
                                    <p className="ml-10 mr-10 font-bold w-72">PIC Name</p>
                                    <Select
                                        className={`border-2 rounded mt-2.5 p-3.5 h-100 custom-select bg-white`}
                                        size={"middle"}
                                        bordered={false}
                                        value={tempFilterData.picNameId}
                                        onChange={value => handleInputChange('picNameId', value)}
                                        options={picNameDropdownOptions}
                                    >
                                    </Select>
                                </div>
                            </div>
                            <div className='flex flex-row mb-4'>
                                <div className='flex flex-row items-center w-1/2'>
                                    <p className="mr-10 font-bold w-72">Report Date</p>
                                    <div className="border-2 rounded mt-2.5 p-3.5 h-100 custom-select bg-white">
                                        <RangePicker
                                            className="w-full"
                                            size="middle"
                                            bordered={false}
                                            value={(tempFilterData.reportDateBegin === '' && tempFilterData.reportDateEnded === '') ? [initialDate.fromDate, initialDate.toDate] : 
                                            [dayjs(tempFilterData.reportDateBegin), dayjs(tempFilterData.reportDateEnded)]}
                                            format={dateFormat}
                                            onChange={(dates) => handleReportDateChange(dates)}
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-row items-center w-1/2'>
                                    <p className="ml-10 mr-10 font-bold w-72">Stage</p>
                                    <Select
                                        className={`border-2 rounded mt-2.5 p-3.5 h-100 custom-select bg-white`}
                                        size={"middle"}
                                        bordered={false}
                                        value={tempFilterData.incidentStageIds}
                                        onChange={value => handleInputChange('incidentStageIds', value)}
                                        options={incidentStageOptions}
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
                                            value={tempFilterData.dueDate === ''? null : dayjs(tempFilterData.dueDate)}
                                            format={dateFormat}
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
                                    <p className="mr-2 font-bold w-64">Incident Detail</p>
                                    <TextArea
                                        className={`border-2 rounded mt-2.5 p-3.5 w-full h-100`}
                                        value={tempFilterData.incidentDetail}
                                        onChange={e => handleInputChange('incidentDetail', e.target.value)}
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
                incidentType: item.incidentType,
                incidentDetail: item.incidentDetail,
                reportBy: item.reportBy,
                picName: item.picName,
                reportDate: item.reportDate,
                completeDate: item.completeDate,
                dueDate: item.dueDate,
                sendNotificationDate: item.sendNotificationDate,
                rootCause: item.rootCause,
                remediationAction: item.remediationAction,
                stage: item.stage
            };
            return row;
        })
    }

    const overviewData = dataSource();

    return (
        <div>
            {RenderExcelIncident()}
            {RenderIncidentListFilter()}
            <style>
                {`
                    #incidentListTable .ant-table-thead > tr > th {
                        background-color: #d1d5db !important;
                        color: black !important;
                        text-align:left !important;
                        border-top: 1px solid black !important;
                        border-radius: 0 !important; 
                    } 
                    #incidentListTable .ant-table-tbody > tr > td {
                        border-top: 1px solid black !important;
                    }
                    #incidentListTable .ant-table-tbody > tr:last-child > td {
                        border-bottom: 1px solid black !important;
                    }
                `}
            </style>
            <div className="overflow-x-auto">
                <Table
                    dataSource={overviewData}
                    columns={columns}
                    loading={isValidating}
                    id="incidentListTable"
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

const IncidentListPage: Page = () => {
    return (
        <Authorize>
            <Title>Incident List</Title>
            <div>
                <Row className="mb-4">
                    <p className="text-base font-semibold text-gray-500"> Data Breach and Incident Management</p>
                    <p className="text-base font-semibold text-blue-500 ml-1"> / Incident List</p>
                </Row>
                <IncidentList></IncidentList>
            </div>
        </Authorize>
    );
}

IncidentListPage.layout = WithCategoryLayout;
export default IncidentListPage;