import { LeaferApp } from "leafer-react";
import "./App.css";
import { useEffect } from "react";

function App() {
	useEffect(() => {
		console.log(LeaferApp, "LeaferApp");
	}, []);

	return (
		<LeaferApp width={1000} height={800} fill="#32cd79">
			<div>测试中</div>
		</LeaferApp>
	);
}

export default App;
