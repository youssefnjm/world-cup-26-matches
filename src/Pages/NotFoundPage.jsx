import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
	<section style={{ position: "relative"}} className="bg-yellow-100 h-screen">
		<div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
			<div className="mx-auto max-w-screen-sm text-center">
				<h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-black">404</h1>
				<p className="mb-4 text-3xl tracking-tight font-bold md:text-4xl text-black">Something's missing.</p>
				<p className="mb-4 text-lg font-light text-black">Sorry, we can't find that page. You'll find lots to explore on the home page. </p>
				<Link className="relative" to="/">
					<span className="absolute top-0 left-0 mt-1 ml-1 h-8 w-full rounded bg-black"></span>
					<span className="font-bold relative inline-block h-full w-full rounded border-2 border-black bg-white px-3 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">back to Home</span>
				</Link>
			</div>   
		</div>
	</section>
  )
}