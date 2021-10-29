import type { Configuration } from "webpack";

import applyPlugin from "../src";

describe("Loadable Plugin", () => {
	it("should ignore if array of rules does not exist", () => {
		const configuration: Configuration = {};

		applyPlugin(configuration, { target: "client", isDev: true, browserslist: [] });
		expect(configuration).toStrictEqual({});
	});

	it("should transform array of rules", () => {
		const configuration: Configuration = { module: { rules: [] } };

		applyPlugin(configuration, { target: "client", isDev: true, browserslist: [] });
		expect(configuration).toStrictEqual({
			module: { rules: [{ oneOf: [{ loader: "file-loader", options: { name: "[name].[ext]", emitFile: false } }] }] },
		});
	});

	it("should add contenthash if is production", () => {
		const configuration: Configuration = { module: { rules: [] } };

		applyPlugin(configuration, { target: "client", isDev: false, browserslist: [] });
		expect(configuration).toStrictEqual({
			module: {
				rules: [
					{ oneOf: [{ loader: "file-loader", options: { name: "[name].[contenthash:8].[ext]", emitFile: true } }] },
				],
			},
		});
	});
});
