// Update the ProtectedRoute component in App.js
const ProtectedRoute = () => {
    const { isAuthenticated, loading, isGuest } = useAuth();
    
    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
        </Box>;
    }
    
    return isAuthenticated || isGuest ? <Outlet /> : <Navigate to="/login" />;
};