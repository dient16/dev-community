import MDEditor from '@uiw/react-md-editor';
import { Image } from 'antd';
import { TagChildren } from '~/components';
import './PreviewPost.scss';
import { useEffect, useState } from 'react';

const PreviewPost = ({ body, title, image, tags }) => {
    const [preview, setPreview] = useState(null);

    const getBase64 = async (file) => {
        try {
            return await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
            });
        } catch (error) {
            console.error('Error converting image to base64:', error);
            return null;
        }
    };

    useEffect(() => {
        const loadPreview = async () => {
            if (image) {
                const base64Preview = await getBase64(image);
                setPreview(base64Preview);
            }
        };

        loadPreview();
    }, [image]);
    useEffect(() => {
        document.documentElement.setAttribute('data-color-mode', 'dark');
    }, []);
    return (
        <div className="post-preview__body">
            {image && <Image className="post-preview__body-image" src={preview} preview={false} />}
            {title && <h3 className="post-preview__body-title">{title}</h3>}
            <div className="post-preview__body-tags">
                {tags.length > 0 && tags.map((tag, index) => <TagChildren key={index} tagName={tag} />)}
            </div>

            {body && (
                <div className="post-preview__content">
                    <MDEditor.Markdown source={body} />
                </div>
            )}
        </div>
    );
};

export default PreviewPost;
