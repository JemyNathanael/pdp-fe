import React, { useEffect, useState } from 'react';
import { Title } from '../../../../components/Title';
import { Page } from '../../../../types/Page';
import { WithCategoryLayout } from '@/components/CategoryLayout';
import { Authorize } from '@/components/Authorize';
import { Button, Input, Row, Select, Table, Modal } from 'antd';
import useSWR, { mutate } from 'swr';
import { BackendApiUrl, GetQuestionTemplate } from '@/functions/BackendApiUrl';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import { SelectOptions } from '@/components/interfaces/AddNewUserForms';
import QuestionTemplateForm from '@/components/master/QuestionTemplateForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faFilter, faPencil, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import router from 'next/router';
import { ColumnsType } from 'antd/es/table';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';
import CustomDeleteTemplateModal from '@/components/master/CustomDeleteTemplateModal';

interface ProcessTypeDropdownModel {
    id: number;
    processTypeName: string;
}

interface DataItem {
    id: number,
    questionName: string,
    processName: string,
    total: number,
}

interface DataItems {
    datas: DataItem[]
}

interface DataRow extends DataItem {
    rowNumber: number;
    key: React.Key;
}

const MasterQuestion: React.FC = () => {
    const swrFetcher = useSwrFetcherWithAccessToken();
    const [processTypeOptions, setProcessTypeOptions] = useState<SelectOptions<number>[]>([]);
    const { data: processTypeList } = useSWR<ProcessTypeDropdownModel[]>(BackendApiUrl.getProcessTypeList, swrFetcher);
    const { fetchDELETE } = useFetchWithAccessToken();

    useEffect(() => {
        const dataSource = () => {
            if (!processTypeList) {
                return [];
            }
            const options = processTypeList.map((item) => ({
                label: item.processTypeName,
                value: item.id,
            }));

            return options;
        };
        setProcessTypeOptions(dataSource());
    }, [processTypeList]);

    const RenderQuestionTemplateFilter = () => {
        const [isFilterOpen, setIsFilterOpen] = useState(false);

        const toggleFilter = () => {
            setIsFilterOpen(!isFilterOpen);
        };

        const initialFilterData = {
            questionName: '',
            processId: '',
        };

        const [filterData, setFilterData] = useState(initialFilterData);
        const [tempFilterData, setTempFilterData] = useState({ ...filterData });

        const { data, isValidating } = useSWR<DataItems>(GetQuestionTemplate(
            filterData.questionName,
            filterData.processId
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
                    questionName: item.questionName,
                    processName: item.processName,
                    total: item.total,
                    id: item.id,
                };
                return row;
            })
        }

        const overviewData = dataSource();

        const [deleteModalVisible, setDeleteModalVisible] = useState(false);
        const [itemId, setItemId] = useState(0);
        const [itemName, setItemName] = useState('');
        const [itemProcess, setItemProcess] = useState(0);
        const [warningModalVisible, setWarningModalVisible] = useState(false);

        const handleDelete = (name, id, total) => {
            if (total != 0) {
                setWarningModalVisible(true)
            } else {
                setItemName(name);
                setItemId(id);
                setDeleteModalVisible(true);
            }
        };

        const handleUpdate = async (id: number, groupUserName: string, processName: string) => {
            setItemId(id);
            setItemName(groupUserName);
            if (processName == "PIA") setItemProcess(1);
            if (processName == "TRIA") setItemProcess(2);
        }

        const handleDeleteConfirm = async () => {
            const response = await fetchDELETE<Response>(`${BackendApiUrl.deleteQuestionTemplate}?Id=${itemId}`);
            if (response.data) {
                mutate(BackendApiUrl.getQuestionTemplateList, true);
            }
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
                title: "Question Name",
                dataIndex: "questionName",
                key: "questionName",
                align: "left",
                render: (text, record) => (
                    <span
                        className="text-left text-[#3788FD] cursor-pointer"
                        onClick={() => router.push(`/${router.query['categoryId']}/master/masterQuestion/${record.id}`)}
                    >
                        {text}
                    </span>
                ),
            },
            {
                title: "Process Name",
                dataIndex: "processName",
                key: "processName",
                align: "left"
            },
            {
                title: "Total",
                dataIndex: "total",
                key: "total",
                align: "left"
            },
            {
                title: 'Action',
                key: 'action',
                render: (record) => (
                    <div className="flex">
                        <button className="bg-red-500 text-white py-2 px-4 rounded mr-2" onClick={() => handleDelete(record.questionName, record.id, record.total)}>
                            <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                        <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={() => handleUpdate(record.id, record.questionName, record.processName)}>
                            <FontAwesomeIcon icon={faPencil} />
                        </button>
                    </div>
                ),
            },
        ];

        return (
            <>
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
                            <div className='flex flex-row'>
                                <div className='flex flex-row items-center w-1/2'>
                                    <p className="mr-10 font-bold">Question Template Name</p>
                                    <Input
                                        className={`border-2 rounded mt-2.5 p-3.5 w-full`}
                                        value={tempFilterData.questionName}
                                        onChange={e => handleInputChange('questionName', e.target.value)}
                                    />
                                </div>
                                <div className='flex flex-row items-center w-1/2'>
                                    <p className="ml-10 mr-10 font-bold">Process Name</p>
                                    <div className='bg-white rounded w-full'>
                                        <Select
                                            className={`border-2 rounded mt-2.5 p-3.5 h-100 custom-select bg-white'`}
                                            size={"large"}
                                            bordered={false}
                                            value={tempFilterData.processId}
                                            onChange={value => handleInputChange('processId', value)}
                                            options={processTypeOptions}
                                        />
                                    </div>
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
                <hr style={{ margin: '20px 0' }} />

                {deleteModalVisible &&
                    <CustomDeleteTemplateModal visible={deleteModalVisible} name={itemName} id={itemId} onCancel={() => setDeleteModalVisible(false)} onConfirm={handleDeleteConfirm} />
                }
                {warningModalVisible &&
                    <Modal
                        title="Peringatan"
                        visible={warningModalVisible}
                        onCancel={() => setWarningModalVisible(false)}
                        centered
                        footer={false}
                    >
                        <p>Hapus terlebih dahulu Question hingga Jumlah Question 0 untuk menghapus Question Template</p>
                    </Modal>
                }
                <QuestionTemplateForm processTypeOptions={processTypeOptions} id={itemId} name={itemName} processTypeId={itemProcess} />
            </>
        )
    }

    return (
        <div>
            {RenderQuestionTemplateFilter()}
        </div>
    );
};

const MasterQuestionPage: Page = () => {
    return (
        <Authorize>
            <Title>Master Question </Title>
            <Row>
                <p style={{ fontSize: 'large', fontWeight: 600, color: "grey" }}>Master</p>
                <p style={{ fontSize: 'large', color: '#3788FD', fontWeight: 600, marginLeft: '4px' }}> / Master Question</p>
            </Row>
            <MasterQuestion></MasterQuestion>
        </Authorize>
    );
}


MasterQuestionPage.layout = WithCategoryLayout;
export default MasterQuestionPage;