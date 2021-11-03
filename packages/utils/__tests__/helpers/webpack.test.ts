import type { Configuration } from "webpack";

import {
	addRule,
	addPlugin,
	addOptimization,
	addBabelPluginsOrPresets,
	removeBabelPluginsOrPresets,
} from "../../src/helpers/webpack";

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

describe("addBabelPluginsOrPresets", () => {
	it("should do nothing when no .tsx? is found", () => {
		const configuration: Configuration = { module: { rules: [] } };

		addBabelPluginsOrPresets(configuration, "plugins", []);
		expect(configuration).toStrictEqual({ module: { rules: [] } });
	});

	it("should throw when .tsx? is found but babel-loader isn't", () => {
		const configuration: Configuration = { module: { rules: [{ test: /\.tsx?$/, use: [] }] } };

		try {
			addBabelPluginsOrPresets(configuration, "plugins", []);
		} catch (error) {
			expect(error).toBeInstanceOf(Error);
		}
	});

	it("should add plugin or preset if babel rule is plain", () => {
		const configuration: Configuration = { module: { rules: [{ test: /\.tsx?$/, use: ["babel-loader"] }] } };

		addBabelPluginsOrPresets(configuration, "plugins", ["test"]);
		expect(configuration).toStrictEqual({
			module: {
				rules: [{ test: /\.tsx?$/, use: [{ loader: "babel-loader", options: { plugins: ["test"], presets: [] } }] }],
			},
		});
	});

	it("should add plugin or preset if babel rule is object", () => {
		const configuration: Configuration = {
			module: {
				rules: [{ test: /\.tsx?$/, use: [{ loader: "babel-loader", options: { presets: [], plugins: [] } }] }],
			},
		};

		addBabelPluginsOrPresets(configuration, "plugins", ["test"]);
		expect(configuration).toStrictEqual({
			module: {
				rules: [{ test: /\.tsx?$/, use: [{ loader: "babel-loader", options: { plugins: ["test"], presets: [] } }] }],
			},
		});
	});
});

describe("removeBabelPluginsOrPresets", () => {
	it("should do nothing when no .tsx? is found", () => {
		const configuration: Configuration = { module: { rules: [] } };

		removeBabelPluginsOrPresets(configuration, "plugins", "@babel/preset-typescript");
		expect(configuration).toStrictEqual({ module: { rules: [] } });
	});

	it("should throw when .tsx? is found but babel-loader isn't", () => {
		const configuration: Configuration = { module: { rules: [{ test: /\.tsx?$/, use: [] }] } };

		try {
			removeBabelPluginsOrPresets(configuration, "plugins", "@babel/preset-typescript");
		} catch (error) {
			expect(error).toBeInstanceOf(Error);
		}
	});

	it("should throw if preset or plugin is not found", () => {
		const configuration: Configuration = {
			module: { rules: [{ test: /\.tsx?$/, use: [{ loader: "babel-loader", options: { presets: [] } }] }] },
		};

		try {
			removeBabelPluginsOrPresets(configuration, "presets", "@babel/preset-typescript");
		} catch (error) {
			expect(error).toBeInstanceOf(Error);
		}
	});

	it("should remove plugin or preset if found and is plain", () => {
		const configuration: Configuration = {
			module: {
				rules: [
					{ test: /\.tsx?$/, use: [{ loader: "babel-loader", options: { presets: ["@babel/preset-typescript"] } }] },
				],
			},
		};

		removeBabelPluginsOrPresets(configuration, "presets", "@babel/preset-typescript");
		expect(configuration).toStrictEqual({
			module: {
				rules: [{ test: /\.tsx?$/, use: [{ loader: "babel-loader", options: { presets: [] } }] }],
			},
		});
	});

	it("should remove plugin or preset if found and is array", () => {
		const configuration: Configuration = {
			module: {
				rules: [
					{
						test: /\.tsx?$/,
						use: [
							{ loader: "babel-loader", options: { presets: [["@babel/preset-typescript", { some: "options" }]] } },
						],
					},
				],
			},
		};

		removeBabelPluginsOrPresets(configuration, "presets", "@babel/preset-typescript");
		expect(configuration).toStrictEqual({
			module: {
				rules: [{ test: /\.tsx?$/, use: [{ loader: "babel-loader", options: { presets: [] } }] }],
			},
		});
	});
});
