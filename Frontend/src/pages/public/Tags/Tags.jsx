import { TagItem } from '~/components';
import './Tags.scss';
import { apiGetTags } from '~/apiServices';
import { useQuery } from '@tanstack/react-query';
const Tags = () => {
    const { data } = useQuery({
        queryKey: ['tags'],
        queryFn: () => apiGetTags(),
    });

    return (
        <div className="tags">
            <div className="tags__wrap">
                <h2 className="tags__header">Tags</h2>
                <div className="tags__container">
                    {(data?.tags || []) &&
                        data?.tags?.map((tag) => {
                            return <TagItem tag={tag} key={tag._id} />;
                        })}
                </div>
            </div>
        </div>
    );
};

export default Tags;
