// import React, { useState } from 'react'
// import Navbar from '../../components/Navbar/Navbar'
// import { Link, useNavigate } from 'react-router-dom'
// import PasswordInput from '../../components/Input/PasswordInput'
// import { validateEmail, validatePassword } from '../../utils/helper';
// import axiosInstance from '../../utils/axiosInstance';

// const Login = () => {

//     const navigate = useNavigate();

//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState(null);

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         if (!validateEmail(email)) {
//             setError("Please enter a valid email address");
//             return;
//         }
//         if (!validatePassword(password)) {
//             setError("Please enter the password");
//             return;
//         }
//         setError("");

//         // Login API Call
//         try {
//             const response = await axiosInstance.post("/login", {
//                 email: email,
//                 password: password,
//             });

//             // Handle successful login response
//             if (response.data && response.data.accessToken) {
//                 localStorage.setItem("token", response.data.accessToken);
//                 navigate("/dashboard");
//             }
//         } catch (error) {
//             // Handle login error
//             if (error.response && error.response.data && error.response.data.message) {
//                 setError(error.response.data.message);
//             } else {
//                 setError("An unexpected error occurred, Please try again.");
//             }
//         }
//     };

//     return (
//         <>
//             <Navbar />

//             <div className='flex justify-center items-center mt-28'>
//                 <div className='w-96 border rounded bg-white px-7 py-10'>
//                     <form onSubmit={handleLogin}>
//                         <h4 className='text-2xl mb-7'>Login</h4>

//                         <input
//                             type="text"
//                             placeholder='Email'
//                             className='input-box'
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                         />

//                         <PasswordInput
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                         />

//                         <div className="flex justify-end mb-4">
//                             <Link to="/forgot-password" className="text-sm text-primary hover:underline">
//                                 Forgot Password?
//                             </Link>
//                         </div>

//                         {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

//                         <button type='submit' className='btn-primary'>Login</button>

//                         <p className='text-sm text-center mt-4'>
//                             Don't have an account?{" "}
//                             <Link to="/signup" className='font-medium text-primary underline'>
//                                 Create an account
//                             </Link>
//                         </p>
//                     </form>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default Login















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