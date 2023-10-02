import React from 'react';
import { Search } from '~/components';
import './Header.scss';
import Button from '../Buttons/Button';
import path from '~/utils/path';
import logo from '~/assets/logo.png';
import { useNavigate } from 'react-router-dom';
const Header = () => {
    const navigate = useNavigate();
    return (
        <div className="header">
            <div className="header__inner">
                <div
                    className="header__logo"
                    onClick={() => {
                        navigate(`${path.HOME}`);
                    }}
                >
                    <img src={logo} alt="" />
                </div>
                <div className="header__search">
                    <Search />
                </div>
                <div className="header__actions">
                    <Button primary to={`/${path.REGISTER}`}>
                        Đăng kí
                    </Button>
                    <Button outline to={`/${path.LOGIN}`}>
                        Đăng nhập
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Header;
