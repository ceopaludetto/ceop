import { addBabelPluginsOrPresets, addPlugin, normalize, Target } from "@ceop/utils";
// @ts-ignore
import LoadablePlugin from "@loadable/webpack-plugin";
import type { Configuration } from "webpack";

const path = normalize("dist/assets.json");

process.env.CEOP_LOADABLE = path;

export default function apply(configuration: Configuration, target: Target) {
	addBabelPluginsOrPresets("plugins", [require.resolve("@loadable/babel-plugin")])(configuration);

	if (target === "client") {
		addPlugin(
			new LoadablePlugin({ filename: "assets.json", outputAsset: false, writeToDisk: { filename: normalize("dist") } }),
		)(configuration);
	}

	return configuration;
}
