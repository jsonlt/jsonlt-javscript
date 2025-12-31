/**
 * JSONLT specification constants and implementation limits.
 *
 * These values define the mandatory limits per the JSONLT specification.
 * Implementations MAY support larger limits but MUST support at least these.
 */

/**
 * Current JSONLT specification version.
 */
export const SPEC_VERSION = 1;

/**
 * Maximum key length in bytes when serialized as JSON.
 *
 * The key length is measured as the byte length of the JSON serialization:
 * - For strings: includes the enclosing quotes and any escape sequences
 * - For integers: the decimal string representation
 * - For tuples: the entire array notation including brackets and commas
 *
 * Example: `"user_12345"` has key length 12 (10 chars + 2 quotes)
 */
export const MAX_KEY_LENGTH = 1024;

/**
 * Maximum record size in bytes when serialized as JSON.
 *
 * This is the byte length of the entire JSON line (excluding the newline).
 */
export const MAX_RECORD_SIZE = 1048576; // 1 MiB

/**
 * Maximum JSON nesting depth.
 *
 * This limits how deeply objects and arrays can be nested to prevent
 * stack overflow during parsing of deeply recursive structures.
 */
export const MAX_NESTING_DEPTH = 64;

/**
 * Maximum number of elements in a tuple key.
 *
 * Tuple keys may have 1-16 elements. Zero elements is invalid.
 */
export const MAX_TUPLE_ELEMENTS = 16;

/**
 * Minimum safe integer value for numeric keys.
 *
 * This matches JavaScript's Number.MIN_SAFE_INTEGER: -(2^53 - 1)
 */
export const MIN_SAFE_INTEGER = -9007199254740991; // -(2^53 - 1)

/**
 * Maximum safe integer value for numeric keys.
 *
 * This matches JavaScript's Number.MAX_SAFE_INTEGER: 2^53 - 1
 */
export const MAX_SAFE_INTEGER = 9007199254740991; // 2^53 - 1

/**
 * Default timeout for acquiring file locks in milliseconds.
 */
export const DEFAULT_LOCK_TIMEOUT = 5000;
