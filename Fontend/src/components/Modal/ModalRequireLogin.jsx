import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { path } from '~/utils/constant';

const ModalRequireLogin = ({ open, setOpen }) => {
    const navigate = useNavigate();
    return (
        <Modal
            title="Login"
            className="modal-require-login"
            centered
            open={open}
            onOk={() => setOpen(false)}
            onCancel={() => setOpen(false)}
            footer={[
                <Button key="cancel" onClick={() => setOpen(false)}>
                    Cancel
                </Button>,
                <Button
                    key="login"
                    type="primary"
                    onClick={() => {
                        navigate(`/${path.LOGIN}`);
                        setOpen(false);
                    }}
                >
                    Login
                </Button>,
            ]}
        >
            <p>Please login</p>
        </Modal>
    );
};

export default ModalRequireLogin;
