import { ReactNode, useEffect, useState } from 'react';
import { User, UserContext } from './UserContext';

export const UserProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(() => {
		const storedUser = localStorage.getItem('user');
		return storedUser ? JSON.parse(storedUser) : null;
	});
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const savedUser = localStorage.getItem('user');
		if (savedUser) {
			setUser(JSON.parse(savedUser));
		}
		setLoading(false);
	}, []);

	const login = (userData: User) => {
		localStorage.setItem('user', JSON.stringify(userData));
		setUser(userData);
	};

	const logout = () => {
		localStorage.removeItem('user');
		setUser(null);
	};

	return (
		<UserContext.Provider
			value={{ user, login, logout, setUser, loading }}>
			{children}
		</UserContext.Provider>
	);
};
