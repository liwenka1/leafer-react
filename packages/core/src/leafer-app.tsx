import React, {
	useEffect,
	useRef,
	forwardRef,
	useImperativeHandle,
	useLayoutEffect,
} from "react";
import { App } from "leafer-ui";
import type { App as LeaferAppType } from "leafer-ui";
import { useGetProps } from "./hooks/useGetProps";
import { useLeaferEffect } from "./hooks/useLeaferEffect";
import { createLeaferApp } from "./renderer";

export interface LeaferAppProps {
	width?: number;
	height?: number;
	children?: React.ReactNode;
	fill?: string;
	[key: string]: any;
}

export const LeaferApp = forwardRef<{ app: LeaferAppType | null }, LeaferAppProps>(
	function LeaferApp({ width = 800, height = 600, children, ...props }, ref) {
		const canvasRef = useRef<HTMLCanvasElement>(null);
		const appRef = useRef<LeaferAppType | null>(null);
		const config = useGetProps(props);

		useLayoutEffect(() => {
			if (!canvasRef.current) return;

			const app = new App({
				...config,
				view: canvasRef.current,
				width,
				height,
			});

			appRef.current = app;

			const leaferApp = createLeaferApp({
				render: () => children,
			});

			leaferApp.mount(app);

			return () => {
				leaferApp.unmount();
				app.destroy();
				appRef.current = null;
			};
		}, [width, height, config, children]);

		useLeaferEffect(config, appRef.current);

		useImperativeHandle(ref, () => ({
			app: appRef.current,
		}));

		return <canvas ref={canvasRef} style={{ width, height }} />;
	}
);

LeaferApp.displayName = "LeaferApp";
