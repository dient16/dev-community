import { useEffect, useRef, useState } from 'react';
import './Search.scss';
import icons from '~/utils/icons';
import { Popover } from 'antd';
import SearchResult from './SearchResult';
import { useDebounce } from '~/hooks';
import { ClipLoader } from 'react-spinners';
import { apiSearchPost } from '~/apiServices';

const Search = () => {
    const { BiSearch, IoIosCloseCircle } = icons;
    const [isOpenResult, setIsOpenResult] = useState(false);
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
    useEffect(() => {
        document.addEventListener('click', () => {
            setIsOpenResult(false);
        });
        return () => {
            document.removeEventListener('click', () => {
                setIsOpenResult(false);
            });
        };
    }, []);
    return (
        <Popover
            content={<SearchResult resultList={searchResult} setIsOpenResult={setIsOpenResult} />}
            open={isOpenResult && !!searchValue}
            arrow={false}
        >
            <div className="search-header" onClick={(e) => e.stopPropagation()}>
                <input
                    className="search-header__input"
                    type="text"
                    placeholder="Search post"
                    ref={inputRef}
                    value={searchValue}
                    spellCheck={false}
                    onChange={handleChange}
                    onFocus={() => setIsOpenResult(true)}
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
                    onClick={() => {
                        setIsOpenResult(true);
                        inputRef.current.focus();
                    }}
                >
                    <BiSearch size={20} />
                </button>
            </div>
        </Popover>
    );
};

export default Search;
