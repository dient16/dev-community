import './MyTags.scss';
import icons from '~/utils/icons';
import { useQuery } from '@tanstack/react-query';
import { apiGetMyTags, apiGetPopularTags } from '~/apiServices';
import { TagChildren } from '~/components';
import { Spin } from 'antd';
import { useAuth } from '~/hooks';

const { RiSettingsLine } = icons;

const MyTags = () => {
    const { isLoggedIn } = useAuth();

    const { data: myTagsData, isLoading: isLoadingMyTags } = useQuery({
        queryKey: ['myTags'],
        queryFn: apiGetMyTags,
        enabled: isLoggedIn,
        staleTime: Infinity,
    });

    const { data: popularTagsData, isLoading: isLoadingPopularTags } = useQuery({
        queryKey: ['popularTags'],
        queryFn: apiGetPopularTags,
        enabled: !isLoggedIn,
    });

    return (
        <Spin spinning={isLoggedIn ? isLoadingMyTags : isLoadingPopularTags} className="loading">
            <div className="my-tags">
                <div className="my-tags__header">
                    <span className="title">
                        {isLoggedIn && myTagsData?.tags.length > 0 ? 'My tags' : 'Popular Tags'}
                    </span>
                    <span className="icon">
                        <RiSettingsLine size={18} />
                    </span>
                </div>
                <div className="my-tags__container">
                    {isLoggedIn && myTagsData?.tags.length > 0
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
