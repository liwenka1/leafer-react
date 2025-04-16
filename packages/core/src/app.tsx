import { useEffect } from "react";
import { Leafer, Rect } from "leafer-ui";

const App = () => {
	useEffect(() => {
		const leafer = new Leafer({ view: "leafer-view" });

		const rect = new Rect({
			x: 100,
			y: 100,
			width: 200,
			height: 200,
			fill: "#32cd79",
			cornerRadius: [50, 80, 0, 80],
			draggable: true,
		});

		leafer.add(rect);

		return () => {
			leafer.destroy(); // 开发环境useEffect会执行2次，必须及时销毁
		};
	});

	return (
		<div
			id="leafer-view"
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
			}}
		></div>
	);
};

export default App;
