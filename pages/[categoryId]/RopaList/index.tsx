import { Authorize } from "@/components/Authorize";
import { Button, Input, Modal, Row, Select } from 'antd';
import { BackendApiUrl, GetExcelRopa, GetRopaList } from "@/functions/BackendApiUrl";
import { ColumnsType } from "antd/es/table";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCircleCheck, faFilter, faPencil, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Title } from '@/components/Title';
import { Table } from "antd";
import { useSwrFetcherWithAccessToken } from "@/functions/useSwrFetcherWithAccessToken";
import { useState } from "react";
import { Page } from "@/types/Page";
import { WithCategoryLayout } from '@/components/CategoryLayout';
import router, { useRouter } from "next/router";
import useSWR, { mutate } from 'swr';
import { useFetchWithAccessToken } from "@/functions/useFetchWithAccessToken";

interface DataItem {
    id: string;
    activityName: string;
    departmentName: string;
    dataOwner: string;
    processingPurpose: string;
    individualCategoryName: string;
    personalDataCategoryName: string;
    lawfulBaseName: string;
    progress: string;
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
interface PopupDeleteProps {
    onGoToHome: () => void;
}

const PopupDelete: React.FC<PopupDeleteProps> = ({ onGoToHome }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-10 bg-secondary-100 backdrop-filter backdrop-blur-md" onClick={onGoToHome}>
            <div className="flex flex-col p-6 sm:p-12 border items-center justify-center">
                <FontAwesomeIcon icon={faCircleCheck} style={{ color: "#3788FD", fontSize: "64px", marginBottom: "8px" }} />
                <div className="w-full h-4 sm:h-8" />
                <h3 className="text-xl sm:text-2xl text-accent-100 font-body font-bold mt-4 sm:mt-6 mb-4 sm:mb-8">Deletion was successful</h3>
            </div>
        </div>
    );
};

