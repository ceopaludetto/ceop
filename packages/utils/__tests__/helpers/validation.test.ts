import { CeopConfiguration, validationSchema } from "../../src/helpers/validation";

describe("validationSchema", () => {
	it("should check if configuration is provided", () => {
		expect(validationSchema.validate({})).resolves.toStrictEqual({entry: {client: "src/client/index.tsx", server: "src/server/index.ts"}, mode: "both"});
	});

	it("should resolves if valid value is passed", () => {
		const configuration: CeopConfiguration = {
			mode: "both",
			plugins: [],
			entry: {
				client: "",
				server: "",
			},
		};

		expect(validationSchema.validate(configuration)).resolves.toStrictEqual(configuration);
	});
});
