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
        mutate(GetUser('', 10, 1 ));
    };

  

    return (
        <>
        <Modal
            open={visible}
            onCancel={onCancel}
            centered
            width={750}
            className=''
            footer={[
            <button key="submit" type="submit" onClick={() => form.submit()} className="bg-[#4F7471] text-white px-4 py-2 rounded mb-2">
                Update
            </button>,
            ]}
        >
            <h3 className='text-xl sm:text-2xl text-center font-body font-bold mt-6'>{`Change Role of "${record?.fullName}"`}</h3>
            <div className='p-5'>
                <h4 className='text-xl sm:text-2xl font-body font-bold mt-4 sm:mt-6 mb-4 sm:mb-8'>
                    Current Role: <u className='text-[#4F7471]'>{record?.role}</u>
                </h4>
                <h4 className='text-xl sm:text-2xl font-body font-bold mb-2 sm:mb-3'>Please Select a New Role: </h4>
                <Form form={form} onFinish={onFinish} layout="vertical" initialValues={record}>
                    <Form.Item label="" name="role">
                        <Select
                            options={roleOptions}
                            className='text-slate-500'>
                        </Select>
                    </Form.Item>
                </Form>
            </div>
        </Modal>
        {successModalVisible && 
            (<SuccessUpdateModal onGoToHome={handleSuccessModalClose} />
            )}
        </>
        
    );
};

export default EditUserRoleModal;
