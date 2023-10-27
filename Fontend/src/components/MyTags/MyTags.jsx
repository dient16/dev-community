import React, { useEffect } from 'react';
import './MyTags.scss';
import icons from '~/utils/icons';
import { useQuery } from '@tanstack/react-query'; // Import useQuery
import { apiGetMyTags } from '~/apiServices';
import { TagChildren, Loading } from '~/components';
import { Spin } from 'antd';
import { getFromLocalStorage } from '~/utils/helper';

const { RiSettingsLine } = icons;

const MyTags = () => {
    const {
        data: listMyTags,
        refetch,
        isLoading,
    } = useQuery({
        queryKey: ['myTags'],
        queryFn: apiGetMyTags,
        enabled: false,
    });

    const { isLoggedIn } = getFromLocalStorage('dev-community');
    useEffect(() => {
        if (isLoggedIn) {
            refetch();
        }
    }, [isLoggedIn, refetch]);

    return (
        <Spin indicator={<Loading />} spinning={isLoading} className="loading">
            <div className="my-tags">
                <div className="my-tags__header">
                    <span className="title">My tags</span>
                    <span className="icon">
                        <RiSettingsLine />
                    </span>
                </div>
                <div className="my-tags__container">
                    {listMyTags &&
                        listMyTags?.tags?.followedTags.map((tag) => (
                            <TagChildren key={tag._id} tagName={tag.name} color={tag.theme} />
                        ))}
                </div>
            </div>
        </Spin>
    );
};

export default MyTags;
