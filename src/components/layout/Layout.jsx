import { Toaster } from "react-hot-toast";
import { Navbar1 } from "../navbar1";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Layout({ children }) {
	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			<Toaster position="top-right" toastOptions={{ duration: 3000 }} />
			<Navbar1 />
			{/* <Navbar /> */}
			<main className="flex-1">{children}</main>
			<Footer />
		</div>
	);
}
