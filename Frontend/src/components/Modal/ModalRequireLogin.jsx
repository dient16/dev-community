import { Button, Flex, Image, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { path } from '~/utils/constant';
import logo from '~/assets/logo.png';

const ModalRequireLogin = ({ open, setOpen }) => {
    const navigate = useNavigate();
    return (
        <Modal centered open={open} onOk={() => setOpen(false)} onCancel={() => setOpen(false)} footer={null}>
            <Flex vertical gap={20}>
                <Image
                    src={logo}
                    preview={false}
                    width={180}
                    style={{
                        transform: 'rotate(-10deg)',
                        border: '3px solid #ccc',
                        borderRadius: '10px',
                        padding: '10px',
                    }}
                />
                <h1 style={{ textAlign: 'center' }}>Please log in</h1>
                <Flex vertical gap={10}>
                    <Button
                        key="login"
                        type="primary"
                        size="large"
                        onClick={() => {
                            navigate(`/${path.LOGIN}`);
                            setOpen(false);
                        }}
                    >
                        Login
                    </Button>
                    <Button key="cancel" onClick={() => setOpen(false)} size="large">
                        Cancel
                    </Button>
                </Flex>
            </Flex>
        </Modal>
    );
};

export default ModalRequireLogin;
