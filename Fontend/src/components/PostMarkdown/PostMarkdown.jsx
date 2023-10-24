import React, { useEffect } from 'react';
import MDEditor, { commands } from '@uiw/react-md-editor';
import './PostMarkdown.scss';
import icons from '~/utils/icons';
import { Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { uploadImage } from '~/store/post/actionThunk';
const PostMarkdown = ({ content, setContent }) => {
    const dispatch = useDispatch();
    const { imageUrl, isLoading } = useSelector((state) => state.post);
    useEffect(() => {
        if (imageUrl) {
            const modifyText = `![image](${imageUrl})\n`;
            setContent((prevContent) => prevContent + modifyText);
        }
    }, [imageUrl]);
    const {
        BsCodeSquare,
        LuBold,
        LuItalic,
        BiLink,
        BsCodeSlash,
        AiOutlineOrderedList,
        AiOutlineUnorderedList,
        BiSolidQuoteAltLeft,
        BsImage,
    } = icons;

    const customMark = {
        bold: {
            ...commands.bold,
            icon: <LuBold size={22} />,
        },
        italic: {
            ...commands.italic,
            icon: <LuItalic size={22} />,
        },
        link: {
            ...commands.link,
            icon: <BiLink size={22} />,
        },
        code: {
            ...commands.code,
            icon: <BsCodeSlash size={22} />,
        },
        codeBlock: {
            ...commands.codeBlock,
            icon: <BsCodeSquare size={22} />,
        },
        orderedListCommand: {
            ...commands.orderedListCommand,
            icon: <AiOutlineOrderedList size={23} />,
        },
        unorderedListCommand: {
            ...commands.unorderedListCommand,
            icon: <AiOutlineUnorderedList size={23} />,
        },
        quote: {
            ...commands.quote,
            icon: <BiSolidQuoteAltLeft size={22} />,
        },
        image: {
            ...commands.image,
            icon: (
                <span>
                    <label htmlFor="upload-image">
                        <BsImage size={22} />
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        id="upload-image"
                        onChange={async (e) => {
                            let img = e.target.files[0];
                            if (img) {
                                const formData = new FormData();
                                formData.append('image', img);
                                dispatch(uploadImage(formData));
                            }
                        }}
                        style={{ display: 'none' }}
                    />
                </span>
            ),
            execute: async (state, api) => {
                let modifyText = '';
                if (state.selectedText) {
                    modifyText = `![image](${state.selectedText})\n`;
                }
                api.replaceSelection(modifyText);
            },
        },
    };
    return (
        <div className="container-markdown-post">
            <Spin tip="Loading" size="large" spinning={isLoading}>
                <MDEditor
                    value={content}
                    onChange={setContent}
                    preview="edit"
                    height={400}
                    textareaProps={{
                        placeholder: 'Please your content here...',
                    }}
                    commands={[
                        customMark.bold,
                        customMark.italic,
                        customMark.link,
                        customMark.quote,
                        customMark.orderedListCommand,
                        customMark.unorderedListCommand,
                        customMark.code,
                        customMark.codeBlock,
                        customMark.image,
                    ]}
                />
            </Spin>
        </div>
    );
};

export default PostMarkdown;
