import React from 'react';
import './InputForm.scss';

const Input = ({ label, disabled, type, register, errors, id, validate, defaultValue }) => {
    return (
        <div className="input-container">
            <input
                className="input-container__text"
                id={id}
                type={type}
                disabled={disabled}
                {...register(id, validate)}
                value={defaultValue}
                placeholder=" "
                style={errors[id] && { border: '1px solid red' }}
            />
            <label className="input-container__label">{label.charAt(0).toUpperCase() + label.slice(1)}</label>
            {errors[id] && <small className="input-container__message">{errors[id]?.message}</small>}
        </div>
    );
};

export default Input;
