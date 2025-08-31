import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/slices/authSlice';
import Cookies from 'js-cookie';

const AuthInitializer = ({ children }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const accessToken = Cookies.get('accessToken');
        const userData = localStorage.getItem('user');

        if (accessToken && userData) {
            try {
                const user = JSON.parse(userData);
                dispatch(setUser(user));
            } catch (error) {
                console.error('Error parsing user data:', error);
                // Clear invalid data
                Cookies.remove('accessToken');
                Cookies.remove('refreshToken');
                localStorage.removeItem('user');
            }
        }
    }, [dispatch]);
    return children;
};
export default AuthInitializer;