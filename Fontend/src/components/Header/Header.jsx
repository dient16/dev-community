import React from 'react';
import { Search } from '~/components';
import './Header.scss';
import Button from '../Buttons/Button';
import path from '~/utils/path';
const Header = () => {
    return (
        <div className="header">
            <div className="header__inner">
                <div className="header__logo">
                    <img
                        src="https://dev-to-uploads.s3.amazonaws.com/uploads/logos/resized_logo_UQww2soKuUsjaOGNB38o.png"
                        alt=""
                    />
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
