import { addBabelPluginsOrPresets, normalize, Target } from "@ceop/utils";
// @ts-ignore
import LoadablePlugin from "@loadable/webpack-plugin";
import type { Configuration } from "webpack";

export default function apply(configuration: Configuration, target: Target) {
	addBabelPluginsOrPresets("plugins", [require.resolve("@loadable/babel-plugin")])(configuration);

	if (target === "client") {
		configuration.plugins?.push(
			new LoadablePlugin({ filename: "assets.json", outputAsset: false, writeToDisk: { filename: normalize("dist") } }),
		);
	}

	return configuration;
}
