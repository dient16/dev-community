import React from 'react';
import { Search } from '~/components';
import './Header.scss';
import Button from '../Buttons/Button';
import path from '~/utils/path';
import logo from '~/assets/logo.png';
import icons from '~/utils/icons';

const { HiPlus, FaRegBell } = icons;
import { useNavigate } from 'react-router-dom';
const Header = () => {
    const navigate = useNavigate();
    const isLogging = true;
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
                        <Button leftIcon={<HiPlus size={21} />} outline small>
                            Post
                        </Button>
                        <div className="header__notification">
                            <FaRegBell size={25} />
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
