import { React, useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { AiOutlineLogin } from "react-icons/ai";
import { Link, useNavigate } from 'react-router-dom';
import './auth.css';
import toast from 'react-hot-toast';
import apis from '../../utils/apis';
import LoadingButton from '../ui/LoadingButton';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const emailChange = (event) => {
        setEmail(event.target.value);
    };

    const passwordChange = (event) => {
        setPassword(event.target.value);
    };

    const submitHandler = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);
            const response = await fetch(apis().loginUser, {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: { 'Content-Type': 'application/json' }
            });

            const result = await response.json();

            setLoading(false);

            if (!response.ok) {
                throw new Error(result?.message || 'Something went wrong');
            }

            if (result?.status) {
                toast.success(result?.message);
                // Save token and role in localStorage
                localStorage.setItem('accessToken', result?.token);
                localStorage.setItem('userRole', result?.user?.role);
                localStorage.setItem('userName', result?.user?.name);
                localStorage.setItem('email', result?.user?.email);
                // Redirect based on role
                if (result?.user?.role === 'admin') {
                    console.log('Navigating to admin dashboard...');
                    navigate('/admin/dashboard');
                } else if (result?.user?.role === 'user') {
                    console.log('Navigating to user dashboard...');
                    navigate('/user/section');
                }
            }

        } catch (error) {
            setLoading(false);
            toast.error(error.message);
        }

        console.log(email);
        console.log(password);
    };


    return (
        <div className="auth_main">
            <form onSubmit={submitHandler}>
                <div className="auth_container">
                    {/* Header */}
                    <div className="auth_header">
                        <AiOutlineLogin />
                        <p className="auth_heading">Welcome to Sanjukta</p>
                        <p className="auth_title">Login to continue</p>
                    </div>

                    {/* Input fields */}
                    <div className="auth_item">
                        <label>Email *</label>
                        <Input onChange={emailChange} required type='email' placeholder='Enter your email' />
                    </div>
                    <div className="auth_item">
                        <label>Password *</label>
                        <Input onChange={passwordChange} required type='password' placeholder='Enter your password' />
                    </div>

                    {/* Button */}
                    <div className="auth_action">
                        <Button><LoadingButton loading={loading} title='Login' /></Button>
                    </div>

                    <div className="auth_options">
                        <Link to='/register'>Create new account?</Link>
                        <Link to='/forget/password'>Forgot password?</Link>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Login;
