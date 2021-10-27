import type { Configuration } from "webpack";

import { addRule, addPlugin } from "../../src/helpers/webpack";

describe("addRule", () => {
	it("should ignores if rule array does not exists", () => {
		const configuration: Configuration = {};

		addRule(configuration, { loader: "test-loader" });
		expect(configuration).toStrictEqual({});
	});

	it("should add a rule to webpack if rule array exists", () => {
		const configuration: Configuration = { module: { rules: [] } };

		addRule(configuration, { loader: "test-loader" });
		expect(configuration).toStrictEqual({
			module: { rules: [{ loader: "test-loader" }] },
		});
	});
});

describe("addPlugin", () => {
	it("should ignores if plugin array does not exists", () => {
		const configuration: Configuration = {};

		class Test {
			public apply() {}
		}

		addPlugin(configuration, new Test());
		expect(configuration).toStrictEqual({});
	});

	it("should add a plugin to webpack if plugin array exists", () => {
		const configuration: Configuration = {
			plugins: [],
		};

		class Test {
			public apply() {}
		}

		addPlugin(configuration, new Test());
		expect(configuration).toStrictEqual({ plugins: [new Test()] });
	});
});