const RopaList: React.FC = () => {
    const [page, setPages] = useState<number>(1);
    const { replace } = useRouter();
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [ropaToDelete, setRopaToDelete] = useState<string>();
    const [isDeleteSuccess, setIsDeleteSuccess] = useState<boolean>(false);
    const initialFilterData = {
        itemsPerPage: 10,
        page: page,
        activityName: '',
        departmentId: '',
        dataOwner: '',
        processingPurpose: '',
        individualCategoryId: '',
        personalDataCategoryId: '',
        lawfulBasisId: ''
    };

    function handleDelete(id: string) {
        setRopaToDelete(id);
        setDeleteModal(true);
    }

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
            render: (text, record) => (
                <span
                    className="text-left text-[#3788FD] cursor-pointer"
                    onClick={() => router.push(`/${router.query['categoryId']}/RopaList/${record.id}`)}
                >
                    {text}
                </span>
            ),
        },
        {
            title: "Department",
            dataIndex: "departmentName",
            key: "departmentName",
            align: "left"
        },
        {
            title: "Data Owner",
            dataIndex: "dataOwner",
            key: "dataOwner",
            align: "left"
        },
        {
            title: "Processing Purpose",
            dataIndex: "processingPurpose",
            key: "processingPurpose",
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
            align: "left"
        },
        {
            title: "Lawful Basis",
            dataIndex: "lawfulBaseName",
            key: "lawfulBaseName",
            align: "left"
        },
        {
            title: "Progress",
            dataIndex: "progress",
            key: "progress",
            align: "left"
        },
        {
            title: 'Action',
            key: 'action',
            render: (record) => (
                <div className="flex">
                    <button className="bg-red-500 text-white py-2 px-4 rounded mr-2" onClick={() => handleDelete(record.id)}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                    <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={() => router.push(`/${router.query['categoryId']}/RopaList/${record.id}/editRopa`)}>
                        <FontAwesomeIcon icon={faPencil} />
                    </button>
                </div>
            ),
        },
    ];

    const swrFetcher = useSwrFetcherWithAccessToken();
    const [filterData, setFilterData] = useState(initialFilterData);
    const [tempFilterData, setTempFilterData] = useState({ ...filterData });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { fetchDELETE } = useFetchWithAccessToken();

    const { data, isValidating } = useSWR<DataItems>(GetRopaList(
        filterData.itemsPerPage,
        page,
        filterData.activityName,
        filterData.departmentId,
        filterData.dataOwner,
        filterData.processingPurpose,
        filterData.personalDataCategoryId,
        filterData.individualCategoryId,
        filterData.lawfulBasisId
    ), swrFetcher);

    async function deleteData() {
        const response = await fetchDELETE<Response>(`${BackendApiUrl.deleteRopa}?Id=${ropaToDelete}`);
        if (response.data) {
            setDeleteModal(false);
            setIsDeleteSuccess(true);
            mutate(GetRopaList(
                filterData.itemsPerPage,
                page,
                filterData.activityName,
                filterData.departmentId,
                filterData.dataOwner,
                filterData.processingPurpose,
                filterData.personalDataCategoryId,
                filterData.individualCategoryId,
                filterData.lawfulBasisId
            ));
            setTimeout(() => {
                setIsDeleteSuccess(false)
            }, 1500);
        }
        else {
            setDeleteModal(false);
        }
    }

    function goBackPage() {
        setDeleteModal(false)
        setIsDeleteSuccess(false);
    }

    const RenderExcelRopa = () => {
        return (
            <div className='flex justify-end mt-5'>
                <a href={GetExcelRopa(
                    filterData.activityName,
                    filterData.departmentId,
                    filterData.dataOwner,
                    filterData.processingPurpose,
                    filterData.personalDataCategoryId,
                    filterData.individualCategoryId,
                    filterData.lawfulBasisId
                )} download>
                    <Button size="middle" className="bg-blue-500 text-white w-32 mb-4 mr-4">Download Data</Button>
                </a>
                <Button size="middle" className="bg-blue-500 text-white w-32 mb-4" onClick={() => router.push(`/${router.query['categoryId']}/RopaList/createRopa`)}>Add Data</Button>
            </div>
        )
    }

    const RenderDeleteRopaModal = () => {
        return (
            <Modal
                title={
                    <div className="flex flex-col items-center">
                        <svg width="124" height="124" viewBox="0 0 124 124" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.0194 105.982C13.1455 100.309 8.46028 93.5229 5.23713 86.0197C2.01398 78.5164 0.317422 70.4464 0.246463 62.2805C0.175503 54.1146 1.73156 46.0163 4.82383 38.4581C7.91611 30.9 12.4827 24.0334 18.2571 18.259C24.0315 12.4846 30.8981 7.91806 38.4562 4.82579C46.0143 1.73351 54.1126 0.177456 62.2785 0.248416C70.4445 0.319376 78.5145 2.01593 86.0177 5.23908C93.521 8.46224 100.307 13.1474 105.98 19.0213C117.183 30.6204 123.382 46.1554 123.242 62.2805C123.102 78.4056 116.634 93.8306 105.231 105.233C93.8286 116.636 78.4036 123.104 62.2785 123.244C46.1534 123.384 30.6184 117.185 19.0194 105.982ZM56.3499 31.7518V68.6518H68.6499V31.7518H56.3499ZM56.3499 80.9518V93.2518H68.6499V80.9518H56.3499Z" fill="#FF0000" />
                        </svg>
                        <p className="mt-3 text-xl font-semibold">Are you sure?</p>
                    </div>
                }
                open={deleteModal}
                centered
                closable={false}
                maskClosable={false}
                footer={[
                    <div key={3} className="flex justify-center space-x-4">
                        <button
                            key={2}
                            onClick={() => goBackPage()}
                            className="text-black box-border rounded border border-gray-500 py-1 px-10 text-center"
                        >
                            Back
                        </button>
                        <button
                            key={1}
                            onClick={() => deleteData()}
                            className="bg-[#FF0000] text-white font-semibold border-transparent rounded py-1 px-10 text-center"
                        >
                            Delete
                        </button>
                    </div>
                ]}
            >
                <div className="text-center">
                    <p className="mb-12 mt-3">
                        Do you really want to delete this ROPA? This process <span className="text-[#FF0000]">cannot be undone</span>
                    </p>
                </div>
            </Modal>
        )
    }

    const RenderRopaListFilter = () => {
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
                                    <p className="mr-10 font-bold w-32">Activity Name</p>
                                    <Input
                                        className={`border-2 rounded mt-2.5 p-3.5 w-full h-11`}
                                        value={tempFilterData.activityName}
                                        onChange={e => handleInputChange('activityName', e.target.value)}
                                    />
                                </div>
                                <div className='flex flex-row items-center w-1/2'>
                                    <p className="ml-10 mr-10 font-bold w-32">Department</p>
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
                            </div>
                            <div className='flex flex-row mb-4'>
                                <div className='flex flex-row items-center w-1/2'>
                                    <p className="mr-10 font-bold w-32">Data Owner</p>
                                    <Input
                                        className={`border-2 rounded mt-2.5 p-3.5 w-full h-11`}
                                        value={tempFilterData.dataOwner}
                                        onChange={e => handleInputChange('dataOwner', e.target.value)}
                                    />
                                </div>
                                <div className='flex flex-row items-center w-1/2'>
                                    <p className="ml-10 mr-10 font-bold w-32">Purpose of Processing</p>
                                    <Input
                                        className={`border-2 rounded mt-2.5 p-3.5 w-full h-11`}
                                        value={tempFilterData.processingPurpose}
                                        onChange={e => handleInputChange('processingPurpose', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className='flex flex-row mb-4'>
                                <div className='flex flex-row items-center w-1/2'>
                                    <p className="mr-10 font-bold w-32">Categories of Individual</p>
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
                                <div className='flex flex-row items-center w-1/2'>
                                    <p className="ml-10 mr-10 font-bold w-32">Categories of Personal Data</p>
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
                            </div>
                            <div className='flex flex-row mb-4'>
                                <div className='flex flex-row items-center w-1/2'>
                                    <p className="mr-10 font-bold w-32">Lawful Basis</p>
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
                departmentName: item.departmentName,
                dataOwner: item.dataOwner,
                processingPurpose: item.processingPurpose,
                individualCategoryName: item.individualCategoryName,
                personalDataCategoryName: item.personalDataCategoryName,
                lawfulBaseName: item.lawfulBaseName,
                progress: item.progress
            };
            return row;
        })
    }

    const overviewData = dataSource();

    return (
        <div>
            {RenderDeleteRopaModal()}
            {RenderExcelRopa()}
            {RenderRopaListFilter()}
            <style>
                {`
                    #ropaListTable .ant-table-thead > tr > th {
                        background-color: #d1d5db !important;
                        color: black !important;
                        text-align:left !important;
                        border-top: 1px solid black !important;
                        border-radius: 0 !important; 
                    } 
                    #ropaListTable .ant-table-tbody > tr > td {
                        border-top: 1px solid black !important;
                    }
                    #ropaListTable .ant-table-tbody > tr:last-child > td {
                        border-bottom: 1px solid black !important;
                    }
                `}
            </style>
            <Table
                dataSource={overviewData}
                columns={columns}
                loading={isValidating}
                id="ropaListTable"
                pagination={{
                    position: ['bottomCenter'],
                    simple: true,
                    total: data?.totalData,
                    onChange: (page) => {
                        setPages(page);
                    },
                    current: page,
                    pageSize: 10
                }}
            />
            {isDeleteSuccess && <PopupDelete onGoToHome={() => {
                replace({
                    pathname: `/${router.query['categoryId']}/RopaList`
                })
            }} />}
        </div>
    );
}

const RopaListPage: Page = () => {
    return (
        <Authorize>
            <Title>ROPA List</Title>
            <div>
                <Row className="mb-4">
                    <p className="text-base font-semibold text-gray-500"> (ROPA) Record of Processing Activity</p>
                    <p className="text-base font-semibold text-blue-500 ml-1"> / ROPA List</p>
                </Row>
                <RopaList></RopaList>
            </div>
        </Authorize>
    );
}

RopaListPage.layout = WithCategoryLayout;
export default RopaListPage;