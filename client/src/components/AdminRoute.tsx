import { Navigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { ReactNode } from 'react';

interface AdminRouteProps {
	children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
	const { user, loading } = useUser();

	if (loading) {
		return <div>Loading...</div>;
	}

	if (!user || user.isAdmin === false) {
		return <Navigate to='/' />;
	}

	return <>{children}</>;
};

export default AdminRoute;
