import { LeaferApp } from "../../../packages/core/src/leafer-app";
import "./App.css";
import { useEffect } from "react";

function App() {
	useEffect(() => {
		console.log(LeaferApp, "LeaferApp");
	}, []);

	return (
		<LeaferApp width={1000} height={800}>
			<div>测试中</div>
		</LeaferApp>
	);
}

export default App;
