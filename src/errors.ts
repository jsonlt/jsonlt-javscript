/**
 * Base error class for all JSONLT errors.
 */
export class JSONLTError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JSONLTError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Error thrown when parsing JSONL content fails.
 *
 * A parse error occurs when reading a JSONLT file due to malformed content:
 * - Invalid JSON syntax
 * - Invalid UTF-8 encoding
 * - Empty lines (whitespace-only)
 * - Duplicate keys in JSON objects
 * - Invalid header structure
 * - Invalid tombstone ($deleted with non-boolean value)
 * - Header appearing after first line
 * - Unsupported version number
 */
export class ParseError extends JSONLTError {
  readonly line: number;
  readonly column: number | undefined;

  constructor(message: string, line: number, column?: number) {
    super(
      `Parse error at line ${line}${column !== undefined ? `, column ${column}` : ""}: ${message}`,
    );
    this.name = "ParseError";
    this.line = line;
    this.column = column;
  }
}

/**
 * Error thrown when a key operation fails.
 *
 * A key error occurs when a key or key specifier is invalid or inconsistent:
 * - Missing key field in record
 * - Invalid key type (null, boolean, object, array when not tuple)
 * - Numeric key with fractional component
 * - Numeric key outside safe integer range (±2^53-1)
 * - Empty key specifier
 * - Duplicate field names in key specifier
 * - Key specifier mismatch between header and caller
 */
export class KeyError extends JSONLTError {
  readonly key: unknown;
  readonly field: string | undefined;

  constructor(message: string, key?: unknown, field?: string) {
    const keyStr = key !== undefined ? `: ${JSON.stringify(key)}` : "";
    const fieldStr = field !== undefined ? ` (field: "${field}")` : "";
    super(`Key error${fieldStr}${keyStr}: ${message}`);
    this.name = "KeyError";
    this.key = key;
    this.field = field;
  }
}

/**
 * Error thrown when record validation fails.
 *
 * A validation error occurs when a record violates JSONLT constraints:
 * - Record contains $-prefixed fields (reserved for JSONLT)
 * - Record is not a JSON object
 */
export class ValidationError extends JSONLTError {
  readonly field: string | undefined;

  constructor(message: string, field?: string) {
    super(
      field !== undefined
        ? `Validation error in field "${field}": ${message}`
        : `Validation error: ${message}`,
    );
    this.name = "ValidationError";
    this.field = field;
  }
}

/**
 * Error thrown when file system operations fail.
 *
 * An IO error occurs during file system operations:
 * - File cannot be read due to permissions or I/O errors
 * - File cannot be written due to permissions or I/O errors
 * - File does not exist and create mode is not enabled
 */
export class IOError extends JSONLTError {
  readonly path: string;
  override readonly cause: Error | undefined;

  constructor(message: string, path: string, cause?: Error) {
    super(`IO error for "${path}": ${message}`);
    this.name = "IOError";
    this.path = path;
    this.cause = cause;
  }
}

/**
 * Error thrown when file locking fails.
 *
 * A lock error occurs when file locking operations fail:
 * - Lock acquisition times out
 * - Lock cannot be acquired due to contention
 */
export class LockError extends JSONLTError {
  readonly path: string;
  readonly timeout: number | undefined;

  constructor(message: string, path: string, timeout?: number) {
    const timeoutStr = timeout !== undefined ? ` (timeout: ${timeout}ms)` : "";
    super(`Lock error for "${path}"${timeoutStr}: ${message}`);
    this.name = "LockError";
    this.path = path;
    this.timeout = timeout;
  }
}

/**
 * Error thrown when content exceeds implementation limits.
 *
 * A limit error occurs when:
 * - Key length exceeds maximum (1024 bytes)
 * - Record size exceeds maximum (1 MiB)
 * - Nesting depth exceeds maximum (64 levels)
 * - Tuple key exceeds maximum elements (16)
 */
export class LimitError extends JSONLTError {
  readonly limitName: string;
  readonly actual: number;
  readonly maximum: number;

  constructor(limitName: string, actual: number, maximum: number) {
    super(`Limit exceeded: ${limitName} is ${actual}, maximum is ${maximum}`);
    this.name = "LimitError";
    this.limitName = limitName;
    this.actual = actual;
    this.maximum = maximum;
  }
}

/**
 * Error thrown when a transaction operation fails.
 *
 * A conflict error occurs when a transaction commit detects that another
 * process has modified a key that the transaction also modified.
 */
export class ConflictError extends JSONLTError {
  readonly keys: unknown[];

  constructor(message: string, keys: unknown[]) {
    super(`Conflict error: ${message}`);
    this.name = "ConflictError";
    this.keys = keys;
  }
}

/**
 * Error thrown for general transaction errors.
 *
 * A transaction error occurs when:
 * - A nested transaction is attempted
 * - A commit fails due to conflict
 */
export class TransactionError extends JSONLTError {
  constructor(message: string) {
    super(`Transaction error: ${message}`);
    this.name = "TransactionError";
  }
}
