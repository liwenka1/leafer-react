import { LeaferApp, Frame, Rect } from "leafer-react";
import "./App.css";

function App() {
	return (
		<div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
			<LeaferApp width={800} height={600} fill="#ffffff">
				<Frame fill="#f5f5f5" width={800} height={600}>
					<Rect width={375} height={667} fill="red" x={100} y={100} />
				</Frame>
			</LeaferApp>
		</div>
	);
}

export default App;
