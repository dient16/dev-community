import { useState, useEffect, useContext } from 'react';
import { MenuAccount, Notification, Search, SideBar } from '~/components';
import './Header.scss';
import { Avatar, Popover, Badge, Flex, Drawer, Button as BtnAnt, Tooltip, Image } from 'antd';
import Button from '../Buttons/Button';
import { path } from '~/utils/constant';
import logo from '~/assets/logo.png';
import icons from '~/utils/icons';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '~/hooks';
import { SocketContext } from '~/contexts/socketContext';
const { HiPlus, FaRegBell, FaBell, MdMenu, SlClose } = icons;
import { SearchOutlined } from '@ant-design/icons';

const Header = () => {
    const navigate = useNavigate();
    const socket = useContext(SocketContext);
    const [isShowNotify, setIsShowNotify] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const { isLoggedIn, user: currentUser } = useAuth();
    const [openSidebar, setOpenSideBar] = useState(false);
    const [unreadNotifications, setUnreadNotifications] = useState([]);
    useEffect(() => {
        document.addEventListener('click', () => {
            setIsShowNotify(false);
        });
        return () => {
            document.removeEventListener('click', () => {
                setIsShowNotify(false);
            });
        };
    }, []);
    useEffect(() => {
        if (currentUser && socket) {
            socket.on('notification', (data) => {
                setUnreadNotifications((prevState) => [...prevState, data]);
            });
        }
    }, [currentUser, socket]);
    const handleOpenChange = (newOpen) => {
        setOpenMenu(newOpen);
    };
    return (
        <div className="header">
            <div className="header__inner">
                <div className="header__left">
                    <Flex align="center" gap={15}>
                        <i className="header__menu" onClick={() => setOpenSideBar(true)}>
                            <MdMenu size={28} />
                        </i>
                        <Drawer
                            title={
                                <Flex justify="end">
                                    <i onClick={() => setOpenSideBar(false)} style={{ cursor: 'pointer' }}>
                                        <SlClose size={25} />
                                    </i>
                                </Flex>
                            }
                            placement="left"
                            closeIcon={null}
                            open={openSidebar}
                            onClose={() => setOpenSideBar(false)}
                            width={290}
                        >
                            <SideBar setOpenSideBar={setOpenSideBar} />
                        </Drawer>

                        <div
                            className="header__logo"
                            onClick={() => {
                                navigate(`${path.HOME}`);
                            }}
                        >
                            <Image src={logo} preview={false} width={80} />
                        </div>
                    </Flex>
                </div>
                <div className="header__search">
                    <Search />
                </div>
                {isLoggedIn ? (
                    <div className="header__right">
                        <Button
                            className="btn-post"
                            leftIcon={<HiPlus size={21} />}
                            outline
                            small
                            to={`/${path.NEW_POST}`}
                        >
                            Post
                        </Button>
                        <Tooltip title="search">
                            <BtnAnt
                                className="btn-search"
                                size="large"
                                type="primary"
                                shape="circle"
                                icon={<SearchOutlined />}
                            />
                        </Tooltip>
                        <div className="header__notification">
                            <Popover
                                arrow
                                fresh
                                open={isShowNotify}
                                placement="bottom"
                                content={() => (
                                    <div className={clsx('notify-wrapper')} tabIndex="-1">
                                        <span onClick={(e) => e.stopPropagation()}>
                                            <Notification data={unreadNotifications} />
                                        </span>
                                    </div>
                                )}
                            >
                                <Badge count={unreadNotifications?.length || 0} color="#6497b1">
                                    <span
                                        className="header__notify-icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsShowNotify((prev) => !prev);
                                        }}
                                    >
                                        {isShowNotify ? <FaBell size={25} /> : <FaRegBell size={25} />}
                                    </span>
                                </Badge>
                            </Popover>
                        </div>

                        <div className="header__avatar">
                            <Popover
                                onOpenChange={handleOpenChange}
                                open={openMenu}
                                content={<MenuAccount user={currentUser} setOpenMenu={setOpenMenu} />}
                                trigger="click"
                            >
                                <Avatar size={40} src={currentUser?.avatar} alt="" />
                            </Popover>
                        </div>
                    </div>
                ) : (
                    <div className="header__actions">
                        <Button primary to={`/${path.REGISTER}`}>
                            Đăng kí
                        </Button>
                        <Button outline to={`/${path.LOGIN}`}>
                            Đăng nhập
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;
