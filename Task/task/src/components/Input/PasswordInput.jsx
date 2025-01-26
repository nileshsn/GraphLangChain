import React, { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

const PasswordInput = ({value, onChange, className = '', placeholder = 'Password'}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative mb-4">
            <input 
            type={showPassword ? 'text' : 'password'}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`input-box pr-12 ${className}`}
            />
            <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
            >
                {showPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                ) : (
                    <AiOutlineEye size={20} />
                )}
            </button>
        </div>
    )
};

export default PasswordInput