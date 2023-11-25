import './Search.scss';
import { Empty, Flex } from 'antd';
import ResultItem from './ResultItem';

const SearchResult = ({ resultList, setIsOpenResult }) => {
    return (
        <div className="search-result" onClick={(e) => e.stopPropagation()}>
            <div className="search-result__container">
                <Flex vertical>
                    {resultList?.length > 0 ? (
                        resultList.map((result) => (
                            <ResultItem
                                key={result._id}
                                postId={result._id}
                                avatar={result?.author.avatar}
                                createdAt={result?.createdAt}
                                authorName={`${result?.author.firstname} ${result?.author.lastname}`}
                                username={result?.author.username}
                                contentPost={result?.title}
                                setIsOpenResult={setIsOpenResult}
                            />
                        ))
                    ) : (
                        <Empty />
                    )}
                </Flex>
            </div>
        </div>
    );
};

export default SearchResult;
