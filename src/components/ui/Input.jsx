import React from 'react';
import './input.css';

const Input = ({ placeholder, required, onChange, value, type, name }) => {
    return (
        <input type={type} name={name} onChange={onChange} value={value} placeholder={placeholder} required={required} className='ui_input' />
    )
}

export default Input