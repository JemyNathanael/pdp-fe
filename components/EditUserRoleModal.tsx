import React, { useEffect, useState } from 'react';
import { Modal, Form, Select } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';
import { BackendApiUrl, GetUser } from '@/functions/BackendApiUrl';
import { mutate } from 'swr';
import useSWR from 'swr';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';

interface EditUserRoleModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (editedData: any, record: any) => void;
  record: any;
}
interface SuccessModalProps {
  onGoToHome: () => void;
}

interface UpdateUserRoleResponse {
    response : string;
}

interface SelectOptions<T> {
    label : string;
    value : T;
}

interface DataItem {
    roleName : string;
}
const SuccessUpdateModal: React.FC<SuccessModalProps> = ({ onGoToHome }) => {
  return (
      <div className="fixed inset-0 flex items-center justify-center bg-opacity-10 bg-secondary-100 backdrop-filter backdrop-blur-md" onClick={onGoToHome}>
          <div className="flex flex-col p-6 sm:p-12 border items-center justify-center">
              <FontAwesomeIcon icon={faCircleCheck} style={{ color: "#4f7471", fontSize: "64px", marginBottom: "8px" }} />
              <div className="w-full h-4 sm:h-8" />
              <h3 className="text-xl sm:text-2xl text-accent-100 font-body font-bold mt-4 sm:mt-6 mb-4 sm:mb-8">Successfully Updated User Role</h3>
          </div>
      </div>
  );
};

const EditUserRoleModal: React.FC<EditUserRoleModalProps> = ({ visible, onCancel, record }) => {
    const [form] = Form.useForm();
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const {fetchPUT} = useFetchWithAccessToken();
    const swrFetcher = useSwrFetcherWithAccessToken();
    const [roleOptions, setRoleOptions] = useState<SelectOptions<string>[]>([]);

    const {data} = useSWR<DataItem[]>(BackendApiUrl.getRoleList, swrFetcher);

    useEffect(() => {
        const dataSource = () => {
            if (!data) {
                return [];
            }
            const options = data.map((item) => ({
                label: item.roleName,
                value: item.roleName,
            }));
            return options;
        };
        setRoleOptions(dataSource());
    }, [data]);
  
    const onFinish = async (formData : UpdateUserRoleResponse) => {
    const payload = {
        ...formData,
        id : record.id
    };
    const {data} = await fetchPUT<UpdateUserRoleResponse>(BackendApiUrl.editUserRole, payload);
        if(data) {
            console.log("Success updating user role");
            setSuccessModalVisible(true);
            onCancel();
        }
    };

    const handleSuccessModalClose = () => {
        setSuccessModalVisible(false);
        onCancel();
        mutate(GetUser(""));
    };

  

    return (
        <>
        <Modal
            title={`Change Role of "${record?.fullName}"`}
            visible={visible}
            onCancel={onCancel}
            centered
            footer={[
            <button key="submit" type="submit" onClick={() => form.submit()} className="ant-btn ant-btn-primary">
                Update
            </button>,
            ]}
        >
            
            <p>
            Current Role: <u><i>{record?.role}</i></u>
            </p>
            <p>Please Select a New Role: </p>
            <Form form={form} onFinish={onFinish} layout="vertical" initialValues={record}>
            <Form.Item label="" name="role">
                <Select options={roleOptions}>
                </Select>
            </Form.Item>
            </Form>
        </Modal>
        {successModalVisible && 
            (<SuccessUpdateModal onGoToHome={handleSuccessModalClose} />
            )}
        </>
        
    );
};

export default EditUserRoleModal;
