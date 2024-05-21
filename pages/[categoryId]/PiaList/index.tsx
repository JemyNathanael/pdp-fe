import { Authorize } from "@/components/Authorize";
import { Button, DatePicker, Input, Row, Select } from 'antd';
import { BackendApiUrl, GetExcelPia, GetPiaList } from "@/functions/BackendApiUrl";
import { ColumnsType } from "antd/es/table";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCircleInfo, faFilter } from '@fortawesome/free-solid-svg-icons';
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
    activityName: string;
    status: string;
    responden: string;
    reviewer: string;
    approver: string;
    departmentName: string;
    individualCategoryName: string;
    personalDataCategoryName: string;
    lawfulBaseName: string;
    inherentRiskLevel: string;
    targetResidualRiskLevel: string;
    residualRiskLevel: string;
    majorRiskCount: string;
    mediumRiskCount: string;
    minorRiskCount: string;
    noRiskCount: string;
    piaStartedDate: string;
    piaDoneDate: string;
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

interface DropdownUsers {
    id: string,
    email: string
}

const PiaList: React.FC = () => {
    const [page, setPages] = useState<number>(1);
    const initialFilterData = {
        itemsPerPage: 10,
        page: page,
        activityName: '',
        piaStatusIds: [] as string[],
        departmentId: '',
        respondenId: '',
        reviewerId: '',
        approverId: '',
        individualCategoryId: '',
        personalDataCategoryId: '',
        lawfulBasisId: '',
        startDateBegin: '',
        startDateEnded: '',
        endDateBegin: '',
        endDateEnded: ''
    };

    const columns: ColumnsType<DataRow> = [
        {
            title: "ID",
            dataIndex: "rowNumber",
            key: "rowNumber",
            align: "left"
        },
        {
            title: "Activity Name",
            dataIndex: "activityName",
            key: "activityName",
            align: "left",
            render: (text) => (
                <span
                    className="text-left text-[#3788FD] cursor-pointer"
                    onClick={() => router.push(`/${router.query['categoryId']}/piaList/piaId`)}
                >
                    {text}
                </span>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
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
                    case 'On Progress':
                        buttonColor = '#5E5E5E';
                        textColor = 'white';
                        borderColor = '#5E5E5E';
                        break;
                    case 'Under Review':
                        buttonColor = '#FAC710';
                        textColor = 'white';
                        borderColor = '#FAC710';
                        break;
                    case 'Complete':
                        buttonColor = '#8FD14F';
                        textColor = 'white';
                        borderColor = '#8FD14F';
                        break;
                    case 'Approval':
                        buttonColor = '#2D9BF0';
                        textColor = 'white';
                        borderColor = '#2D9BF0';
                        break;
                    case 'Urgent':
                        buttonColor = '#FF0000';
                        textColor = 'white';
                        borderColor = '#FF0000';
                        break;
                    case 'Monitoring':
                        buttonColor = '#F07F2D';
                        textColor = 'white';
                        borderColor = '#F07F2D';
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
            title: "Responden",
            dataIndex: "responden",
            key: "responden",
            align: "left"
        },
        {
            title: "Reviewer",
            dataIndex: "reviewer",
            key: "reviewer",
            align: "left"
        },
        {
            title: "Approver",
            dataIndex: "approver",
            key: "approver",
            align: "left",
        },
        {
            title: "Inherent Risk Level",
            dataIndex: "inherentRiskLevel",
            key: "inherentRiskLevel",
            align: "left"
        },
        {
            title: "Target Residual Risk Level",
            dataIndex: "targetResidualRiskLevel",
            key: "targetResidualRiskLevel",
            align: "left"
        },
        {
            title: "Residual Risk Level",
            dataIndex: "residualRiskLevel",
            key: "residualRiskLevel",
            align: "left"
        },
        {
            title: "Department",
            dataIndex: "departmentName",
            key: "departmentName",
            align: "left"
        },
        {
            title: "Categories of Individuals",
            dataIndex: "individualCategoryName",
            key: "individualCategoryName",
            align: "left"
        },
        {
            title: "Categories of Personal Data",
            dataIndex: "personalDataCategoryName",
            key: "personalDataCategoryName",
            align: "left",
        },
        {
            title: "Lawful Basis",
            dataIndex: "lawfulBaseName",
            key: "lawfulBaseName",
            align: "left"
        },
        {
            title: "Inherent Risk Level",
            dataIndex: "inherentRiskLevel",
            key: "inherentRiskLevel",
            align: "left"
        },
        {
            title: "Target Residual Risk Level",
            dataIndex: "targetResidualRiskLevel",
            key: "targetResidualRiskLevel",
            align: "left"
        },
        {
            title: "Residual Risk Level",
            dataIndex: "residualRiskLevel",
            key: "residualRiskLevel",
            align: "left"
        },
        {
            title: (
                <span>
                    Risk Count <FontAwesomeIcon icon={faCircleInfo} />
                </span>
            ),
            dataIndex: "riskCount",
            key: "riskCount",
            align: "left",
            render: (text, record) => {
                return (
                    <div>
                        <span className="text-red-500">{record.majorRiskCount}</span> /&nbsp;
                        <span className="text-yellow-500">{record.mediumRiskCount}</span> /&nbsp;
                        <span className="text-blue-500">{record.minorRiskCount}</span> /&nbsp;
                        <span className="text-black">{record.noRiskCount}</span>
                    </div>
                );
            }
        },
        {
            title: "PIA Started Date",
            dataIndex: "piaStartedDate",
            key: "piaStartedDate",
            align: "left"
        },
        {
            title: "PIA Done Date",
            dataIndex: "piaDoneDate",
            key: "piaDoneDate",
            align: "left"
        }
    ];

    const swrFetcher = useSwrFetcherWithAccessToken();
    const [filterData, setFilterData] = useState(initialFilterData);
    const [tempFilterData, setTempFilterData] = useState({ ...filterData });
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const { data, isValidating } = useSWR<DataItems>(GetPiaList(
        filterData.itemsPerPage,
        page,
        filterData.activityName,
        filterData.departmentId,
        filterData.respondenId,
        filterData.reviewerId,
        filterData.approverId,
        filterData.personalDataCategoryId,
        filterData.piaStatusIds,
        filterData.individualCategoryId,
        filterData.lawfulBasisId,
        filterData.startDateBegin,
        filterData.startDateEnded,
        filterData.endDateBegin,
        filterData.endDateEnded
    ), swrFetcher);

    const RenderExcelPia = () => {
        return (
            <div className='flex justify-end mt-5'>
                <a href={GetExcelPia(
                    filterData.activityName,
                    filterData.departmentId,
                    filterData.respondenId,
                    filterData.reviewerId,
                    filterData.approverId,
                    filterData.personalDataCategoryId,
                    filterData.piaStatusIds,
                    filterData.individualCategoryId,
                    filterData.lawfulBasisId,
                    filterData.startDateBegin,
                    filterData.startDateEnded,
                    filterData.endDateBegin,
                    filterData.endDateEnded
                )} download>
                    <Button size="middle" className="bg-blue-500 text-white w-32 mb-4 mr-4">Download Data</Button>
                </a>
            </div>
        )
    }

    const RenderPiaListFilter = () => {
        const initialDate = {
            fromDate: null,
            toDate: null
        }

        const { data: departments } = useSWR<DropdownModel[]>(BackendApiUrl.getDepartments, swrFetcher);
        const departmentOptions = departments?.map((item) => ({
            label: item.name,
            value: item.id,
        }));

        const { data: personalDataCategories } = useSWR<DropdownModel[]>(BackendApiUrl.getPersonalDataCategories, swrFetcher);
        const personalDataCategoriesOptions = personalDataCategories?.map((item) => ({
            label: item.name,
            value: item.id,
        }));

        const { data: piaStatus } = useSWR<DropdownModel[]>(BackendApiUrl.getPiaStatus, swrFetcher);
        const piaStatusOptions = piaStatus?.map((item) => ({
            label: item.name,
            value: item.id,
        }));

        const { data: individualCategories } = useSWR<DropdownModel[]>(BackendApiUrl.getIndividualCategories, swrFetcher);
        const individualCategoriesOptions = individualCategories?.map((item) => ({
            label: item.name,
            value: item.id,
        }));

        const { data: lawfulBasis } = useSWR<DropdownModel[]>(BackendApiUrl.getLawfulBases, swrFetcher);
        const lawfulBasisOptions = lawfulBasis?.map((item) => ({
            label: item.name,
            value: item.id,
        }));

        const { data: usersDropdown } = useSWR<DropdownUsers[]>(BackendApiUrl.getUsersDropdown, swrFetcher);
        const usersDropdownOptions = usersDropdown?.map((item) => ({
            label: item.email,
            value: item.id,
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

        const handleStartDateChange = (dates) => {
            if (dates) {
                const [startDateBegin, startDateEnded] = dates;

                const formattedStartDateBegin = dayjs(startDateBegin).format('YYYY-MM-DD');
                const formattedStartDateEnded = dayjs(startDateEnded).format('YYYY-MM-DD');

                setTempFilterData({
                    ...tempFilterData,
                    startDateBegin: formattedStartDateBegin,
                    startDateEnded: formattedStartDateEnded
                });
            }
        };

        const handleEndDateChange = (dates) => {
            if (dates) {
                const [endDateBegin, endDateEnded] = dates;

                const formattedEndDateBegin = dayjs(endDateBegin).format('YYYY-MM-DD');
                const formattedEndDateEnded = dayjs(endDateEnded).format('YYYY-MM-DD')

                setTempFilterData({
                    ...tempFilterData,
                    endDateBegin: formattedEndDateBegin,
                    endDateEnded: formattedEndDateEnded
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
                                    <p className="mr-10 font-bold w-72">Activity Name</p>
                                    <Input
                                        className={`border-2 rounded mt-2.5 p-3.5 w-full h-11`}
                                        value={tempFilterData.activityName}
                                        onChange={e => handleInputChange('activityName', e.target.value)}
                                    />
                                </div>
                                <div className='flex flex-row items-center w-1/2'>
                                    <p className="ml-10 mr-10 font-bold w-72">Status</p>
                                    <Select
                                        className={`border-2 rounded mt-2.5 p-3.5 h-100 custom-select bg-white`}
                                        size={"middle"}
                                        bordered={false}
                                        value={tempFilterData.piaStatusIds}
                                        onChange={value => handleInputChange('piaStatusIds', value)}
                                        options={piaStatusOptions}
                                        mode="multiple"
                                    >
                                    </Select>
                                </div>
                            </div>
                            <div className='flex flex-row mb-4'>
                                <div className='flex flex-row items-center w-1/2'>
                                    <p className="mr-10 font-bold w-72">Responden</p>
                                    <Select
                                        className={`border-2 rounded mt-2.5 p-3.5 h-100 custom-select bg-white`}
                                        size={"middle"}
                                        bordered={false}
                                        value={tempFilterData.respondenId}
                                        onChange={value => handleInputChange('respondenId', value)}
                                        options={usersDropdownOptions}
                                    >
                                    </Select>
                                </div>
                                <div className='flex flex-row items-center w-1/2'>
                                    <p className="ml-10 mr-10 font-bold w-72">Reviewer</p>
                                    <Select
                                        className={`border-2 rounded mt-2.5 p-3.5 h-100 custom-select bg-white`}
                                        size={"middle"}
                                        bordered={false}
                                        value={tempFilterData.reviewerId}
                                        onChange={value => handleInputChange('reviewerId', value)}
                                        options={usersDropdownOptions}
                                    >
                                    </Select>
                                </div>
                            </div>
                            <div className='flex flex-row mb-4'>
                                <div className='flex flex-row items-center w-1/2'>
                                    <p className="mr-10 font-bold w-72">Approver</p>
                                    <Select
                                        className={`border-2 rounded mt-2.5 p-3.5 h-100 custom-select bg-white`}
                                        size={"middle"}
                                        bordered={false}
                                        value={tempFilterData.approverId}
                                        onChange={value => handleInputChange('approverId', value)}
                                        options={usersDropdownOptions}
                                    >
                                    </Select>
                                </div>
                            </div>
                            <div className='flex flex-row mb-4'>
                                <div className='flex flex-row items-center w-1/2'>
                                    <p className="mr-10 font-bold w-72">Department</p>
                                    <Select
                                        className={`border-2 rounded mt-2.5 p-3.5 h-100 custom-select bg-white`}
                                        size={"middle"}
                                        bordered={false}
                                        value={tempFilterData.departmentId}
                                        onChange={value => handleInputChange('departmentId', value)}
                                        options={departmentOptions}
                                    >
                                    </Select>
                                </div>
                                <div className='flex flex-row items-center w-1/2'>
                                    <p className="ml-10 mr-10 font-bold w-72">Categories of Individual</p>
                                    <Select
                                        className={`border-2 rounded mt-2.5 p-3.5 h-100 custom-select bg-white`}
                                        size={"middle"}
                                        bordered={false}
                                        value={tempFilterData.individualCategoryId}
                                        onChange={value => handleInputChange('individualCategoryId', value)}
                                        options={individualCategoriesOptions}
                                    >
                                    </Select>
                                </div>
                            </div>
                            <div className='flex flex-row mb-4'>
                                <div className='flex flex-row items-center w-1/2'>
                                    <p className="mr-10 font-bold w-72">Categories of Personal Data</p>
                                    <Select
                                        className={`border-2 rounded mt-2.5 p-3.5 h-100 custom-select bg-white`}
                                        size={"middle"}
                                        bordered={false}
                                        value={tempFilterData.personalDataCategoryId}
                                        onChange={value => handleInputChange('personalDataCategoryId', value)}
                                        options={personalDataCategoriesOptions}
                                    >
                                    </Select>
                                </div>
                                <div className='flex flex-row items-center w-1/2 mb-4'>
                                    <p className="ml-10 mr-10 font-bold w-72">Lawful Basis</p>
                                    <Select
                                        className={`border-2 rounded mt-2.5 p-3.5 h-100 custom-select bg-white`}
                                        size={"middle"}
                                        bordered={false}
                                        value={tempFilterData.lawfulBasisId}
                                        onChange={value => handleInputChange('lawfulBasisId', value)}
                                        options={lawfulBasisOptions}
                                    >
                                    </Select>
                                </div>
                            </div>
                            <div className='flex flex-row'>
                                <div className='flex flex-row items-center w-1/2'>
                                    <p className="mr-10 font-bold w-72">PIA Started Date</p>
                                    <div className="border-2 rounded mt-2.5 p-3.5 h-100 custom-select bg-white">
                                        <RangePicker
                                            className="w-full"
                                            size="middle"
                                            bordered={false}
                                            value={(tempFilterData.startDateBegin === '' && tempFilterData.startDateEnded === '') ? [initialDate.fromDate, initialDate.toDate] : 
                                            [dayjs(tempFilterData.startDateBegin), dayjs(tempFilterData.startDateEnded)]}
                                            format={dateFormat}
                                            onChange={(dates) => handleStartDateChange(dates)}
                                        />
                                    </div>
                                </div>

                                <div className='flex flex-row items-center w-1/2 mb-4'>
                                    <p className="ml-10 mr-10 font-bold w-72">PIA Ended Date</p>
                                    <div className="border-2 rounded mt-2.5 p-3.5 h-100 custom-select bg-white">
                                        <DatePicker.RangePicker
                                            className="w-full"
                                            size="middle"
                                            bordered={false}
                                            value={(tempFilterData.endDateBegin === '' && tempFilterData.endDateEnded === '') ? [initialDate.fromDate, initialDate.toDate] : 
                                            [dayjs(tempFilterData.endDateBegin), dayjs(tempFilterData.endDateEnded)]}
                                            format={dateFormat}
                                            onChange={(dates) => handleEndDateChange(dates)}
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
                activityName: item.activityName,
                status: item.status,
                responden: item.responden,
                reviewer: item.reviewer,
                approver: item.approver,
                inherentRiskLevel: item.inherentRiskLevel,
                targetResidualRiskLevel: item.targetResidualRiskLevel,
                residualRiskLevel: item.residualRiskLevel,
                departmentName: item.departmentName,
                individualCategoryName: item.individualCategoryName,
                personalDataCategoryName: item.personalDataCategoryName,
                lawfulBaseName: item.lawfulBaseName,
                majorRiskCount: item.majorRiskCount,
                mediumRiskCount: item.mediumRiskCount,
                minorRiskCount: item.minorRiskCount,
                noRiskCount: item.noRiskCount,
                piaStartedDate: item.piaStartedDate,
                piaDoneDate: item.piaDoneDate,
            };
            return row;
        })
    }

    const overviewData = dataSource();

    return (
        <div>
            {RenderExcelPia()}
            {RenderPiaListFilter()}
            <style>
                {`
                    #piaListTable .ant-table-thead > tr > th {
                        background-color: #d1d5db !important;
                        color: black !important;
                        text-align:left !important;
                        border-top: 1px solid black !important;
                        border-radius: 0 !important; 
                    } 
                    #piaListTable .ant-table-tbody > tr > td {
                        border-top: 1px solid black !important;
                    }
                    #piaListTable .ant-table-tbody > tr:last-child > td {
                        border-bottom: 1px solid black !important;
                    }
                `}
            </style>
            <div className="overflow-x-auto">
                <Table
                    dataSource={overviewData}
                    columns={columns}
                    loading={isValidating}
                    id="piaListTable"
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

const PiaListPage: Page = () => {
    return (
        <Authorize>
            <Title>PIA List</Title>
            <div>
                <Row className="mb-4">
                    <p className="text-base font-semibold text-gray-500"> Privacy Impact Assesment (PIA)</p>
                    <p className="text-base font-semibold text-blue-500 ml-1"> / PIA List</p>
                </Row>
                <PiaList></PiaList>
            </div>
        </Authorize>
    );
}

PiaListPage.layout = WithCategoryLayout;
export default PiaListPage;