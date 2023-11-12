import { useEffect, useState } from 'react';
import { TagItem } from '~/components';
import './Tags.scss';
import { apiGetTags } from '~/apiServices';
const Tags = () => {
    const [tags, setTags] = useState(null);

    const getTags = async () => {
        const response = await apiGetTags();
        if (response.status === 'success') {
            setTags(response.tags);
        }
    };
    useEffect(() => {
        getTags();
    }, []);
    return (
        <div className="tags">
            <div className="tags__wrap">
                <h2 className="tags__header">Tags</h2>
                <div className="tags__container">
                    {tags &&
                        tags.map((tag) => {
                            return <TagItem tag={tag} key={tag._id} />;
                        })}
                </div>
            </div>
        </div>
    );
};

export default Tags;
