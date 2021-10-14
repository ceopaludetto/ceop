import { App } from "../client/App";
import path from "path";

import { renderToString, renderToStaticMarkup } from "react-dom/server";
import { ChunkExtractor } from "@loadable/server";

const statsFile = path.resolve("dist", "assets.json");

export function render() {
	const extractor = new ChunkExtractor({ statsFile });
	const markup = renderToString(extractor.collectChunks(<App />));

	const link = extractor.getLinkElements();
	const style = extractor.getStyleElements();
	const script = extractor.getScriptElements();

	return renderToStaticMarkup(
		<html>
			<head>
				{link}
				{style}
			</head>
			<body>
				<div id="root" dangerouslySetInnerHTML={{ __html: markup }} />
				{script}
			</body>
		</html>,
	);
}
