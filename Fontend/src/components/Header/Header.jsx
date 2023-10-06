import React, { useState, useEffect } from 'react';
import HeadlessTippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';
import { Notification, Search } from '~/components';
import './Header.scss';
import Button from '../Buttons/Button';
import path from '~/utils/path';
import logo from '~/assets/logo.png';
import icons from '~/utils/icons';
import clsx from 'clsx';

const { HiPlus, FaRegBell, FaBell } = icons;
import { useNavigate } from 'react-router-dom';
const Header = () => {
    const navigate = useNavigate();
    const [isShowNotify, setIsShowNotify] = useState(false);
    const isLogging = true;
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
                {isLogging ? (
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
                            <img
                                src="https://vietabinhdinh.edu.vn/wp-content/uploads/Anh-Avatar-Dep-Ngau-Chat-Xi-Khoi-Lam-Hinh-Dai.jpg"
                                alt=""
                            />
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
