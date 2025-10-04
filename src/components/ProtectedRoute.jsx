import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading, isInitialized } = useSelector((state) => state.auth);
    const location = useLocation();
    
    // Show loading while authentication is being checked
    if (!isInitialized || loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
                    <div>Loading...</div>
                </div>
            </div>
        );
    }
    
    // Only redirect to login if we're sure the user is not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    return children;
};
export default ProtectedRoute;
