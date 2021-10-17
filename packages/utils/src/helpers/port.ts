const detect = require("detect-port-alt");

export async function choosePort(port: number) {
	return detect(port);
}
