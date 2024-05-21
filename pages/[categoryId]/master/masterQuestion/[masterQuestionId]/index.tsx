import React, { useEffect, useState } from 'react';
import { Title } from '../../../../../components/Title';
import { Page } from '../../../../../types/Page';
import { WithCategoryLayout } from '@/components/CategoryLayout';
import { Authorize } from '@/components/Authorize';
import { Button, Row, Select, Table, Input } from 'antd';
import useSWR, { mutate } from 'swr';
import { BackendApiUrl, GetQuestion } from '@/functions/BackendApiUrl';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import { SelectOptions } from '@/components/interfaces/AddNewUserForms';
import QuestionForm from '@/components/master/QuestionForm';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faFilter, faPencil, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ColumnsType } from 'antd/es/table';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';
import CustomDeleteTemplateModal from '@/components/master/CustomDeleteTemplateModal';

interface DropdownModel {
    id: number;
    questionTypeName: string;
}

interface OptionData {
    id: string;
    option: string;
}

interface DataItem {
    id: string,
    question: string,
    questionType: string,
    optionDatas: OptionData[],
}

interface DataItems {
    datas: DataItem[]
}

interface DataRow extends DataItem {
    rowNumber: number;
    key: React.Key;
}


const MasterQuestionDetail: React.FC = () => {
    const router = useRouter();
    const id = router.query['masterQuestionId']?.toString() ?? '';
    const swrFetcher = useSwrFetcherWithAccessToken();
    const [questionTypeOptions, setQuestionTypeOptions] = useState<SelectOptions<number>[]>([]);
    const { data: questionTypeList } = useSWR<DropdownModel[]>(`${BackendApiUrl.getQuestionTypeList}`, swrFetcher);
    const { fetchDELETE } = useFetchWithAccessToken();

    useEffect(() => {
        const dataSource = () => {
            if (!questionTypeList) {
                return [];
            }
            const options = questionTypeList.map((item) => ({
                label: item.questionTypeName,
                value: item.id,
            }));

            return options;
        };
        setQuestionTypeOptions(dataSource());
    }, [questionTypeList]);

    const RenderQuestionFilter = () => {
        const [isFilterOpen, setIsFilterOpen] = useState(false);

        const toggleFilter = () => {
            setIsFilterOpen(!isFilterOpen);
        };

        const initialFilterData = {
            question: '',
            QuestionTypeId: '',
            id: id,
        };

        const [filterData, setFilterData] = useState(initialFilterData);
        const [tempFilterData, setTempFilterData] = useState({ ...filterData });

        const { data, isValidating } = useSWR<DataItems>(GetQuestion(
            filterData.question,
            filterData.QuestionTypeId,
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

        const formatOptionDataText = (optionDatas) => {
            return optionDatas.map(option => option.option).join(', ');
        };

        function dataSource(): DataRow[] {
            if (!data) {
                return [];
            }

            return data.datas.map((item, index) => {
                const row: DataRow = {
                    key: index,
                    rowNumber: index + 1,
                    question: item.question,
                    questionType: item.questionType,
                    optionDatas: formatOptionDataText(item.optionDatas),
                    id: item.id,
                };
                return row;
            })
        }

        const [deleteModalVisible, setDeleteModalVisible] = useState(false);
        const [itemId, setItemId] = useState(0);
        const [itemName, setItemName] = useState('');
        const [itemType, setItemType] = useState(0);
        const [itemAnswer, setItemAnswer] = useState<string[]>([]);
        const[updateId, setUpdateId] = useState('');

        const handleDelete = (name, id) => {
            setItemName(name);
            setItemId(id);
            setDeleteModalVisible(true);
        };

        const handleDeleteConfirm = async () => {
            const response = await fetchDELETE<Response>(`${BackendApiUrl.deleteQuestion}?Id=${itemId}`);
            if (response.data) {
                mutate(BackendApiUrl.getQuestionList, true);
            }
            setDeleteModalVisible(false);
        };

        const handleUpdate = async (id: string, question: string, questionType: string, optionDatas: string) => {
            setItemName(question);
            setUpdateId(id);
            if (questionType == "Text") setItemType(1);
            if (questionType == "Single Selection") setItemType(2);
            if (questionType == "Multiple Selection") setItemType(3);
            setItemAnswer(optionDatas.split(',').map(option => option.trim()));
        }

        const overviewData = dataSource();

        const columns: ColumnsType<DataRow> = [
            {
                title: "No",
                dataIndex: "rowNumber",
                key: "rowNumber",
                align: "left"
            },
            {
                title: "Question Name",
                dataIndex: "question",
                key: "question",
                align: "left",
            },
            {
                title: "Type Answer",
                dataIndex: "questionType",
                key: "questionType",
                align: "left"
            },
            {
                title: "Answer",
                dataIndex: "optionDatas",
                key: "optionDatas",
                align: "left",
            },
            {
                title: 'Action',
                key: 'action',
                render: (record) => (
                    <div className="flex">
                        <button className="bg-red-500 text-white py-2 px-4 rounded mr-2" onClick={() => handleDelete(record.question, record.id)}>
                            <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                        <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={() => handleUpdate(record.id, record.question, record.questionType, record.optionDatas)}>
                            <FontAwesomeIcon icon={faPencil} />
                        </button>
                    </div>
                ),
            },
        ];

        const { TextArea } = Input;

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
                            <div className='flex flex-row items-center mb-2'>
                                <p className="font-bold w-72">Question</p>
                                <TextArea
                                    className={`border-2 rounded mt-2.5 p-3.5 w-4/5`}
                                    value={tempFilterData.question}
                                    onChange={e => handleInputChange('question', e.target.value)}
                                ></TextArea>
                            </div>
                            <div className='flex flex-row items-center '>
                                <p className="font-bold w-72">Type Answer</p>
                                <div className='bg-white rounded w-4/5'>
                                    <Select
                                        className={`border-2 rounded mt-2.5 p-3.5 h-100 custom-select bg-white'`}
                                        size={"large"}
                                        bordered={false}
                                        value={tempFilterData.QuestionTypeId}
                                        onChange={value => handleInputChange('QuestionTypeId', value)}
                                        options={questionTypeOptions}
                                    />
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
                <QuestionForm questionTypeOptions={questionTypeOptions} id={updateId} question={itemName} questionType={itemType} addOptions={itemAnswer} />
            </>
        )
    }

    return (
        <div>
            {RenderQuestionFilter()}
        </div>
    );
};

const MasterQuestionDetailPage: Page = () => {
    return (
        <Authorize>
            <Title>Master Question Detail </Title>
            <Row>
                <p style={{ fontSize: 'large', fontWeight: 600, color: "grey" }}>Master</p>
                <p style={{ fontSize: 'large', color: '#3788FD', fontWeight: 600, marginLeft: '4px' }}> / Master Question</p>
            </Row>
            <MasterQuestionDetail></MasterQuestionDetail>
        </Authorize>
    );
}

MasterQuestionDetailPage.layout = WithCategoryLayout;
export default MasterQuestionDetailPage;