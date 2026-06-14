import { createBrowserRouter } from 'react-router-dom'
import LandingPage from '../Pages/LandingPage';
import AllGroups from '../Pages/GroupsPage';
import MainLayout from '../layout/MainLayout';
import NotFoundPage from '../Pages/NotFoundPage';
import Scheduce from '../Pages/ScheducePage';
import TeamDetailPage from '../Pages/TeamDetailsPage';

export const router = createBrowserRouter([
	{
		path: "/",
		element: <MainLayout />,
		children: [
			{
				index: true,
				element: <LandingPage />,
			},
			{
				path: "Schedule",
				element: <Scheduce />,
			},
			{
				path: "Groups",
				element: <AllGroups />,
			},
			{
				path: "TeamsDetails/:name",
				element: <TeamDetailPage />,
			},
		],
	},
	{
		path: "*",
		element: <NotFoundPage />,
	}
]);