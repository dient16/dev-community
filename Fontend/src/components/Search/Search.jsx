import React, { useEffect, useRef, useState } from 'react';
import './Search.scss';
import icons from '~/utils/icons';
import { Popover } from 'antd';
import SearchResult from './SearchResult';
import { useDebounce } from '~/hooks';
import { ClipLoader } from 'react-spinners';
import { apiSearchPost } from '~/apiServices';

const Search = () => {
    const { BiSearch, IoIosCloseCircle } = icons;
    const [isInputFocused, setIsInputFocused] = useState(false);
    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    const handleInputFocus = () => {
        setIsInputFocused(true);
    };

    const handleInputBlur = async () => {
        await delay(100);
        setIsInputFocused(false);
    };

    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const debouncedValue = useDebounce(searchValue, 500);
    const inputRef = useRef();

    useEffect(() => {
        if (!debouncedValue.trim()) {
            setSearchResult([]);
            return;
        }

        const fetchApi = async () => {
            setLoading(true);
            try {
                const result = await apiSearchPost(debouncedValue);
                setSearchResult(result?.data || []);
            } catch (error) {
                console.error('Error fetching search results:', error);
                setSearchResult([]);
            } finally {
                setLoading(false);
            }
        };

        fetchApi();
    }, [debouncedValue]);

    const handleClear = () => {
        setSearchValue('');
        setSearchResult([]);
        inputRef.current.focus();
    };

    const handleChange = (e) => {
        const searchValue = e.target.value;
        if (!searchValue.startsWith(' ')) {
            setSearchValue(searchValue);
        }
    };
    return (
        <Popover
            content={<SearchResult resultList={searchResult} />}
            open={isInputFocused && searchResult.length > 0}
            arrow={false}
            trigger="focus"
            mouseLeaveDelay={10000}
        >
            <div className="search-header">
                <input
                    className="search-header__input"
                    type="text"
                    placeholder="Search post"
                    ref={inputRef}
                    value={searchValue}
                    spellCheck={false}
                    onChange={handleChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                />
                {loading && (
                    <i className="search-header__loading">
                        <ClipLoader cssOverride={{ width: '15px', height: '15px' }} />
                    </i>
                )}
                {!!searchValue && !loading && (
                    <i className="search-header__clear" onClick={handleClear}>
                        <IoIosCloseCircle />
                    </i>
                )}
                <button
                    className="search-header__btn"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleInputFocus}
                >
                    <BiSearch size={20} />
                </button>
            </div>
        </Popover>
    );
};

export default Search;
