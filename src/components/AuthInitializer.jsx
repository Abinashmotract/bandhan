// src/components/AuthInitializer.jsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUserDetails, setInitialized } from '../store/slices/authSlice';
import Cookies from 'js-cookie';

const AuthInitializer = ({ children }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const token = Cookies.get('accessToken');
        if (token) {
            dispatch(fetchUserDetails());
        } else {
            // No token found, mark as initialized
            dispatch(setInitialized());
        }
    }, [dispatch]);

    return children;
};

export default AuthInitializer;
