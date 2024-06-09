import './MyTags.scss';
import icons from '~/utils/icons';
import { useQuery } from '@tanstack/react-query';
import { apiGetMyTags, apiGetPopularTags } from '~/apiServices';
import { TagSideBar } from '~/components';
import { useAuth } from '~/hooks';

const { RiSettingsLine } = icons;

const MyTags = () => {
    const { isLoggedIn } = useAuth();

    const { data: myTagsData } = useQuery({
        queryKey: ['myTags'],
        queryFn: apiGetMyTags,
        enabled: isLoggedIn,
        staleTime: Infinity,
    });

    const { data: popularTagsData } = useQuery({
        queryKey: ['popularTags'],
        queryFn: apiGetPopularTags,
        enabled: !isLoggedIn,
    });

    return (
        <div className="my-tags">
            <div className="my-tags__header">
                <span className="title">{isLoggedIn && myTagsData?.tags.length > 0 ? 'My tags' : 'Popular Tags'}</span>
                <span className="icon">
                    <RiSettingsLine size={18} />
                </span>
            </div>
            <div className="my-tags__container">
                {isLoggedIn && myTagsData?.tags.length > 0
                    ? myTagsData?.tags?.map((tag) => (
                          <TagSideBar key={tag._id} tagName={tag.name} color={tag.theme} postCount={tag.postsCount} />
                      ))
                    : popularTagsData?.tags?.map((tag) => (
                          <TagSideBar key={tag._id} tagName={tag.name} color={tag.theme} postCount={tag.postsCount} />
                      ))}
            </div>
        </div>
    );
};

export default MyTags;
