import React from 'react';
import { Modal, Button } from 'antd';

const CustomDeleteTemplateModal = ({ visible, name, id, onCancel, onConfirm }) => {
    return (
        <Modal
            visible={visible}
            title="Konfirmasi"
            centered
            onCancel={onCancel}
            footer={[
                <Button key="delete" type="primary" danger onClick={() => onConfirm(name, id)}>
                    Hapus
                </Button>,
            ]}
        >
            <p>Apakah Anda yakin ingin menghapus <b>{name}</b> ?</p>
        </Modal>
    );
};

export default CustomDeleteTemplateModal;
