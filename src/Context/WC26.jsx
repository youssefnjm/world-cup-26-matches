import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import wordCupApi from '../APIs/openfootball/worldcup';

const WC26Context = createContext();

export const useWC26 = () => {
    const res = useContext(WC26Context);
    return res;
}

export const WC26Provider = ({ children }) => {
	// const [isLoading, setIsLoading] = useState(true);
	const [ teams, setTeams ] = useState(null);
	const [ stadiums, setStadiums ] = useState(null);
	const [ squades, setSquades ] = useState(null);

	useEffect(() => {
		const isMountedRef = { current: true };
		checkAuth(isMountedRef);

		return () => {
			isMountedRef.current = false;
		};
	}, []);

	const value = {
		teams,
		stadiums,
		squades,

		// isAuthenticated,
		// setIsAuthenticated,
		// isLoading,
		// setIsLoading
	};

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
};