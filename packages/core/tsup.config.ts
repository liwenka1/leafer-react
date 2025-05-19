import { defineConfig } from "tsup";

export default defineConfig((options) => ({
	entry: ["src/index.ts"], // 入口文件
	format: ["cjs", "esm"], // 输出格式
	dts: true, // 生成类型定义文件
	splitting: false, // 通常库不需要代码分割
	sourcemap: true, // 生成 sourcemap
	clean: true, // 构建前清理 dist 目录
	minify: !options.watch, // 非 watch 模式下压缩代码
	external: [
		// 将 peerDependencies 设为外部依赖
		"react",
		"react-dom",
		"leafer-ui",
	],
	// 如果需要，可以添加 onSuccess 钩子，例如打印版本信息
	onSuccess: async () => {
		console.log("leafer-react build successful!");
	},
	esbuildOptions(options) {
		options.jsx = 'automatic';
	},
}));
