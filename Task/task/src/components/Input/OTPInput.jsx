import React, { useRef, useEffect } from 'react';

const OTPInput = ({ value, onChange, disabled }) => {
    const inputRefs = useRef([]);

    useEffect(() => {
        // Pre-fill refs array
        inputRefs.current = inputRefs.current.slice(0, 6);
    }, []);

    const handleChange = (e, index) => {
        const newValue = e.target.value;
        if (newValue.length > 1) return; // Prevent multiple digits

        // Update the OTP value
        const newOTP = value.split('');
        newOTP[index] = newValue;
        onChange(newOTP.join(''));

        // Move to next input if value is entered
        if (newValue && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        // Move to previous input on backspace
        if (e.key === 'Backspace' && !value[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        onChange(pastedData);
    };

    return (
        <div className="flex gap-2 mb-4">
            {[...Array(6)].map((_, index) => (
                <input
                    key={index}
                    ref={(ref) => inputRefs.current[index] = ref}
                    type="text"
                    maxLength={1}
                    className="w-12 h-12 text-center border rounded-lg text-lg font-semibold focus:border-primary focus:outline-none disabled:bg-gray-100"
                    value={value[index] || ''}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    disabled={disabled}
                />
            ))}
        </div>
    );
};

export default OTPInput; 