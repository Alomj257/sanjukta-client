import React, { useState } from 'react'
import Button from '../ui/Button'
import BackToLogin from '../ui/BackToLogin'
import Input from '../ui/Input'
import { RxUpdate } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';
import './auth.css';
import apis from '../../utils/apis';
import LoadingButton from '../ui/LoadingButton';
import toast from 'react-hot-toast';

const UpdatePassword = () => {
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const passwordChange = (event) => {
        setPassword(event.target.value);
    }

    const confirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    }

    const submitHandler = async(event) => {
        event.preventDefault();
        try{
            setLoading(true);
            const response = await fetch(apis().passwordUpdate,{
                method: 'POST',
                body: JSON.stringify({password, confirmPassword, token: localStorage.getItem('passToken') }),
                headers:{'Content-Type': 'application/json'}
            })

            const result = await response.json();

            setLoading(false);

            if(!response.ok){
                throw new Error(result?.message)
            }

            if(result?.status){
                toast.success(result?.message)
                console.log(result)
                navigate('/login')
                localStorage.removeItem('email');
                localStorage.removeItem('passToken');
            }

        }catch(error){
            toast.error(error.message)
        }
    }

    return (
        <div className="auth_main">
            <form onSubmit={submitHandler}>
                <div className="auth_container">

                    {/* Header */}
                    <div className="auth_header">
                        <RxUpdate />
                        <p className="auth_heading">New password</p>
                        <p className="auth_title">Enter at least 8-digit long password</p>
                    </div>

                    {/* Input fileds */}
                    <div className="auth_item">
                        <label>Password *</label>
                        <Input onChange={passwordChange} required type='text' placeholder='New password' />
                    </div>

                    <div className="auth_item">
                        <label>Confirm Password *</label>
                        <Input onChange={confirmPasswordChange} required type='text' placeholder='Confirm password' />
                    </div>

                    {/* Button */}
                    <div className="auth_action">
                        <Button><LoadingButton loading={loading} title='Update Password'/></Button>
                    </div>
                    <div>
                        <BackToLogin />
                    </div>
                </div>
            </form>
        </div>
    )
}

export default UpdatePassword