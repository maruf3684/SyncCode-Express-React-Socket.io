import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Toster from "./components/Toster";
import EditorPage from "./pages/EditorPage";
import HomePage from "./pages/HomePage";

console.log(process.env.REACT_APP_SECRET_BACKEND_URL);

const App = () => {
	return (
		<BrowserRouter>
			<Toster />
			<Routes>
				<Route path="/" element={<HomePage />}></Route>
				<Route path="/editor/:roomId" element={<EditorPage />}></Route>
				<Route path="*" element={<HomePage />}></Route>
			</Routes>
		</BrowserRouter>
	);
};

export default App;
