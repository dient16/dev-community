import { useState, useEffect, useContext } from 'react';
import { MenuAccount, Notification, Search } from '~/components';
import './Header.scss';
import { Avatar, Popover, Badge } from 'antd';
import Button from '../Buttons/Button';
import { path } from '~/utils/constant';
import logo from '~/assets/logo.png';
import icons from '~/utils/icons';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '~/hooks';
import { SocketContext } from '~/contexts/socketContext';
const { HiPlus, FaRegBell, FaBell } = icons;

const Header = () => {
    const navigate = useNavigate();
    const socket = useContext(SocketContext);
    const [isShowNotify, setIsShowNotify] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const { isLoggedIn, user: currentUser } = useAuth();
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
    console.log(unreadNotifications);
    return (
        <div className="header">
            <div className="header__inner">
                <div className="header__left">
                    <div
                        className="header__logo"
                        onClick={() => {
                            navigate(`${path.HOME}`);
                        }}
                    >
                        <img src={logo} alt="" />
                    </div>
                </div>
                <div className="header__search">
                    <Search />
                </div>
                {isLoggedIn ? (
                    <div className="header__right">
                        <Button leftIcon={<HiPlus size={21} />} outline small to={`/${path.NEW_POST}`}>
                            Post
                        </Button>
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
