const replace = require("@rollup/plugin-replace");

module.exports = {
	rollup(config) {
		config.plugins = config.plugins.filter((plugin) => {
			if (plugin.name === "replace") {
				return false;
			}

			return true;
		});

		return config;
	},
};
