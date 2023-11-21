import { useState } from 'react';
import './InputTags.scss';
import { GrFormClose } from 'react-icons/gr';

function TagInput({ value, onChange }) {
    const [editingIndex, setEditingIndex] = useState(null);
    const [editValue, setEditValue] = useState('');

    const addTag = (event) => {
        const tag = event.target.value;
        if ((event.code === 'Enter' || event.code === 'Space') && tag.trim() !== '') {
            onChange([...value, tag.trim()]);
            event.target.value = '';
        }
    };

    const removeTag = (indexToRemove) => {
        onChange(value.filter((_, index) => index !== indexToRemove));
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    };

    const startEdit = (index) => {
        setEditingIndex(index);
        setEditValue(value[index]);
    };

    const cancelEdit = () => {
        setEditingIndex(null);
        setEditValue('');
    };

    const saveEdit = (index) => {
        const updatedTags = [...value];
        updatedTags[index] = editValue.trim();
        onChange(updatedTags);
        cancelEdit();
    };

    const handleDoubleClick = (index) => {
        startEdit(index);
    };

    return (
        <div className="tags-input">
            <ul className="tags-input__list">
                {value &&
                    value.map((tag, index) => (
                        <li className="tags-input__item" key={index} onDoubleClick={() => handleDoubleClick(index)}>
                            {editingIndex === index ? (
                                <input
                                    type="text"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onBlur={() => saveEdit(index)}
                                    onKeyDown={(e) => (e.key === 'Enter' || e.key === 'Space') && saveEdit(index)}
                                />
                            ) : (
                                <span className="title">
                                    <span>#{tag}</span>
                                    <i className="tags-input__remove">
                                        <GrFormClose onClick={() => removeTag(index)} />
                                    </i>
                                </span>
                            )}
                        </li>
                    ))}
                <input type="text" placeholder="Press enter to add tags" onKeyDown={handleKeyDown} onKeyUp={addTag} />
            </ul>
        </div>
    );
}

export default TagInput;
