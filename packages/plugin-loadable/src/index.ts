import { addBabelPluginsOrPresets, addPlugin, normalize, Plugin } from "@ceop/utils";
// @ts-ignore
import LoadablePlugin from "@loadable/webpack-plugin";

const path: string = normalize("dist/assets.json");

process.env.CEOP_LOADABLE = path;

const plugin: Plugin = (configuration, { target }) => {
	addBabelPluginsOrPresets(configuration, "plugins", [require.resolve("@loadable/babel-plugin")]);

	if (target === "client") {
		addPlugin(
			configuration,
			new LoadablePlugin({ filename: "assets.json", outputAsset: false, writeToDisk: { filename: normalize("dist") } }),
		);
	}

	return configuration;
};

export default plugin;
