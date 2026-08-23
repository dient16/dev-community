import { TagItem } from '~/components';
import './Tags.scss';
import { apiGetTags } from '~/apiServices';
import { useQuery } from '@tanstack/react-query';
const Tags = () => {
    const { data } = useQuery({
        queryKey: ['tags'],
        queryFn: () => apiGetTags(),
    });

    const tags = data?.tags || [];

    return (
        <div className="tags">
            <div className="tags__wrap">
                <h2 className="tags__header">Tags</h2>
                <p className="tags__subtitle">
                    Theo dõi các chủ đề bạn quan tâm để cá nhân hoá trang chủ của mình.
                </p>
                {tags.length > 0 ? (
                    <div className="tags__container">
                        {tags.map((tag) => (
                            <TagItem tag={tag} key={tag._id} />
                        ))}
                    </div>
                ) : (
                    <div className="tags__empty">Chưa có tag nào.</div>
                )}
            </div>
        </div>
    );
};

export default Tags;
