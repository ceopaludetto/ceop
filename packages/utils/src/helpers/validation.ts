import * as Yup from "yup";

import type { Plugin } from "../types";

export const validationSchema = Yup.object({
	mode: Yup.mixed<"both" | "serveronly">().oneOf(["both", "serveronly"]).default("both"),
	plugins: Yup.mixed<(string | Plugin)[]>(),
	entry: Yup.object({
		client: Yup.string().default("src/client/index.tsx"),
		server: Yup.string().default("src/server/index.ts"),
	}),
});

export type CeopConfiguration = Yup.InferType<typeof validationSchema>;
