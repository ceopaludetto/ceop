require("@rushstack/eslint-config/patch/modern-module-resolution");

module.exports = {
	extends: ["@rushstack/eslint-config/profile/node", "prettier"],
	plugins: ["prettier"],
	parserOptions: { tsconfigRootDir: __dirname },
	rules: { "prettier/prettier": "error" },
};
