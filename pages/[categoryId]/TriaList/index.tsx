import { Authorize } from "@/components/Authorize";
import { Button, Input, Row, Select } from 'antd';
import { BackendApiUrl, GetExcelTria, GetTriaList } from "@/functions/BackendApiUrl";
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

interface DataItem {
    id: string;
    vendorName: string;
    status: string;
    responden: string;
    reviewer: string;
    approver: string;
    vendorType: string;
    vendorResponsibility: string;
    noSiup: string;
    inherentRiskLevel: string;
    targetResidualRiskLevel: string;
    residualRiskLevel: string;
    majorRiskCount: string;
    mediumRiskCount: string;
    minorRiskCount: string;
    noRiskCount: string;
    triaStartedDate: string;
    triaDoneDate: string;
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

interface DropdownVendorResponsibility {
    vendorResponsibility: string
}

interface DropdownUsers {
    id: string,
    email: string
}

const TriaList: React.FC = () => {
    const [page, setPages] = useState<number>(1);
    const initialFilterData = {
        itemsPerPage: 10,
        page: page,
        vendorName: '',
        respondenId: '',
        reviewerId: '',
        approverId: '',
        triaStatusIds: [] as string[],
        vendorTypeId: '',
        noSiup: '',
        vendorResponsibility: ''
    };

    const columns: ColumnsType<DataRow> = [
        {
            title: "ID",
            dataIndex: "rowNumber",
            key: "rowNumber",
            align: "left"
        },
        {
            title: "Vendor Name",
            dataIndex: "vendorName",
            key: "vendorName",
            align: "left",
            render: (text) => (
                <span
                    className="text-left text-[#3788FD] cursor-pointer"
                    onClick={() => router.push(`/${router.query['categoryId']}/triaList/triaId`)}
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
            title: "Vendor Type",
            dataIndex: "vendorType",
            key: "vendorType",
            align: "left"
        },
        {
            title: "TRIA Started Date",
            dataIndex: "triaStartedDate",
            key: "triaStartedDate",
            align: "left"
        },
        {
            title: "TRIA Done Date",
            dataIndex: "triaDoneDate",
            key: "triaDoneDate",
            align: "left"
        },
        {
            title: "Vendor Responsibility",
            dataIndex: "vendorResponsibility",
            key: "vendorResponsibility",
            align: "left"
        },
        {
            title: "No SIUP",
            dataIndex: "noSiup",
            key: "noSiup",
            align: "left",
        }
    ];

    const swrFetcher = useSwrFetcherWithAccessToken();
    const [filterData, setFilterData] = useState(initialFilterData);
    const [tempFilterData, setTempFilterData] = useState({ ...filterData });
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const { data, isValidating } = useSWR<DataItems>(GetTriaList(
        filterData.itemsPerPage,
        page,
        filterData.vendorName,
        filterData.respondenId,
        filterData.reviewerId,
        filterData.approverId,
        filterData.triaStatusIds,
        filterData.vendorTypeId,
        filterData.noSiup,
        filterData.vendorResponsibility
    ), swrFetcher);

    const RenderExcelTria = () => {
        return (
            <div className='flex justify-end mt-5'>
                <a href={GetExcelTria(
                    filterData.vendorName,
                    filterData.respondenId,
                    filterData.reviewerId,
                    filterData.approverId,
                    filterData.triaStatusIds,
                    filterData.vendorTypeId,
                    filterData.noSiup,
                    filterData.vendorResponsibility
                )} download>
                    <Button size="middle" className="bg-blue-500 text-white w-32 mb-4 mr-4">Download Data</Button>
                </a>
            </div>
        )
    }

    const RenderTriaListFilter = () => {
        const { data: vendorResponsibility } = useSWR<DropdownVendorResponsibility[]>(BackendApiUrl.getVendorResponsibilityDropdown, swrFetcher);
        const vendorResponsibilityOptions = vendorResponsibility?.map((item) => ({
            label: item.vendorResponsibility,
            value: item.vendorResponsibility
        }));

        const { data: vendorTypes } = useSWR<DropdownModel[]>(BackendApiUrl.getVendorTypesDropdown, swrFetcher);
        const vendorTypesOptions = vendorTypes?.map((item) => ({
            label: item.name,
            value: item.id,
        }));

        const { data: triaStatus } = useSWR<DropdownModel[]>(BackendApiUrl.getPiaStatus, swrFetcher);
        const triaStatusOptions = triaStatus?.map((item) => ({
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
                                    <p className="mr-10 font-bold w-72">Vendor Name</p>
                                    <Input
                                        className={`border-2 rounded mt-2.5 p-3.5 w-full h-11`}
                                        value={tempFilterData.vendorName}
                                        onChange={e => handleInputChange('vendorName', e.target.value)}
                                    />
                                </div>
                                <div className='flex flex-row items-center w-1/2'>
                                    <p className="ml-10 mr-10 font-bold w-72">Status</p>
                                    <Select
                                        className={`border-2 rounded mt-2.5 p-3.5 h-100 custom-select bg-white`}
                                        size={"middle"}
                                        bordered={false}
                                        value={tempFilterData.triaStatusIds}
                                        onChange={value => handleInputChange('triaStatusIds', value)}
                                        options={triaStatusOptions}
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
                                    <p className="mr-10 font-bold w-72">Vendor Type</p>
                                    <Select
                                        className={`border-2 rounded mt-2.5 p-3.5 h-100 custom-select bg-white`}
                                        size={"middle"}
                                        bordered={false}
                                        value={tempFilterData.vendorTypeId}
                                        onChange={value => handleInputChange('vendorTypeId', value)}
                                        options={vendorTypesOptions}
                                    >
                                    </Select>
                                </div>
                                <div className='flex flex-row items-center w-1/2'>
                                    <p className="ml-10 mr-10 font-bold w-72">Vendor Responsibility</p>
                                    <Select
                                        className={`border-2 rounded mt-2.5 p-3.5 h-100 custom-select bg-white`}
                                        size={"middle"}
                                        bordered={false}
                                        value={tempFilterData.vendorResponsibility}
                                        onChange={value => handleInputChange('vendorResponsibility', value)}
                                        options={vendorResponsibilityOptions}
                                    >
                                    </Select>
                                </div>
                            </div>
                            <div className='flex flex-row mb-4'>
                                <div className='flex flex-row items-center w-1/2'>
                                    <p className="mr-10 font-bold w-72">No SIUP</p>
                                    <Input
                                        className={`border-2 rounded mt-2.5 p-3.5 w-full h-11`}
                                        value={tempFilterData.noSiup}
                                        onChange={e => handleInputChange('noSiup', e.target.value)}
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
                vendorName: item.vendorName,
                status: item.status,
                responden: item.responden,
                reviewer: item.reviewer,
                approver: item.approver,
                inherentRiskLevel: item.inherentRiskLevel,
                targetResidualRiskLevel: item.targetResidualRiskLevel,
                residualRiskLevel: item.residualRiskLevel,
                majorRiskCount: item.majorRiskCount,
                mediumRiskCount: item.mediumRiskCount,
                minorRiskCount: item.minorRiskCount,
                noRiskCount: item.noRiskCount,
                vendorType: item.vendorType,
                triaStartedDate: item.triaStartedDate,
                triaDoneDate: item.triaDoneDate,
                vendorResponsibility: item.vendorResponsibility,
                noSiup: item.noSiup
            };
            return row;
        })
    }

    const overviewData = dataSource();

    return (
        <div>
            {RenderExcelTria()}
            {RenderTriaListFilter()}
            <style>
                {`
                    #triaListTable .ant-table-thead > tr > th {
                        background-color: #d1d5db !important;
                        color: black !important;
                        text-align:left !important;
                        border-top: 1px solid black !important;
                        border-radius: 0 !important; 
                    } 
                    #triaListTable .ant-table-tbody > tr > td {
                        border-top: 1px solid black !important;
                    }
                    #triaListTable .ant-table-tbody > tr:last-child > td {
                        border-bottom: 1px solid black !important;
                    }
                `}
            </style>
            <div className="overflow-x-auto">
                <Table
                    dataSource={overviewData}
                    columns={columns}
                    loading={isValidating}
                    id="triaListTable"
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

const TriaListPage: Page = () => {
    return (
        <Authorize>
            <Title>Vendor List</Title>
            <div>
                <Row className="mb-4">
                    <p className="text-base font-semibold text-gray-500"> Third Party Risk Assestment (TRIA)</p>
                    <p className="text-base font-semibold text-blue-500 ml-1"> / Vendor List</p>
                </Row>
                <TriaList></TriaList>
            </div>
        </Authorize>
    );
}

TriaListPage.layout = WithCategoryLayout;
export default TriaListPage;