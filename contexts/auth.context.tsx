import { useAuthStore } from "@/store/auth.store";
import React, { createContext, useContext, useEffect } from "react";

interface AuthContextProps {
	children: React.ReactNode;
}

const AuthContext = createContext({});

export const AuthProvider = ({ children }: AuthContextProps) => {
	const loadUser = useAuthStore((state) => state.loadUser);

	useEffect(() => {
		loadUser();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
