import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import PasswordInput from '../../components/Input/PasswordInput';
import axiosInstance from '../../utils/axiosInstance';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }
        
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            await axiosInstance.post('/reset-password', {
                token,
                password
            });

            navigate('/login', { 
                state: { message: 'Password reset successful. Please login with your new password.' }
            });
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
                    <form onSubmit={handleSubmit}>
                        <h4 className='text-2xl mb-7'>Reset Password</h4>

                        <PasswordInput
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="New Password"
                        />

                        <PasswordInput
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                        />

                        {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

                        <button 
                            type='submit' 
                            className='btn-primary'
                            disabled={isLoading}
                        >
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>

                        <p className='text-sm text-center mt-4'>
                            Remember your password?{" "}
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

export default ResetPassword; 