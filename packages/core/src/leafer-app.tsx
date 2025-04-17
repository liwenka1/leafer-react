import React, {
	useEffect,
	useRef,
	forwardRef,
	useImperativeHandle,
	useState,
	useLayoutEffect,
} from "react";
import { App } from "leafer-ui";
import type { App as LeaferAppType } from "leafer-ui";
import { createRoot } from "react-dom/client";

type LeaferAppProps = {
	width?: number;
	height?: number;
	children?: React.ReactNode;
};

const LeaferApp = forwardRef<{ app: LeaferAppType }, LeaferAppProps>(
	({ width = 800, height = 600, children, ...config }, ref) => {
		const canvasRef = useRef<HTMLCanvasElement>(null);
		const appRef = useRef<LeaferAppType | null>(null);
		const [container, setContainer] = useState<HTMLElement | null>(null);
		const rootRef = useRef<ReturnType<typeof createRoot> | null>(null);

		// 初始化 Leafer 应用
		useLayoutEffect(() => {
			if (!canvasRef.current) return;

			// 创建 Leafer 实例
			const app = new App({
				...config,
				view: canvasRef.current,
				width,
				height,
			});

			appRef.current = app;

			// 创建 React 挂载容器
			const div = document.createElement("div");
			try {
				// 使用 try-catch 包裹可能出错的代码
				app.editor.add({ view: div });
				setContainer(div);
			} catch (error) {
				console.error("Error adding div to editor:", error);
			}

			return () => {
				app.destroy();
				appRef.current = null;
				if (rootRef.current) {
					rootRef.current.unmount();
				}
			};
		}, []);

		// 渲染子组件
		useEffect(() => {
			if (container && children) {
				if (!rootRef.current) {
					rootRef.current = createRoot(container);
				}
				rootRef.current.render(children);
			}
		}, [container, children]);

		// 更新配置
		useEffect(() => {
			if (!appRef.current) return;

			// 更新视图尺寸
			if (width !== appRef.current.width || height !== appRef.current.height) {
				try {
					appRef.current.resize({ width, height });
				} catch (error) {
					console.error("Error resizing app:", error);
				}
			}

			// 更新其他配置
			Object.assign(appRef.current.config, config);
		}, [config, width, height]);

		// 暴露实例
		useImperativeHandle(ref, () => ({
			app: appRef.current!,
		}));

		return <canvas ref={canvasRef} />;
	}
);

export default LeaferApp;
