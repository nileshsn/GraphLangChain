import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PasswordInput from '../../components/Input/PasswordInput';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { checkPasswordStrength, validateEmail } from '../../utils/helper';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [passwordValidation, setPasswordValidation] = useState({
        strength: '',
        color: '',
        isValid: false,
        feedback: []
    });
    const [isFormValid, setIsFormValid] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const isNameValid = name.trim().length >= 2;
        const isEmailValid = validateEmail(email);
        const isPasswordValid = passwordValidation.isValid;

        setIsFormValid(isNameValid && isEmailValid && isPasswordValid);
    }, [name, email, passwordValidation]);

    useEffect(() => {
        if (password) {
            setPasswordValidation(checkPasswordStrength(password));
        } else {
            setPasswordValidation({ strength: '', color: '', isValid: false, feedback: [] });
        }
    }, [password]);

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!isFormValid) {
            return;
        }

        setError(null);

        try {
            const response = await axiosInstance.post("/create-account", {
                fullName: name,
                email: email,
                password: password,
            });

            if (response.data && response.data.error) {
                setError(response.data.message);
                return;
            }
            if (response.data && response.data.accessToken) {
                localStorage.setItem("token", response.data.accessToken);
                navigate("/dashboard");
            }
        } catch (error) {
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        }
    };

    return (
        <>
            <Navbar />
            <div className='flex justify-center items-center mt-28'>
                <div className='w-96 border rounded bg-white px-7 py-10'>
                    <form onSubmit={handleSignUp}>
                        <h4 className='text-2xl mb-7'>Sign Up</h4>

                        <input
                            type="text"
                            placeholder='Name'
                            className='input-box'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {name && name.trim().length < 2 && (
                            <p className="text-xs text-red-500 mt-1 mb-1">Name must be at least 2 characters</p>
                        )}

                        <input
                            type="text"
                            placeholder='Email'
                            className='input-box'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {email && !validateEmail(email) && (
                            <p className="text-xs text-red-500 mt-1 mb-1">Please enter a valid email address</p>
                        )}

                        <PasswordInput
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {password && (
                            <div className="mt-1 mb-1">
                                <p className={`text-sm ${passwordValidation.color}`}>
                                    Password Strength: {passwordValidation.strength}
                                </p>
                                {passwordValidation.feedback.length > 0 && (
                                    <ul className="text-xs text-gray-600 mt-1 list-disc pl-4">
                                        {passwordValidation.feedback.map((feedback, index) => (
                                            <li key={index}>{feedback}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}

                        {error && <p className='text-red-500 text-xs mb-1'>{error}</p>}

                        <button 
                            type='submit' 
                            className={`btn-primary w-full ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={!isFormValid}
                        >
                            Create Account
                        </button>

                        <p className='text-sm text-center mt-4'>
                            Already have an account?{" "}
                            <Link to="/login" className='font-medium text-primary underline'>
                                Login
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
};

export default SignUp;