import AddNewUserModal from "@/components/AddNewUserModal";
import EditUserRoleModal from "@/components/EditUserRoleModal";
import SearchInput from "@/components/SearchInput";
import { BackendApiUrl, GetUser } from "@/functions/BackendApiUrl";
import { useFetchWithAccessToken } from "@/functions/useFetchWithAccessToken";
import { useSwrFetcherWithAccessToken } from "@/functions/useSwrFetcherWithAccessToken";
import { Modal, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import useSWR, { mutate } from 'swr';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

interface DataItem {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

interface DataItems {
  datas: DataItem[]
  totalData: number
}

interface DataRow extends DataItem {
  rowNumber: number;
  id: string;
  key: React.Key;
}

interface FilterData {
  itemsPerPage: number,
  page: number,
  search: string
}


interface DeleteUserModel {
  id: string;
}


interface RecordProps {
  id: string;
  fullName: string;
  role: string;
}

interface PopupDeleteProps {
  onGoToHome: () => void;
}

const PopupDelete: React.FC<PopupDeleteProps> = ({ onGoToHome }) => {
  return (
      <div className="fixed inset-0 flex items-center justify-center bg-opacity-10 bg-secondary-100 backdrop-filter backdrop-blur-md" onClick={onGoToHome}>
          <div className="flex flex-col p-6 sm:p-12 border items-center justify-center">
              <FontAwesomeIcon icon={faCircleCheck} style={{ color: "#4f7471", fontSize: "64px", marginBottom: "8px" }} />
              <div className="w-full h-4 sm:h-8" />
              <h3 className="text-xl sm:text-2xl text-accent-100 font-body font-bold mt-4 sm:mt-6 mb-4 sm:mb-8">Deletion was successful</h3>
          </div>
      </div>
  );
};

const OverviewUser: React.FC = () => {
  const { replace } = useRouter();
  const [search, setSearch] = useState('');
  const { fetchDELETE } = useFetchWithAccessToken();
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<DeleteUserModel>();
  const [isDeleteSuccess, setIsDeleteSuccess] = useState<boolean>(false);
  const [page, setPages] = useState<number>(1);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<RecordProps>({ id: '', fullName: '', role: '' });
  const [debouncedValue] = useDebounce(search, 1000);

  const filter: FilterData = {
    itemsPerPage: 10,
    page: page,
    search: search
  };

  function handleDelete(id: string) {
    setUserToDelete({
      id: id
    })
    setDeleteModal(true)
  }

  const columns: ColumnsType<DataRow> = [
    {
      title: "User",
      dataIndex: "fullName",
      key: "fullName",
      width: 300
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
      width: 200,
      render: (record, row) => (
        <span className="flex mt-3 md:mt-0">
          {(record.role !== "Admin") ?
            <button
              onClick={() => handleDelete(row.id)}
              className="bg-[#CC0404] text-white px-4 py-2 rounded mr-4 "
            >
              Delete
            </button> : <div className="mx-7 px-4 py-2"></div>
          }

          <button
            onClick={() => handleEdit(record)}
            className="bg-[#4F7471] text-white px-6 py-2 rounded "
          >
            Edit
          </button>
        </span>
      ),
    },
  ];


  const swrFetcher = useSwrFetcherWithAccessToken();

  const onSearchHandler = (event) => {
    setSearch(event.target.value);
  }

  const { data, isValidating } = useSWR<DataItems>(
    GetUser(
      debouncedValue,
      filter.itemsPerPage,
      filter.page,
    ),
    swrFetcher
  );

  function dataSource(): DataRow[] {
    if (!data?.datas) {
      return [];
    }

    return data.datas.map((item, index) => {
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
    const searchList = new RegExp(debouncedValue, 'i')
    return searchList.test(overview.email)
  });

  async function deleteData() {
    const response = await fetchDELETE<string>(`${BackendApiUrl.deleteUser}/${userToDelete?.id}`);

    if (response.data) {
      setDeleteModal(false);
      setIsDeleteSuccess(true);
      mutate(GetUser(
        filter.search,
        filter.itemsPerPage,
        filter.page,
      ));
    }
    else {
      setDeleteModal(false);
    }
  }

  function goBackPage() {
    setDeleteModal(false)
    setIsDeleteSuccess(false);
  }

  const handleAdd = () => {
    setIsAddModalVisible(true);
  };

  const handleEdit = (record) => {
    setSelectedRecord(record || { id: '', fullName: '', role: '' });
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsAddModalVisible(false);
    setIsModalVisible(false);
  };
  const handleSave = () => {
    handleCancel();
  }

  const renderPopupSuccess = () => {
    if (isDeleteSuccess) {
        return <PopupDelete onGoToHome={() => {
            setIsDeleteSuccess(false)
            replace({
                pathname: '/ManageUser'
            })
        }} />
    }
    return null;
}

  return (
    <div id="overview">
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
            Do you really want to delete this user? This process <span className="text-[#FF0000]">cannot be undone</span>
          </p>
        </div>
      </Modal>

      <div className="grid grid-cols-2 gap-4">
        <SearchInput onSearch={onSearchHandler} placeholder={"Search by email"} />
        <div className="col-span-1 text-end">
          <button
            onClick={handleAdd}
            className="bg-greyeen text-white px-5 py-2 rounded mr-7">
            Add
          </button>
        </div>
      </div>
      <Table
        dataSource={filteredData}
        columns={columns}
        loading={isValidating}
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

        id="overviewTable" />
      <EditUserRoleModal
        visible={isModalVisible}
        onCancel={handleCancel}
        record={selectedRecord}
      />
      <AddNewUserModal
        visible={isAddModalVisible}
        onCancel={handleCancel}
        onSave={handleSave}
      />
      
    {renderPopupSuccess()}
      <footer className="font-semibold text-[#4F7471] text-center mt-5 md:mt-36">Copyright @ PT. Accelist Lentera Indonesia</footer>
    </div>
  );
}

export default OverviewUser;