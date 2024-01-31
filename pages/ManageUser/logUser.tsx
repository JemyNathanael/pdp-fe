import SearchInput from "@/components/SearchInput";
import { GetLog } from "@/functions/BackendApiUrl";
import { useSwrFetcherWithAccessToken } from "@/functions/useSwrFetcherWithAccessToken";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import useSWR from 'swr';
import { useDebounce } from "use-debounce";

interface DataItem {
    dateandTime: string;
    description: string;
    user: string;
    createdBy: string;
}
interface DataItems {
    datas: DataItem[]
    totalData: number
}
interface DataRow extends DataItem {
    rowNumber: number;
    key: React.Key;
}

interface FilterData {
    itemsPerPage: number,
    page: number,
    search: string
}


const LogUser: React.FC = () => {
    const [search, setSearch] = useState('');
    const [page, setPages] = useState<number>(1);

    const [debouncedValue] = useDebounce(search, 1000);

    const filter: FilterData = {
        itemsPerPage: 10,
        page: page,
        search: search
    };

    const columns: ColumnsType<DataRow> = [
        {
            title: "Date and Time",
            dataIndex: "dateandTime",
            key: "dateandTime",
            width: 300,
            align: "center"

        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            align: "center"
        },
        {
            title: "User",
            dataIndex: "user",
            key: "user",
            align: "center"
        },
        {
            title: "Created By",
            dataIndex: "createdBy",
            key: "createdBy",
            align: "center"
        },
    ];

    const swrFetcher = useSwrFetcherWithAccessToken();

    const onSearchHandler = (event) => {
        setSearch(event.target.value);
    }

    const { data, isValidating } = useSWR<DataItems>(GetLog(
        filter.itemsPerPage,
        filter.page,
        debouncedValue
    ), swrFetcher);

    function dataSource(): DataRow[] {
        if (!data) {
            return [];
        }

        return data.datas.map((item, index) => {
            const row: DataRow = {
                key: index,
                rowNumber: index + 1,
                dateandTime: item.dateandTime,
                description: item.description,
                user: item.user,
                createdBy: item.createdBy
            };
            return row;
        })
    }

    const overviewData = dataSource();

    const filteredData = overviewData.filter(overview => {
        const searchList = new RegExp(debouncedValue, 'i')
        return searchList.test(overview.user)
    });

    return (
        <div id="logUser">
            <style>
                {`
          #logUserTable .ant-table-thead > tr > th {
            background-color: #FAFAFA !important;
            color: black !important;
            text-align:center !important;
          } 
        `}
            </style>
            <div className="grid grid-cols-2 gap-4">
                <SearchInput onSearch={onSearchHandler} placeholder={"Search by user"} />
            </div>
            <Table
                dataSource={filteredData}
                columns={columns}
                loading={isValidating}
                id="logUserTable"
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
            <footer className="font-semibold text-[#3788FD] text-center mt-5 md:mt-36">Copyright @ PT. Accelist Lentera Indonesia</footer>
        </div>
    );
}

export default LogUser;
