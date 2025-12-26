/**
 * JSONLT (JSON Lines Table) - A library for using JSON Lines files as lightweight databases.
 *
 * @packageDocumentation
 */

export {
  JsonltError,
  KeyError,
  ParseError,
  ValidationError,
} from "./errors.js";
export { Table } from "./table.js";
export type {
  JsonObject,
  JsonValue,
  Record,
  RecordKey,
  TableOptions,
} from "./types.js";
export { VERSION } from "./version.js";
