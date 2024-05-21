import React from 'react';
import { Modal, Button } from 'antd';

const CustomDeleteModal = ({ visible, email, id, name, onCancel, onConfirm }) => {
    return (
        <Modal
            visible={visible}
            title="Konfirmasi"
            centered
            onCancel={onCancel}
            footer={[
                <Button key="delete" type="primary" danger onClick={() => onConfirm(email, id)}>
                    Hapus
                </Button>,
            ]}
        >
            <p>Apakah Anda yakin ingin menghapus <b>{email}</b> Group User <b>{name}</b>?</p>
        </Modal>
    );
};

export default CustomDeleteModal;
