import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { MdMarkEmailRead } from "react-icons/md";
import './auth.css';
import BackToLogin from '../ui/BackToLogin';
import { useNavigate } from 'react-router-dom';
import LoadingButton from '../ui/LoadingButton';
import apis from '../../utils/apis';
import toast from 'react-hot-toast';

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const emailChange = (event) => {
        setEmail(event.target.value);
    }

    const submitHandler = async(event) => {
        event.preventDefault();

        try{
            setLoading(true);
            const response = await fetch(apis().forgetPassword,{
                method: 'POST',
                body:JSON.stringify({email}),
                headers:{'Content-Type': 'application/json'}
            })

            const result = await response.json();

            setLoading(false);

            if(!response.ok){
                throw new Error(result?.message)
            }

            if(result?.status){
                toast.success(result?.message)
                localStorage.setItem('passToken',result?.token);
                localStorage.setItem('email', email);
                navigate('/otp/verify');
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
                        <MdMarkEmailRead />
                        <p className="auth_heading">Forget your password</p>
                        <p className="auth_title">Enter your registred email we will send a 6-digit OTP</p>
                    </div>

                    {/* Input fileds */}
                    <div className="auth_item">
                        <label>Email *</label>
                        <Input onChange={emailChange} required type='email' placeholder='Enter your email' />
                    </div>

                    {/* Button */}
                    <div className="auth_action">
                        <Button><LoadingButton loading={loading} title='Send OTP'/></Button>
                    </div>
                    <div>
                        <BackToLogin/>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ForgetPassword