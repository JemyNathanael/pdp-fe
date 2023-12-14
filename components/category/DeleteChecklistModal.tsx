import { BackendApiUrl, GetChecklistList } from '@/functions/BackendApiUrl';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from "antd";
import { useRouter } from 'next/router';
import { useState } from 'react';
import { mutate } from 'swr';

interface DeleteChecklistModalProps {
    onCancel: () => void;
    verseId: string;
    checkId: string;
    categoryId: string;
}

interface SuccessModalProps {
    onGoToHome: () => void;
}

const DeleteChecklistModl: React.FC<DeleteChecklistModalProps> = ({ onCancel, checkId, verseId, categoryId }) => {
    const { fetchDELETE } = useFetchWithAccessToken();
    const [openModal, setOpenModal] = useState(true);
    const [openSuccessModal, setOpenSuccessModal] = useState(false);
    const router = useRouter();

    const SuccessDeleteModal: React.FC<SuccessModalProps> = ({ onGoToHome }) => {
        return (
            <div className="fixed inset-0 flex items-center z-10 justify-center backdrop-filter backdrop-blur-md" onClick={onGoToHome}>
                <div className="flex flex-col p-6 sm:p-12 border items-center justify-center bg-white">
                    <FontAwesomeIcon icon={faCircleCheck} style={{ color: "#3788FD", fontSize: "64px", marginBottom: "8px" }} />
                    <div className="w-full h-4 sm:h-8" />
                    <h3 className="text-xl sm:text-2xl text-accent-100 font-body font-bold mt-4 sm:mt-6 mb-4 sm:mb-8">Successfully Deleted Checklist!</h3>
                </div>
            </div>
        );
    };

    const handleSuccessModalClose = () => {
        setOpenSuccessModal(false);
        mutate(GetChecklistList(verseId));
        router.push(`/${categoryId}`);
        onCancel();
    };

    const handleDelete = async () => {
        const { data } = await fetchDELETE(BackendApiUrl.deleteChecklist + `/${checkId}`);

        if (data) {
            setOpenModal(false);
            setOpenSuccessModal(true);
        }
    }

    return (
        <>
            {
                openSuccessModal &&
                <SuccessDeleteModal onGoToHome={handleSuccessModalClose} />
            }
            <Modal
                title={
                    <div className="flex flex-col items-center">
                        <svg width="124" height="124" viewBox="0 0 124 124" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.0194 105.982C13.1455 100.309 8.46028 93.5229 5.23713 86.0197C2.01398 78.5164 0.317422 70.4464 0.246463 62.2805C0.175503 54.1146 1.73156 46.0163 4.82383 38.4581C7.91611 30.9 12.4827 24.0334 18.2571 18.259C24.0315 12.4846 30.8981 7.91806 38.4562 4.82579C46.0143 1.73351 54.1126 0.177456 62.2785 0.248416C70.4445 0.319376 78.5145 2.01593 86.0177 5.23908C93.521 8.46224 100.307 13.1474 105.98 19.0213C117.183 30.6204 123.382 46.1554 123.242 62.2805C123.102 78.4056 116.634 93.8306 105.231 105.233C93.8286 116.636 78.4036 123.104 62.2785 123.244C46.1534 123.384 30.6184 117.185 19.0194 105.982ZM56.3499 31.7518V68.6518H68.6499V31.7518H56.3499ZM56.3499 80.9518V93.2518H68.6499V80.9518H56.3499Z" fill="#FF0000" />
                        </svg>
                        <p className="mt-3 text-xl font-semibold">Are you sure?</p>
                    </div>
                }
                open={openModal}
                centered
                onCancel={() => setOpenModal(false)}
                closable={false}
                footer={[
                    <div key={3} className="flex justify-center space-x-4">
                        <button
                            key={2}
                            onClick={() => setOpenModal(false)}
                            className="text-black box-border rounded border border-gray-500 py-1 px-10 text-center"
                        >
                            Back
                        </button>
                        <button
                            key={1}
                            onClick={handleDelete}
                            className="bg-[#FF0000] text-white font-semibold border-transparent rounded py-1 px-10 text-center"
                        >
                            Delete
                        </button>
                    </div>
                ]}
            >
                <div className="text-center">
                    <p className="mb-12 mt-3">
                        Do you really want to delete this checklist? This process <span className="text-[#FF0000]">cannot be undone</span>
                    </p>
                </div>
            </Modal>
        </>
    );
}

export default DeleteChecklistModl;