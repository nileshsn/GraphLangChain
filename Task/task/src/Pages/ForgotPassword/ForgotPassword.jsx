import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { Link } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }
        
        setError(null);
        setIsLoading(true);

        try {
            const response = await axiosInstance.post('/forgot-password', {
                email: email
            });

            setSuccess(true);
            setEmail('');
        } catch (error) {
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className='flex justify-center items-center mt-28'>
                <div className='w-96 border rounded bg-white px-7 py-10'>
                    {!success ? (
                        <form onSubmit={handleSubmit}>
                            <h4 className='text-2xl mb-7'>Forgot Password</h4>
                            <p className='text-sm text-gray-600 mb-6'>
                                Enter your email address and we'll send you a link to reset your password.
                            </p>

                            <input
                                type="email"
                                placeholder='Email'
                                className='input-box'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

                            <button 
                                type='submit' 
                                className='btn-primary'
                                disabled={isLoading}
                            >
                                {isLoading ? 'Sending...' : 'Send Reset Link'}
                            </button>

                            <p className='text-sm text-center mt-4'>
                                Remember your password?{" "}
                                <Link to="/login" className='font-medium text-primary underline'>
                                    Login
                                </Link>
                            </p>
                        </form>
                    ) : (
                        <div className='text-center'>
                            <h4 className='text-2xl mb-4'>Check Your Email</h4>
                            <p className='text-sm text-gray-600 mb-6'>
                                We've sent a password reset link to your email address.
                            </p>
                            <Link to="/login" className='btn-primary inline-block'>
                                Return to Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ForgotPassword; 