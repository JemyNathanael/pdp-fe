import { WithDefaultLayout } from "@/components/DefautLayout";
import SearchInput from "@/components/SearchInput";
import { Page } from "@/types/Page";
import { Table } from "antd";
import { useState } from "react";

const data = [
  {
    user: "john_doe",
    email: "john.doe@example.com",
    role: "admin",
  },
  {
    user: "alice_smith",
    email: "alice.smith@example.com",
    role: "user",
  },
  {
    user: "bob_jones",
    email: "bob.jones@example.com",
    role: "editor",
  },
  {
    user: "susan_wang",
    email: "susan.wang@example.com",
    role: "user",
  },
  {
    user: "michael_brown",
    email: "michael.brown@example.com",
    role: "viewer",
  },
  {
    user: "john_doe2",
    email: "john.doe2@example.com",
    role: "admin",
  }
];


const OverviewUser: Page = () => {

  const fetchData = data.map(data => ({
    ...data
  }))
  const [search, setSearch] = useState('')
  const [overviewData] = useState(fetchData)

  const onSearchHandler = (event) => {
    setSearch(event.target.value);
  }

  const filteredData = overviewData.filter(overview => {
    const searchNote = new RegExp(search, '')
    return searchNote.test(overview.email)
  });

  function handleEdit(): void {
    throw new Error("Function not implemented.");
  }
  function handleDelete(): void {
    throw new Error("Function not implemented.");
  }

  const columns = [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
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
      render: (record) => (
        <span className="flex mt-3 md:mt-0">
          {(record.role !== "admin")?
          <button
            onClick={() => handleDelete()}
            className="bg-[#CC0404] text-white px-4 py-2 rounded mr-4 "
          >
            Delete
          </button> : <div className="mx-7 px-4 py-2"></div>
    }
          
          <button
            onClick={() => handleEdit()}
            className="bg-[#4F7471] text-white px-4 py-2 rounded "
          >
            Edit
          </button>
        </span>
      ),
    },
  ];

  return (
    <div>
      <SearchInput onSearch={onSearchHandler} placeholder={"Search by email"} />
      <Table dataSource={filteredData} columns={columns} pagination={false} className="text-center justify-center" />
      <footer className="font-semibold text-[#4F7471] text-center mt-5 md:mt-36">Copyright @ PT. Accelist Lentera Indonesia</footer>
    </div>
  );
}
OverviewUser.layout = WithDefaultLayout
export default OverviewUser;



