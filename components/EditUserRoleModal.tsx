import React, { useEffect, useState } from 'react';
import { Modal, Select } from 'antd';
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
    record: RecordProps;
}

interface RecordProps {
    id: string;
    fullName: string;
    role: string;
}

interface SuccessModalProps {
    onGoToHome: () => void;
}

interface UpdateUserRoleResponse {
    response: string;
}

interface SelectOptions<T> {
    label: string;
    value: T;
    disabled?: boolean;
}

interface DataItem {
    roleName: string;
}
const SuccessUpdateModal: React.FC<SuccessModalProps> = ({ onGoToHome }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-10 bg-secondary-100 backdrop-filter backdrop-blur-md" onClick={onGoToHome}>
            <div className="flex flex-col p-6 sm:p-12 border items-center justify-center">
                <FontAwesomeIcon icon={faCircleCheck} style={{ color: "#3788FD", fontSize: "64px", marginBottom: "8px" }} />
                <div className="w-full h-4 sm:h-8" />
                <h3 className="text-xl sm:text-2xl text-accent-100 font-body font-bold mt-4 sm:mt-6 mb-4 sm:mb-8">Successfully Updated User Role!</h3>
            </div>
        </div>
    );
};

const EditUserRoleModal: React.FC<EditUserRoleModalProps> = ({ visible, onCancel, record }) => {
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const { fetchPUT } = useFetchWithAccessToken();
    const swrFetcher = useSwrFetcherWithAccessToken();
    const [roleOptions, setRoleOptions] = useState<SelectOptions<string>[]>([]);
    const [selectedRole, setSelectedRole] = useState<string>(record?.role || '');


    const {data,  mutate: mutateRoleList } = useSWR<DataItem[]>(BackendApiUrl.getRoleList, swrFetcher);
    
    useEffect(() => {
        const dataSource = () => {
            if (!data) {
                return [];
            }
            const options = data.map((item) => ({
                label: item.roleName,
                value: item.roleName,
                disabled: item.roleName === record?.role
            }));
            return options;
        };
        setRoleOptions(dataSource());
        setSelectedRole(record?.role);
    }, [data, record]);
    
    const onFinish = async () => {
        if(record?.role === selectedRole) {
            return;
        }
        const payload = {
            id: record.id,
            role: selectedRole
        };
        const { data } = await fetchPUT<UpdateUserRoleResponse>(BackendApiUrl.editUserRole, payload);
        if (data) {
            setSuccessModalVisible(true);
            onCancel();
            window.location.reload();
        }
    };

    const handleSuccessModalClose = () => {
        setSuccessModalVisible(false);
        onCancel();
         mutateRoleList(); 
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
            <button key="submit" type="submit" onClick={onFinish} className={`bg-[#3788FD] text-white px-4 py-2 mr-4 rounded mb-2 
            ${
                (record?.role === selectedRole)
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
            }`}
            >
                Update
            </button>,
            ]}
        >
            <h3 className='text-xl sm:text-2xl text-center font-body font-bold mt-6'>{`Change Role of "${record?.fullName}"`}</h3>
            <div className='p-5'>
                <h4 className='text-xl sm:text-2xl font-body font-bold mt-4 sm:mt-6 mb-4 sm:mb-8'>
                    Current Role: <u className='text-[#3788FD]'>{record?.role}</u>
                </h4>
                <h4 className='text-xl sm:text-2xl font-body font-bold mb-2 sm:mb-3'>Please Select a New Role </h4>
                <Select
                    options={roleOptions}
                    className='text-slate-500 w-full'
                    value={selectedRole}
                    onChange={(value) => setSelectedRole(value)}
                >
                    {roleOptions.map((item) => (
                        <Select.Option key={item.value} value={item.value} disabled={item.disabled}>
                            {item.label}
                        </Select.Option>
                    ))}
                </Select>
            </div>
        </Modal>
        {successModalVisible &&
            (<SuccessUpdateModal onGoToHome={handleSuccessModalClose} />
        )}
        </>

    );
};

export default EditUserRoleModal;