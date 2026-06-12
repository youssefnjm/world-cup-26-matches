import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import worldCupApi from '../APIs/openfootball/worldcup';

const WC26Context = createContext();

export const useWC26 = () => {
    const res = useContext(WC26Context);
    return res;
}

export const WC26Provider = ({ children }) => {
	const [ isLoading, setIsLoading ] = useState(false);

	const [ matches, setMatches ] = useState([]);
	const [ teams, setTeams ] = useState([]);
	const [ stadiums, setStadiums ] = useState([]);
	const [ squades, setSquades ] = useState([]);
	const [ groups, setGroups ] = useState([]);

	const getAllData = async () => {
		const teams = await worldCupApi('2026/worldcup.teams.json');
		if (teams) {
			console.log(teams.data);
			setTeams(teams.data);
		}
		const stadiums = await worldCupApi('2026/worldcup.stadiums.json');
		if (stadiums) {
			console.log(stadiums);
			setStadiums(stadiums.data);
		}
		
		const squades = await worldCupApi('2026/worldcup.squads.json');
		if (squades) {
			console.log(squades);
			setSquades(squades.data);
		}

		const groups = await worldCupApi('2026/worldcup.groups.json');
		if (groups) {
			console.log(groups);
			setGroups(groups.data);
		}

		const matches = await worldCupApi('2026/worldcup.json');
		if (matches) {
			console.log(matches);
			setMatches(matches.data);
		}
		
	}
	
	useEffect(() => {
		setIsLoading(true);
		getAllData();
		setIsLoading(false);
	}, []);

	const value = {
		matches,
		teams,
		stadiums,
		squades,
		groups,
		isLoading,
	};

	return (
		<WC26Context.Provider value={value}>
			{children}
		</WC26Context.Provider>
	);
};
