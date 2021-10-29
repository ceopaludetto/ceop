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
			module: {
				rules: [
					{
						oneOf: [
							{
								exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.json$/],
								type: "asset",
								parser: {
									dataUrlCondition: {
										maxSize: 10 * 1024, // 10kb
									},
								},
							},
						],
					},
				],
			},
		});
	});
});
