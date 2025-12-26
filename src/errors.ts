/**
 * Base error class for all JSONLT errors.
 */
export class JsonltError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JsonltError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Error thrown when parsing JSONL content fails.
 */
export class ParseError extends JsonltError {
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
 * Error thrown when a key operation fails (e.g., key not found, duplicate key).
 */
export class KeyError extends JsonltError {
  readonly key: string;

  constructor(message: string, key: string) {
    super(`${message}: "${key}"`);
    this.name = "KeyError";
    this.key = key;
  }
}

/**
 * Error thrown when record validation fails.
 */
export class ValidationError extends JsonltError {
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
