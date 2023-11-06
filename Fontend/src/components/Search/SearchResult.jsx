import React from 'react';
import './Search.scss';
import { Flex } from 'antd';
import ResultItem from './ResultItem';

const SearchResult = ({ resultList }) => {
    return (
        <div className="search-result">
            <div className="search-result__container">
                <Flex vertical>
                    {resultList &&
                        resultList.length > 0 &&
                        resultList.map((result) => (
                            <ResultItem
                                key={result._id}
                                postId={result._id}
                                avatar={result?.author.avatar}
                                createdAt={result?.createdAt}
                                authorName={`${result?.author.firstname} ${result?.author.lastname}`}
                                username={result?.author.username}
                                contentPost={result?.title}
                            />
                        ))}
                </Flex>
            </div>
        </div>
    );
};

export default SearchResult;
