import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Outlet, Navigate } from 'react-router-dom';
import apis from '../utils/apis';

const Super = () => {
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getRouteAccess = async () => {
            try {
                setLoading(true);

                const response = await fetch(apis().getAccess, {
                    method: 'POST',
                    body: JSON.stringify({ token: localStorage.getItem('passToken') }),
                    headers: { 'Content-Type': 'application/json' },
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result?.message || 'Something went wrong');
                }

                if (result?.status) {
                    setIsAuth(true);
                }
            } catch (error) {
                if (error.message) {
                    toast.dismiss();
                    toast.error(error.message);
                }
            } finally {
                setLoading(false);
            }
        };

        getRouteAccess();
    }, []);

    if (loading) {
        return <h2>Loading...</h2>;
    }

    return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default Super;
