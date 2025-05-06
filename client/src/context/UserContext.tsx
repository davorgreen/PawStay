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
}

export const UserContext = createContext<UserContextType | undefined>(
	undefined
);
