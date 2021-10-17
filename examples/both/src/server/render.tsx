import { App } from "../client/App";

import { renderToString, renderToStaticMarkup } from "react-dom/server";
import { ChunkExtractor } from "@loadable/server";

export function render() {
	const extractor = new ChunkExtractor({ statsFile: process.env.CEOP_LOADABLE as string });
	const markup = renderToString(extractor.collectChunks(<App />));

	const link = extractor.getLinkElements();
	const style = extractor.getStyleElements();
	const script = extractor.getScriptElements();

	return "<!DOCTYPE html>".concat(
		renderToStaticMarkup(
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
		),
	);
}
