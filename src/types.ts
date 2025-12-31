/**
 * A valid JSON primitive value.
 */
export type JsonPrimitive = string | number | boolean | null;

/**
 * A valid JSON value (primitive, array, or object).
 */
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

/**
 * A JSON object with string keys and JSON values.
 */
export type JsonObject = { [key: string]: JsonValue };

/**
 * A valid key element in a JSONLT key.
 *
 * Key elements must be either:
 * - A string
 * - An integer (number with no fractional component) within safe integer range
 */
export type KeyElement = string | number;

/**
 * A tuple key consisting of multiple key elements.
 *
 * Tuple keys:
 * - Must have 1-16 elements (0 elements is invalid)
 * - Each element must be a valid KeyElement
 */
export type TupleKey = readonly KeyElement[];

/**
 * A valid JSONLT key.
 *
 * Keys can be:
 * - A string
 * - An integer (safe integer range: ±2^53-1)
 * - A tuple (array of 1-16 strings or integers)
 */
export type Key = KeyElement | TupleKey;

/**
 * A key specifier defines which field(s) contain the key.
 *
 * - A string specifies a single field name (scalar key)
 * - An array of strings specifies multiple field names (tuple key)
 */
export type KeySpecifier = string | readonly string[];

/**
 * The structure of a JSONLT header's $jsonlt field.
 */
export interface HeaderContent {
  /**
   * JSONLT specification version. Must be 1.
   */
  readonly version: 1;

  /**
   * Key specifier for records in this table.
   * If omitted, must be provided when opening the table.
   */
  readonly key?: KeySpecifier;

  /**
   * URI reference to a JSON Schema for validating records.
   * Mutually exclusive with `schema`.
   */
  readonly $schema?: string;

  /**
   * Embedded JSON Schema object for validating records.
   * Mutually exclusive with `$schema`.
   */
  readonly schema?: JsonObject;

  /**
   * Application-defined metadata.
   */
  readonly meta?: JsonObject;
}

/**
 * A JSONLT header line.
 *
 * The header contains the `$jsonlt` field with version and optional settings.
 * Additional fields may be present and are preserved but not processed.
 */
export interface Header {
  /**
   * The header content object.
   */
  readonly $jsonlt: HeaderContent;
}

/**
 * A record in a JSONLT table.
 *
 * Records are JSON objects that:
 * - Contain the key field(s) specified by the key specifier
 * - Do not contain any $-prefixed field names (reserved for JSONLT)
 */
export interface Record extends JsonObject {
  /**
   * Records can have any string keys except $-prefixed ones.
   */
  readonly [key: string]: JsonValue;
}

/**
 * A tombstone marking a deleted record.
 *
 * Tombstones contain:
 * - The key field(s) identifying the deleted record
 * - `$deleted: true` to mark the deletion
 */
export interface Tombstone extends JsonObject {
  readonly $deleted: true;
}

/**
 * An operation in a JSONLT file is either a record or a tombstone.
 */
export type Operation = Record | Tombstone;

/**
 * Options for creating or opening a Table.
 */
export interface TableOptions {
  /**
   * If true, create the file if it does not exist.
   * @defaultValue false
   */
  readonly create?: boolean;

  /**
   * If true, open the file in read-only mode.
   * @defaultValue false
   */
  readonly readOnly?: boolean;

  /**
   * Key specifier for records in this table.
   * Required when opening a file without a header.
   * Must match the header's key specifier if the file has one.
   */
  readonly key?: KeySpecifier;

  /**
   * If true, automatically reload the file when it changes.
   * @defaultValue false
   */
  readonly autoReload?: boolean;

  /**
   * Timeout in milliseconds for acquiring file locks.
   * @defaultValue 5000
   */
  readonly lockTimeout?: number;
}
