import browserslist from "browserslist";
import fs from "fs-extra";
import os from "os";
import findPackage from "pkg-up";

import { normalize, context } from "../module";
import { logger } from "./logger";

export async function checkBrowsers() {
	const current = browserslist.loadConfig({ path: normalize(".") });

	if (current !== null) return Promise.resolve(current);

	logger.info("Browserslist configuration not found");
	logger.log("We'll set default, please check package.json 'browserslist' field");

	const packagePath = await findPackage({ cwd: context });

	if (!packagePath) {
		logger.error("Package.json not found");
		return Promise.reject(new Error("package.json-not-found"));
	}

	const pkg = JSON.parse(await fs.readFile(packagePath, "utf8"));
	pkg.browserslist = ["defaults"];

	await fs.writeFile(packagePath, JSON.stringify(pkg, null, 2) + os.EOL);
	browserslist.clearCaches();

	return pkg.browserslist;
}
