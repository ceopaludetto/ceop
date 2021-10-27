import type { Configuration } from "webpack";

import applyPlugin from "../src";

describe("Compress Plugin", () => {
	it("should ignore if array of plugins does not exist", () => {
		const configuration: Configuration = {};
		const modified = applyPlugin(configuration, { target: "client", isDev: false, browserslist: [] });

		expect(modified).toStrictEqual({});
	});

	it("should ignore if is not client target", () => {
		const configuration: Configuration = {};
		const modified = applyPlugin(configuration, { target: "server", isDev: false, browserslist: [] });

		expect(modified).toStrictEqual({});
	});

	it("should ignore if is dev mode", () => {
		const configuration: Configuration = {};
		const modified = applyPlugin(configuration, { target: "client", isDev: true, browserslist: [] });

		expect(modified).toStrictEqual({});
	});

	it("should add two instances of compression plugin if target is client and is not dev", () => {
		const configuration: Configuration = {
			plugins: [],
		};
		const modified = applyPlugin(configuration, { target: "client", isDev: false, browserslist: [] });

		expect(modified.plugins?.length).toBe(2);
	});
});
