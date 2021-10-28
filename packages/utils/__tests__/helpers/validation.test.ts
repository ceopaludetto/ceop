import { CeopConfiguration, validationSchema } from "../../src/helpers/validation";

describe("validationSchema", () => {
	it("should check if configuration is provided", () => {
		expect(validationSchema.validate({})).resolves.toThrow();
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
