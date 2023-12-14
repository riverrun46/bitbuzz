import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Buzz from "./pages/Buzz";
import Home from "./pages/Home";
import EditBuzz from "./pages/EditBuzz";
import { ToastContainer } from "react-toastify";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
	return (
		<div className="relative">
			<Navbar />
			<div className="container pt-[100px] text-white h-screen overflow-auto">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/buzz/:id" element={<Buzz />} />
					<Route path="/buzz/:id/edit" element={<EditBuzz />} />
				</Routes>
			</div>
			<ToastContainer
				position="bottom-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
		</div>
	);
}

export default App;
