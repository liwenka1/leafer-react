import {
	useEffect,
	useRef,
	forwardRef,
	useImperativeHandle,
	useState,
	useLayoutEffect, // 重新引入 useLayoutEffect 以便同步创建 Leafer
} from "react";
// 确认 Leafer 类是否更适合，如果 App 也可以，保持 App
import { App } from "leafer-ui";
import type { App as LeaferAppType } from "leafer-ui";
import { createRoot } from "react-dom/client";

type LeaferAppProps = {
	width?: number;
	height?: number;
	children?: React.ReactNode;
	// 可以添加其他 App 配置项
	fill?: string; // 显式添加 fill
	// [key: string]: any; // 允许传递其他配置
};

export const LeaferApp = forwardRef<
	{ app: LeaferAppType | null },
	LeaferAppProps
>(
	(
		{ width = 800, height = 600, children, fill = "transparent", ...config },
		ref
	) => {
		const containerRef = useRef<HTMLDivElement>(null); // 根容器 div
		const appRef = useRef<LeaferAppType | null>(null);
		// 用于渲染 React children 的覆盖层 div
		const [reactOverlay, setReactOverlay] = useState<HTMLDivElement | null>(
			null
		);
		const rootRef = useRef<ReturnType<typeof createRoot> | null>(null);
		const configRef = useRef(config);

		// 直接在渲染时更新 configRef
		configRef.current = config;

		// 初始化 Leafer 应用和 React 覆盖层
		useLayoutEffect(() => {
			if (!containerRef.current) return;

			// 创建 Leafer 实例，挂载到根容器 div
			const app = new App({
				view: containerRef.current, // Leafer 在此 div 内创建 canvas
				width,
				height,
				fill, // 使用传入的 fill 或默认透明
				...configRef.current,
			});
			appRef.current = app;

			// 创建 React 覆盖层 div
			const overlayDiv = document.createElement("div");
			overlayDiv.style.position = "absolute";
			overlayDiv.style.top = "0";
			overlayDiv.style.left = "0";
			overlayDiv.style.width = "100%";
			overlayDiv.style.height = "100%";
			// 默认让覆盖层不捕获事件，除非子节点自己设置 pointerEvents: 'auto'
			overlayDiv.style.pointerEvents = "none";
			containerRef.current.appendChild(overlayDiv);
			setReactOverlay(overlayDiv); // 设置状态以触发 children 渲染

			return () => {
				console.log(
					"LeaferApp cleanup: Destroying App and unmounting React root."
				);
				// 先卸载 React Root
				if (rootRef.current) {
					rootRef.current.unmount();
					rootRef.current = null;
				}
				// 移除覆盖层
				if (containerRef.current?.contains(overlayDiv)) {
					containerRef.current.removeChild(overlayDiv);
				}
				setReactOverlay(null);
				// 再销毁 Leafer App
				app.destroy();
				appRef.current = null;
			};
			// 依赖项：添加 fill，因为它在 Effect 内部被使用
		}, [width, height, fill]); // <--- 将 fill 添加到依赖项数组

		// 渲染 React 子组件到覆盖层
		useEffect(() => {
			if (reactOverlay && children) {
				if (!rootRef.current) {
					rootRef.current = createRoot(reactOverlay);
				}
				// 包裹一层，允许子节点自己控制事件穿透
				rootRef.current.render(
					<div style={{ pointerEvents: "auto" }}>{children}</div>
				);
			} else if (rootRef.current) {
				// 如果覆盖层消失或没有 children，卸载 React root
				rootRef.current.unmount();
				rootRef.current = null;
			}
		}, [reactOverlay, children]); // 依赖覆盖层和 children

		// 更新配置 (需要根据 Leafer App API 调整)
		useEffect(() => {
			if (!appRef.current) return;

			// 更新 fill 属性 (示例)
			if (fill !== undefined && appRef.current.fill !== fill) {
				appRef.current.fill = fill;
			}

			// 更新其他配置...
			// 遍历 configRef.current 更新 appRef.current 上的对应属性或调用方法
		}, [fill /* 其他 config 依赖 */]);

		// 暴露实例
		useImperativeHandle(ref, () => ({
			app: appRef.current,
		}));

		// 返回根容器 div，Leafer 会在内部创建 canvas，React children 会渲染到覆盖层
		return (
			<div
				ref={containerRef}
				style={{ width, height, position: "relative", overflow: "hidden" }}
			/>
		);
	}
);

LeaferApp.displayName = "LeaferApp";
