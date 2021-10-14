import type { Configuration } from "webpack";

export type Target = "client" | "server";

export type Plugin = (configuration: Configuration, target: Target, isDev: boolean) => Configuration;
