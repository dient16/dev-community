import { useEffect } from 'react';
import './MyTags.scss';
import icons from '~/utils/icons';
import { useQuery } from '@tanstack/react-query';
import { apiGetMyTags, apiGetPopularTags } from '~/apiServices';
import { TagChildren, Loading } from '~/components';
import { Spin } from 'antd';
import { useAuth } from '~/hooks';

const { RiSettingsLine } = icons;

const MyTags = () => {
    const { isLoggedIn } = useAuth();

    const { data: myTagsData, isLoading: isLoadingMyTags } = useQuery({
        queryKey: ['myTags'],
        queryFn: apiGetMyTags,
        enabled: isLoggedIn,
    });

    const { data: popularTagsData, isLoading: isLoadingPopularTags } = useQuery({
        queryKey: ['popularTags'],
        queryFn: apiGetPopularTags,
        enabled: !isLoggedIn,
    });

    return (
        <Spin
            indicator={<Loading />}
            spinning={isLoggedIn ? isLoadingMyTags : isLoadingPopularTags}
            className="loading"
        >
            <div className="my-tags">
                <div className="my-tags__header">
                    <span className="title">{isLoggedIn ? 'My tags' : 'Popular Tags'}</span>
                    <span className="icon">
                        <RiSettingsLine size={18} />
                    </span>
                </div>
                <div className="my-tags__container">
                    {isLoggedIn
                        ? myTagsData?.tags?.map((tag) => (
                              <TagChildren key={tag._id} tagName={tag.name} color={tag.theme} />
                          ))
                        : popularTagsData?.tags?.map((tag) => (
                              <TagChildren key={tag._id} tagName={tag.name} color={tag.theme} />
                          ))}
                </div>
            </div>
        </Spin>
    );
};

export default MyTags;
