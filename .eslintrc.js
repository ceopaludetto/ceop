const path = require("path");

module.exports = {
	env: {
		node: true,
		jest: true,
	},
	parser: "@typescript-eslint/parser",
	extends: ["airbnb-base", "airbnb-typescript/base", "prettier"],
	plugins: ["@typescript-eslint", "import-helpers", "prettier"],
	parserOptions: {
		sourceType: "module",
		project: path.resolve("tsconfig.json"),
	},
	rules: {
		// Prettier for autofix
		"prettier/prettier": "error",
		// Some logic need reassign (such sequelize hooks)
		"no-param-reassign": "off",
		// Allow for of
		"no-restricted-syntax": "off",
		// Import ordering and allow no default
		"import/extensions": "off",
		"import/prefer-default-export": "off",
		"import/no-extraneous-dependencies": "off",
		"import-helpers/order-imports": [
			"warn",
			{
				newlinesBetween: "always",
				groups: ["module", "/^@\\//", ["parent", "sibling", "index"]],
				alphabetize: { order: "asc", ignoreCase: true },
			},
		],
		// DI in Nest
		"no-useless-constructor": "off",
		"class-methods-use-this": "off",
		// Nest dtos
		"max-classes-per-file": ["error", 4],
		// Use inference of type
		"@typescript-eslint/explicit-function-return-type": "off",
		"@typescript-eslint/explicit-module-boundary-types": "off",
		// Allow any in some logic
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/explicit-member-accessibility": ["error"],
	},
};
