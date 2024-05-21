import React, { useState } from 'react';
import { Title } from '../../../../../components/Title';
import { Page } from '../../../../../types/Page';
import { WithCategoryLayout } from '@/components/CategoryLayout';
import { Authorize } from '@/components/Authorize';
import { Button, Row, Select, Table } from 'antd';
import useSWR, { mutate } from 'swr';
import { BackendApiUrl, GetUsers } from '@/functions/BackendApiUrl';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faFilter, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import UserForm from '@/components/master/UserForm';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';
import { useRouter } from 'next/router';
import CustomDeleteModal from '@/components/master/CustomDeleteModal';
import { ColumnsType } from 'antd/es/table';

interface DataItem {
    id: number,
    name: string,
    email: string,
}

interface DataItems {
    datas: DataItem[]
}

interface DataRow extends DataItem {
    rowNumber: number;
    key: React.Key;
}

interface DropdownModel {
    email: string;
}

const MasterUserDetail: React.FC = () => {
    const router = useRouter();
    const id = router.query['groupUserId']?.toString() ?? '';
    const swrFetcher = useSwrFetcherWithAccessToken();
    const { fetchDELETE } = useFetchWithAccessToken();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { data: emailList } = useSWR<DropdownModel[]>(BackendApiUrl.getEmailList, swrFetcher);

    const toggleFilter = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const initialFilterData = {
        email: [] as string[],
        id: id
    };

    const [filterData, setFilterData] = useState(initialFilterData);
    const [tempFilterData, setTempFilterData] = useState({ ...filterData });

    const { data, isValidating } = useSWR<DataItems>(GetUsers(
        filterData.email,
        filterData.id
    ), swrFetcher);

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

    function dataSource(): DataRow[] {
        if (!data) {
            return [];
        }
        return data.datas.map((item, index) => {
            const row: DataRow = {
                key: index,
                rowNumber: index + 1,
                email: item.email,
                name: item.name,
                id: item.id,
            };
            return row;
        })
    }

    const overviewData = dataSource();

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [deleteItemEmail, setDeleteItemEmail] = useState(null);
    const [deleteItemName, setDeleteItemName] = useState(null);

    const handleDelete = (id, email, name) => {
        setDeleteItemId(id);
        setDeleteItemEmail(email);
        setDeleteItemName(name);
        setDeleteModalVisible(true);
    };

    const handleDeleteConfirm = async () => {
        const { data } = await fetchDELETE(BackendApiUrl.deleteUsers + `?Id=${deleteItemId}`);
        if (data) {
            mutate(BackendApiUrl.getUsersList, true);
        }
        setDeleteModalVisible(false);
    };

    const handleDeleteCancel = () => {
        setDeleteModalVisible(false);
    };

    const columns: ColumnsType<DataRow> = [
        {
            title: "No",
            dataIndex: "rowNumber",
            key: "rowNumber",
            align: "left"
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            align: "left",
        },
        {
            title: 'Action',
            key: 'action',
            render: (record) => (
                <div className="flex">
                    <button className="bg-red-500 text-white py-2 px-4 rounded mr-2" onClick={() => handleDelete(record.id, record.email, record.name)}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <Row>
                <p style={{ fontSize: 'large', fontWeight: 600, color: "grey" }}>Master</p>
                <p className='cursor-pointer' style={{ fontSize: 'large', color: "grey", fontWeight: 600, marginLeft: '4px' }} onClick={() => router.push(`/${router.query['categoryId']}/master/masterGroupUser`)}> / Master Group User</p>
                <p style={{ fontSize: 'large', color: '#3788FD', fontWeight: 600, marginLeft: '4px' }}> / </p>
            </Row>

            <hr style={{ margin: '20px 0' }} />
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
                        <div className='flex flex-row items-center mb-2'>
                            <p className="font-bold w-72">Email</p>
                            <Select
                                mode="multiple"
                                allowClear
                                showSearch
                                className={`border-2 rounded mt-2.5 p-3.5 h-100 custom-select bg-white`}
                                bordered={false}
                                placeholder="Please select"
                                value={tempFilterData.email}
                                onChange={value => handleInputChange('email', value)}
                                options={emailList?.map(item => ({
                                    label: item.email,
                                    value: item.email
                                })) || []}
                            />
                        </div>
                        <div className='flex justify-end mt-5'>
                            <Button size='large' style={{ borderColor: '#3788FD', color: '#3788FD' }} className='mr-5' onClick={handleClear}>Clear</Button>
                            <Button size='large' style={{ backgroundColor: '#3788FD', color: 'white' }} onClick={handleSearch}>Search</Button>
                        </div>
                    </div>
                </div>
            )}

            <hr style={{ margin: '20px 0' }} />
            <Table
                dataSource={overviewData}
                columns={columns}
                loading={isValidating}
                id="ListTable"
                pagination={{
                    position: ['bottomCenter'],
                    simple: true, defaultCurrent: 1,
                    pageSize: 10
                }}
            />

            {deleteModalVisible &&
                <CustomDeleteModal visible={deleteModalVisible} email={deleteItemEmail} id={deleteItemId} name={deleteItemName} onCancel={handleDeleteCancel} onConfirm={handleDeleteConfirm} />
            }
            <hr style={{ margin: '20px 0' }} />
            <UserForm />
        </div>
    );
};

const MasterUserDetailPage: Page = () => {
    return (
        <Authorize>
            <Title>Master Question Detail </Title>
            <MasterUserDetail></MasterUserDetail>
        </Authorize>
    );
}


MasterUserDetailPage.layout = WithCategoryLayout;
export default MasterUserDetailPage;