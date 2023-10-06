import React from 'react';
import MDEditor, { commands } from '@uiw/react-md-editor';
import './PostMarkdown.scss';
import icons from '~/utils/icons';

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

const customMarkIcon = {
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
        icon: <BsImage size={22} />,
        execute: (state, api) => {
            let modifyText = `![image](${state.selectedText})\n`;
            if (!state.selectedText) {
                modifyText = `![image](adada)`;
            }
            api.replaceSelection(modifyText);
        },
    },
};

const PostMarkdown = ({ content, setContent }) => {
    return (
        <div className="container-markdown-post">
            <MDEditor
                value={content}
                onChange={setContent}
                preview="edit"
                height={400}
                textareaProps={{
                    placeholder: 'Please your content here...',
                }}
                commands={[
                    customMarkIcon.bold,
                    customMarkIcon.italic,
                    customMarkIcon.link,
                    customMarkIcon.quote,
                    customMarkIcon.orderedListCommand,
                    customMarkIcon.unorderedListCommand,
                    customMarkIcon.code,
                    customMarkIcon.codeBlock,
                    customMarkIcon.image,
                ]}
            />
            {/* <MDEditor.Markdown source={value} style={{ whiteSpace: 'pre-wrap' }} /> */}
        </div>
    );
};

export default PostMarkdown;
