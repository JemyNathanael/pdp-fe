import React, { useState } from 'react';
import { Title } from '../../../../components/Title';
import { Page } from '../../../../types/Page';
import { WithCategoryLayout } from '@/components/CategoryLayout';
import { Authorize } from '@/components/Authorize';
import { Button, Input, Row, Table, Modal } from 'antd';
import useSWR, { mutate } from 'swr';
import UserTemplateForm from '@/components/master/UserTemplateForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faFilter, faPencil, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import { BackendApiUrl, GetUserTemplate } from '@/functions/BackendApiUrl';
import router from 'next/router';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';
import CustomDeleteTemplateModal from '@/components/master/CustomDeleteTemplateModal';
import { ColumnsType } from 'antd/es/table';

interface DataItem {
    id: number,
    groupUserName: string,
    description: string,
    totalUser: number,
}

interface DataItems {
    datas: DataItem[]
}

interface DataRow extends DataItem {
    rowNumber: number;
    key: React.Key;
}

const MasterGroupUser: React.FC = () => {
    const swrFetcher = useSwrFetcherWithAccessToken();
    const { fetchDELETE } = useFetchWithAccessToken();
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const toggleFilter = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const initialFilterData = {
        groupUserName: '',
        description: '',
    };

    const [filterData, setFilterData] = useState(initialFilterData);
    const [tempFilterData, setTempFilterData] = useState({ ...filterData });

    const { data, isValidating } = useSWR<DataItems>(GetUserTemplate(
        filterData.groupUserName,
        filterData.description
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
                groupUserName: item.groupUserName,
                description: item.description,
                totalUser: item.totalUser,
                id: item.id,
            };
            return row;
        })
    }

    const overviewData = dataSource();

    const [id, setId] = useState(0);
    const [groupUsername, setGroupUserName] = useState("");
    const [description, setDescription] = useState("");

    const handleUpdate = async (id: number, groupUserName: string, description: string) => {
        setId(id);
        setGroupUserName(groupUserName);
        setDescription(description);
    }

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState();
    const [deleteItemName, setDeleteItemName] = useState('');
    const [warningModalVisible, setWarningModalVisible] = useState(false);

    const handleDelete = (groupUserName, id, totalUser) => {
        if (totalUser != 0) {
            setWarningModalVisible(true)
        } else{
            setDeleteItemId(id);
            setDeleteItemName(groupUserName);
            setDeleteModalVisible(true);
        }
    };

    const handleDeleteConfirm = async () => {
        const { data } = await fetchDELETE(BackendApiUrl.deleteUserTemplateList + `?Id=${deleteItemId}`);
        if (data) {
            mutate(BackendApiUrl.getUserTemplateList, true);
        }
        setDeleteModalVisible(false);
    };

    const columns: ColumnsType<DataRow> = [
        {
            title: "No",
            dataIndex: "rowNumber",
            key: "rowNumber",
            align: "left",
        },
        {
            title: "Group User Name",
            dataIndex: "groupUserName",
            key: "groupUserName",
            align: "left",
            render: (text, record) => (
                <span
                    className="text-left text-[#3788FD] cursor-pointer"
                    onClick={() => router.push(`/${router.query['categoryId']}/master/masterGroupUser/${record.id}`)}
                >
                    {text}
                </span>
            ),
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "totalUser",
            align: "left"
        },
        {
            title: "Total User",
            dataIndex: "totalUser",
            key: "totalUser",
            align: "left"
        },
        {
            title: 'Action',
            key: 'action',
            render: (record) => (
                <div className="flex">
                    <button className="bg-red-500 text-white py-2 px-4 rounded mr-2" onClick={() => handleDelete(record.groupUserName, record.id, record.totalUser)}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                    <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={() => handleUpdate(record.id, record.groupUserName, record.description)}>
                        <FontAwesomeIcon icon={faPencil} />
                    </button>
                </div>
            ),
        },
    ];

    const { TextArea } = Input;

    return (
        <div>
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
                            <p className="font-bold w-72">Group User Name</p>
                            <Input
                                className={`border-2 rounded mt-2.5 p-3.5 w-full`}
                                value={tempFilterData.groupUserName}
                                onChange={e => handleInputChange('groupUserName', e.target.value)}
                            />

                        </div>
                        <div className='flex flex-row items-center '>
                            <p className="font-bold w-72">Deskripsi</p>
                            <div className='rounded w-full'>
                                <TextArea
                                    className={`border-2 rounded mt-1.5 p-3.5 w-full bg-white`}
                                    value={tempFilterData.description}
                                    onChange={e => handleInputChange('description', e.target.value)}
                                ></TextArea>
                            </div>
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
                <CustomDeleteTemplateModal visible={deleteModalVisible} name={deleteItemName} id={deleteItemId} onCancel={() => setDeleteModalVisible(false)} onConfirm={handleDeleteConfirm} />
            }
            {warningModalVisible &&
                <Modal
                    title="Peringatan"
                    visible={warningModalVisible}
                    onCancel={() => setWarningModalVisible(false)}
                    centered
                    footer={false}
                >
                    <p>Hapus terlebih dahulu User hingga Jumlah User 0 untuk menghapus Group User Name</p>
                </Modal>
            }
            <hr style={{ margin: '20px 0' }} />
            <UserTemplateForm id={id} groupUserName={groupUsername} description={description} />
        </div>
    );
};

const MasterGroupUserPage: Page = () => {
    return (
        <Authorize>
            <Title>Master</Title>
            <Row>
                <p style={{ fontSize: 'large', fontWeight: 600, color: "grey" }}>Master</p>
                <p style={{ fontSize: 'large', color: '#3788FD', fontWeight: 600, marginLeft: '4px' }}> / Master Group User</p>
            </Row>
            <MasterGroupUser></MasterGroupUser>
        </Authorize>
    );
}


MasterGroupUserPage.layout = WithCategoryLayout;
export default MasterGroupUserPage;