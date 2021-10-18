import { addBabelPluginsOrPresets, addPlugin, normalize, Plugin } from "@ceop/utils";
// @ts-ignore
import LoadablePlugin from "@loadable/webpack-plugin";

const path = normalize("dist/assets.json");

process.env.CEOP_LOADABLE = path;

const plugin: Plugin = (configuration, { target }) => {
	addBabelPluginsOrPresets("plugins", [require.resolve("@loadable/babel-plugin")])(configuration);

	if (target === "client") {
		addPlugin(
			new LoadablePlugin({ filename: "assets.json", outputAsset: false, writeToDisk: { filename: normalize("dist") } }),
		)(configuration);
	}

	return configuration;
};

export default plugin;
