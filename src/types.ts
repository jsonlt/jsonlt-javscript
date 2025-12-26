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
 * A valid record key (must be a non-empty string).
 */
export type RecordKey = string;

/**
 * A record in a JSONLT table.
 *
 * The `_key` field is required and must be a non-empty string.
 * All other fields are optional and can contain any valid JSON value.
 */
export interface Record extends JsonObject {
  readonly _key: RecordKey;
}

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
}
