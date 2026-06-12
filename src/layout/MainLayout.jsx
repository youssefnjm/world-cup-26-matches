import React from 'react';
import { Outlet, Link } from "react-router-dom";
import Footer from '../Components/Footer';
import NavBare from '../Components/NavBar';

export default function MainLayout() {
	return (
		<>
			<div className="bg-white flex flex-col  min-h-screen">
                <NavBare />
				<main className="flex-1">
					<Outlet />
				</main>
				<Footer />
			</div>
		</>
	)
}