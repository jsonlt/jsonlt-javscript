import type { Record, RecordKey, TableOptions } from "./types.js";

/**
 * A Table represents a JSONLT file as an in-memory key-value store.
 *
 * Tables are append-only: records are added or updated by appending to the file.
 * The current state is computed by replaying all records in order.
 *
 * @example
 * ```typescript
 * import { Table } from "@jsonlt/jsonlt";
 *
 * // Create a new table
 * const table = await Table.open("data.jsonlt", { create: true });
 *
 * // Add a record
 * await table.set({ _key: "user:1", name: "Alice", age: 30 });
 *
 * // Get a record
 * const user = table.get("user:1");
 * console.log(user?.name); // "Alice"
 *
 * // Delete a record
 * await table.delete("user:1");
 * ```
 */
export class Table {
  private readonly records: Map<RecordKey, Record>;
  private readonly filePath: string;
  private readonly options: Required<TableOptions>;

  private constructor(
    filePath: string,
    records: Map<RecordKey, Record>,
    options: Required<TableOptions>,
  ) {
    this.filePath = filePath;
    this.records = records;
    this.options = options;
  }

  /**
   * Opens a JSONLT file and returns a Table instance.
   *
   * @param filePath - Path to the JSONLT file
   * @param options - Options for opening the table
   * @returns A Promise that resolves to the Table instance
   * @throws {ParseError} If the file contains invalid JSONL
   * @throws {ValidationError} If a record is missing the _key field
   */
  static async open(filePath: string, options: TableOptions = {}): Promise<Table> {
    const resolvedOptions: Required<TableOptions> = {
      create: options.create ?? false,
      readOnly: options.readOnly ?? false,
    };

    const records = new Map<RecordKey, Record>();

    // TODO: Implement file reading and parsing

    return new Table(filePath, records, resolvedOptions);
  }

  /**
   * Gets a record by its key.
   *
   * @param key - The record key
   * @returns The record if found, undefined otherwise
   */
  get(key: RecordKey): Record | undefined {
    return this.records.get(key);
  }

  /**
   * Checks if a record with the given key exists.
   *
   * @param key - The record key
   * @returns True if the record exists, false otherwise
   */
  has(key: RecordKey): boolean {
    return this.records.has(key);
  }

  /**
   * Sets a record in the table.
   *
   * If a record with the same key already exists, it will be updated.
   * The record is appended to the file.
   *
   * @param record - The record to set
   * @throws {ValidationError} If the record is missing the _key field
   */
  async set(record: Record): Promise<void> {
    // TODO: Implement file appending
    this.records.set(record._key, record);
  }

  /**
   * Deletes a record by its key.
   *
   * A tombstone record is appended to the file.
   *
   * @param key - The record key to delete
   * @returns True if the record was deleted, false if it did not exist
   */
  async delete(key: RecordKey): Promise<boolean> {
    if (!this.records.has(key)) {
      return false;
    }

    // TODO: Implement tombstone appending
    this.records.delete(key);
    return true;
  }

  /**
   * Returns all records in the table.
   *
   * @returns An iterator over all records
   */
  values(): IterableIterator<Record> {
    return this.records.values();
  }

  /**
   * Returns all keys in the table.
   *
   * @returns An iterator over all keys
   */
  keys(): IterableIterator<RecordKey> {
    return this.records.keys();
  }

  /**
   * Returns all key-value pairs in the table.
   *
   * @returns An iterator over all entries
   */
  entries(): IterableIterator<[RecordKey, Record]> {
    return this.records.entries();
  }

  /**
   * Returns the number of records in the table.
   */
  get size(): number {
    return this.records.size;
  }

  /**
   * Returns the file path of the table.
   */
  get path(): string {
    return this.filePath;
  }

  /**
   * Returns whether the table is in read-only mode.
   */
  get isReadOnly(): boolean {
    return this.options.readOnly;
  }
}
