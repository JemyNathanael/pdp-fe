import AddNewUserModal from "@/components/AddNewUserModal";
import EditUserRoleModal from "@/components/EditUserRoleModal";
import SearchInput from "@/components/SearchInput";
import { GetUser } from "@/functions/BackendApiUrl";
import { useSwrFetcherWithAccessToken } from "@/functions/useSwrFetcherWithAccessToken";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import useSWR from 'swr';

interface DataItem {
  id : string;
  fullName: string;
  email: string;
  role: string;
}

interface DataRow extends DataItem {
  rowNumber: number;
  key: React.Key;
}

// function handleEdit(record): void {
//   throw new Error("Function not implemented.");
// }
// function handleDelete(): void {
//   throw new Error("Function not implemented.");
// }

const OverviewUser: React.FC = () => {
  const [search, setSearch] = useState('');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
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
        id: item.id,
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

  const handleAdd = () => {
    console.log("handleAdd")
    setSelectedRecord(null);
    setIsAddModalVisible(true);
  };

  // function goToCreateUserPage(): void {
  //   throw new Error("Function not implemented.");
  // }
  const handleEdit = (record) => {
    // console.log(record);
    setSelectedRecord(record);
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsAddModalVisible(false);
    setIsModalVisible(false);
  };
  const handleSave = () => {
    console.log("save");
    handleCancel();
  }
  const handleDelete = () => {
    console.log("delete");
  }


  const columns: ColumnsType<DataRow> = [
    {
      title: "User",
      dataIndex: "fullName",
      key: "fullName",
      width:300
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Action",
      key: "action",
      width:200,
      render: (record) => (
        <span className="flex mt-3 md:mt-0">
          {(record.role !== "Admin") ?
            <button
              onClick={() => handleDelete()}
              className="bg-[#CC0404] text-white px-4 py-2 rounded mr-4 "
            >
              Delete
            </button> : <div className="mx-7 px-4 py-2"></div>
          }
  
          <button
            onClick={() => handleEdit(record)}
            className="bg-[#4F7471] text-white px-4 py-2 rounded "
          >
            Edit
          </button>
        </span>
      ),
    },
  ];
  return (
    <div id="overview">
      <div className="grid grid-cols-2 gap-4">
        <SearchInput onSearch={onSearchHandler} placeholder={"Search by email"} />
        <div className="col-span-1 text-end">
          <button
            onClick={handleAdd} 
            className="bg-greyeen text-white px-4 py-2 rounded mr-10">
            Add
          </button>
        </div>
      </div>
      <Table dataSource={filteredData} columns={columns} loading={isValidating} pagination={false} scroll={{ y: "max-content" }}/>      
      <EditUserRoleModal 
        visible={isModalVisible} 
        onCancel={handleCancel} 
        onSave={() => {handleSave} }
        record={selectedRecord} 
      />
      <AddNewUserModal
       visible={isAddModalVisible} 
       onCancel={handleCancel} 
       onSave={handleSave}
       record={selectedRecord} 
      />
      <footer className="font-semibold text-[#4F7471] text-center mt-5 md:mt-36">Copyright @ PT. Accelist Lentera Indonesia</footer>
    </div>
  );
}

export default OverviewUser;