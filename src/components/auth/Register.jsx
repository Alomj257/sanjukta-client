import React, { useState } from 'react';
import './auth.css';
import Input from '../ui/Input';
import { FaUserPlus } from "react-icons/fa";
import Button from '../ui/Button';
import BackToDashboard from '../ui/BackToDashboard';
import { useNavigate } from 'react-router-dom';
import apis from '../../utils/apis';
import toast from 'react-hot-toast';
import LoadingButton from '../ui/LoadingButton';

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [loading, setLoading] = useState(false);

    const nameChange = (event) => {
        setName(event.target.value);
    }

    const emailChange = (event) => {
        setEmail(event.target.value);
    }

    const passwordChange = (event) => {
        setPassword(event.target.value);
    }

    const roleChange = (event) => {
        setRole(event.target.value);
    }

    const submitHandler = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);
            const response = await fetch(apis().registerUser, {
                method: 'POST',
                body: JSON.stringify({ name, email, password, role }),
                headers: { 'Content-Type': 'application/json' }
            });

            const result = await response.json();

            setLoading(false);

            if (!response.ok) {
                throw new Error(result?.message);
            }

            if (result?.status) {
                toast.success(result?.message);
                navigate('/');
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <div className='auth_main_register'>
            <form onSubmit={submitHandler}>
                <div className="auth_container">

                    {/* Header */}
                    <div className="auth_header">
                        <FaUserPlus />
                        <p className="auth_heading">Welcome to Sanjukta</p>
                        <p className="auth_title">Create a new user</p>
                    </div>

                    {/* Input fields */}
                    <div className="auth_item">
                        <label>Name *</label>
                        <Input onChange={nameChange} required type='text' placeholder='Enter your name' />
                    </div>
                    <div className="auth_item">
                        <label>Email *</label>
                        <Input onChange={emailChange} required type='email' placeholder='Enter your email' />
                    </div>
                    <div className="auth_item">
                        <label>Password *</label>
                        <Input onChange={passwordChange} required type='password' placeholder='Enter your password' />
                    </div>

                    {/* Role Selection */}
                    <div className="auth_item">
                        <label>Role</label>
                        <select onChange={roleChange} value={role} className="auth_input" required >
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                        </select>
                    </div>

                    {/* Button */}
                    <div className="auth_action">
                        <Button><LoadingButton loading={loading} title='Register' /></Button>
                    </div>
                    <div>
                        <BackToDashboard />
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Register;
