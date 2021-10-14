import * as Yup from "yup";

export const validationSchema = Yup.object({
	mode: Yup.mixed<"both" | "serveronly">().oneOf(["both", "serveronly"]).default("both"),
	plugins: Yup.mixed<string[]>(),
});

export type CeopConfiguration = Yup.InferType<typeof validationSchema>;
