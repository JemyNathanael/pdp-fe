import SearchInput from "@/components/SearchInput";
import { GetUser } from "@/functions/BackendApiUrl";
import { useSwrFetcherWithAccessToken } from "@/functions/useSwrFetcherWithAccessToken";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import useSWR from 'swr';

interface DataItem {
    fullName: string;
    email: string;
    role: string;
}

interface DataRow extends DataItem {
    rowNumber: number;
    key: React.Key;
}

const columns: ColumnsType<DataRow> = [
    {
        title: "Date and Time",
        dataIndex: "fullName",
        key: "fullName",
        width: 300,

    },
    {
        title: "Description",
        dataIndex: "email",
        key: "email",
    },
    {
        title: "User",
        dataIndex: "role",
        key: "role",
    },
];

const LogUser: React.FC = () => {
    const [search, setSearch] = useState('');
    const swrFetcher = useSwrFetcherWithAccessToken();

    const onSearchHandler = (event) => {
        setSearch(event.target.value);
    }

    const { data, isValidating } = useSWR<DataItem[]>(GetUser(search), swrFetcher);

    function dataSource(): DataRow[] {
        if (!data) {
            return [];
        }

        return data.map((item, index) => {
            const row: DataRow = {
                key: index,
                rowNumber: index + 1,
                fullName: item.fullName,
                email: item.email,
                role: item.role,
            };
            return row;
        })
    }

    const overviewData = dataSource();

    const filteredData = overviewData.filter(overview => {
        const searchList = new RegExp(search, 'i')
        return searchList.test(overview.email)
    });

    return (
        <div id="logUser">
            <style>
                {`
          #logUserTable .ant-table-thead > tr > th {
            background-color: #4F7471 !important;
            color: white !important;
            text-align:center !important;
          } 
          .ant-table-thead > tr > th {
            text-align:center !important;
          } 
          .ant-pagination {
            margin: 16px auto;
            text-align: center;
          }
        `}
            </style>
            <div className="grid grid-cols-2 gap-4">
                <SearchInput onSearch={onSearchHandler} placeholder={"Search by user"} />
            </div>
            <Table dataSource={filteredData} columns={columns} loading={isValidating} id="logUserTable" />
            <footer className="font-semibold text-[#4F7471] text-center mt-5 md:mt-36">Copyright @ PT. Accelist Lentera Indonesia</footer>
        </div>
    );
}

export default LogUser;
