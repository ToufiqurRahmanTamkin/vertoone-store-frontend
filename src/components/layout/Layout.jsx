import { Toaster } from "react-hot-toast";
import { Navbar } from "../Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			<Toaster position="top-right" toastOptions={{ duration: 3000 }} />
			<Navbar />
			{/* <Navbar /> */}
			<main className="flex-1">{children}</main>
			<Footer />
		</div>
	);
}
