import { createContext } from 'react';

//types for user
export interface User {
	username: string;
	isAdmin: boolean;
	_id: string;
	email: string;
}
//types for context
export interface UserContextType {
	user: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
	login: (user: User) => void;
	logout: () => void;
	loading: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(
	undefined
);
