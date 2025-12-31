/**
 * JSONLT (JSON Lines Table) - A library for using JSON Lines files as lightweight databases.
 *
 * @packageDocumentation
 */

// Constants
export {
  DEFAULT_LOCK_TIMEOUT,
  MAX_KEY_LENGTH,
  MAX_NESTING_DEPTH,
  MAX_RECORD_SIZE,
  MAX_SAFE_INTEGER,
  MAX_TUPLE_ELEMENTS,
  MIN_SAFE_INTEGER,
  SPEC_VERSION,
} from "./constants.js";
// Error classes
export {
  ConflictError,
  IOError,
  JSONLTError,
  KeyError,
  LimitError,
  LockError,
  ParseError,
  TransactionError,
  ValidationError,
} from "./errors.js";

// Main Table class
export { Table } from "./table.js";

// Types
export type {
  Header,
  HeaderContent,
  JsonObject,
  JsonPrimitive,
  JsonValue,
  Key,
  KeyElement,
  KeySpecifier,
  Operation,
  Record,
  TableOptions,
  Tombstone,
  TupleKey,
} from "./types.js";

// Package version
export { VERSION } from "./version.js";
