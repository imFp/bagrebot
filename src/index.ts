import { ExtendedCient } from "./structs/ExtendedClient";
export * from "colors";
import config from "./config.json";

const client = new ExtendedCient();

client.start();

export { client, config };