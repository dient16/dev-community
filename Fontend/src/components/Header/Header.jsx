import React, { useState, useEffect } from 'react';
import HeadlessTippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';
import { MenuAccount, Notification, Search } from '~/components';
import './Header.scss';
import { Avatar, Popover } from 'antd';
import Button from '../Buttons/Button';
import path from '~/utils/path';
import logo from '~/assets/logo.png';
import icons from '~/utils/icons';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { getFromLocalStorage } from '~/utils/helper';
const { HiPlus, FaRegBell, FaBell } = icons;

const Header = () => {
    const navigate = useNavigate();
    const [isShowNotify, setIsShowNotify] = useState(false);
    const { isLoggedIn, currentUser } = getFromLocalStorage('dev-community');

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
                            <HeadlessTippy
                                interactive
                                visible={isShowNotify}
                                render={(attrs) => (
                                    <div className={clsx('notify-wrapper')} tabIndex="-1" {...attrs}>
                                        <span onClick={(e) => e.stopPropagation()}>
                                            <Notification />
                                        </span>
                                    </div>
                                )}
                            >
                                <span
                                    className="header__notify-icon"
                                    count-notification="3"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsShowNotify((prev) => !prev);
                                    }}
                                >
                                    {isShowNotify ? <FaBell size={25} /> : <FaRegBell size={25} />}
                                </span>
                            </HeadlessTippy>
                        </div>

                        <div className="header__avatar">
                            <Popover content={<MenuAccount user={currentUser} />} trigger="click">
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
