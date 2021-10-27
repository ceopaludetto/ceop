import type { Configuration } from "webpack";

import { addRule, addPlugin, addOptimization } from "../../src/helpers/webpack";

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

describe("addOptimization", () => {
	it("should ignores if minimizer array does not exists", () => {
		const configuration: Configuration = {};

		class Test {
			public apply() {}
		}

		addOptimization(configuration, new Test());
		expect(configuration).toStrictEqual({});
	});

	it("should add a minimizer to webpack if plugin array exists", () => {
		const configuration: Configuration = {
			optimization: {
				minimizer: [],
			},
		};

		class Test {
			public apply() {}
		}

		addOptimization(configuration, new Test());
		expect(configuration).toStrictEqual({ optimization: { minimizer: [new Test()] } });
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
