import React from 'react'
import './InputTags.scss'
import {GrFormClose} from 'react-icons/gr'

function InputTags({tags, addTag, removeTag, handleKeyDown}) {
  return (
    <>
      <div className='tags__input'>
        <ul className='input__list'>
          {tags &&
            tags.map((tag, index) => (
              <li className='input__item' key={index}>
                <span>#{tag}</span>
                <i className='input__remove'>
                  <GrFormClose onClick={() => removeTag(index)} />
                </i>
              </li>
            ))}
        </ul>
        <input
          type='text'
          placeholder='Press enter to add tags'
          onKeyDown={handleKeyDown}
          onKeyUp={addTag}
        />
      </div>
    </>
  );
}

export default InputTags