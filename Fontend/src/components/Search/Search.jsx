import React, { useState } from 'react';
import './Search.scss';
import icons from '~/utils/icons';
import { Popover } from 'antd';
import SearchResult from './SearchResult';

const Search = () => {
    const { BiSearch, PiCircleNotchBold, IoIosCloseCircle } = icons;
    const [isInputFocused, setIsInputFocused] = useState(false);
    const isLoading = false;

    const handleInputFocus = () => {
        setIsInputFocused(true);
    };

    const handleInputBlur = () => {
        setIsInputFocused(false);
    };

    return (
        <Popover content={<SearchResult />} open={isInputFocused} arrow={false}>
            <div className="search-header">
                <input
                    className="search-header__input"
                    type="text"
                    placeholder="Search post"
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                />
                <span className="search-header__loading">
                    <IoIosCloseCircle />
                </span>
                {isLoading && (
                    <span className="search-header__clear">
                        <PiCircleNotchBold />
                    </span>
                )}
                <button className="search-header__btn">
                    <BiSearch size={20} />
                </button>
            </div>
        </Popover>
    );
};

export default Search;
