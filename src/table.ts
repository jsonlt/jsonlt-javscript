import type { Key, KeySpecifier, Record, TableOptions } from "./types.js";

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
 * // Create a new table with a key specifier
 * const table = await Table.open("data.jsonlt", { create: true, key: "id" });
 *
 * // Add a record
 * await table.put({ id: "user:1", name: "Alice", age: 30 });
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
  private readonly records: Map<string, Record>;
  private readonly filePath: string;
  private readonly keySpecifier: KeySpecifier;
  private readonly options: Required<Omit<TableOptions, "key">> & { key: KeySpecifier };

  private constructor(
    filePath: string,
    keySpecifier: KeySpecifier,
    records: Map<string, Record>,
    options: Required<Omit<TableOptions, "key">> & { key: KeySpecifier },
  ) {
    this.filePath = filePath;
    this.keySpecifier = keySpecifier;
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
   * @throws {KeyError} If key specifier is invalid or mismatched
   * @throws {IOError} If file cannot be read or created
   */
  static async open(filePath: string, options: TableOptions = {}): Promise<Table> {
    const resolvedOptions = {
      create: options.create ?? false,
      readOnly: options.readOnly ?? false,
      key: options.key ?? "id",
      autoReload: options.autoReload ?? false,
      lockTimeout: options.lockTimeout ?? 5000,
    };

    const records = new Map<string, Record>();

    // TODO: Implement file reading and parsing

    return new Table(filePath, resolvedOptions.key, records, resolvedOptions);
  }

  /**
   * Serializes a key to a string for Map storage.
   * @internal
   */
  private serializeKey(key: Key): string {
    if (typeof key === "string") {
      return key;
    }
    if (typeof key === "number") {
      return String(key);
    }
    // Tuple key - serialize as JSON for consistent comparison
    return JSON.stringify(key);
  }

  /**
   * Gets a record by its key.
   *
   * @param key - The record key
   * @returns The record if found, undefined otherwise
   */
  get(key: Key): Record | undefined {
    return this.records.get(this.serializeKey(key));
  }

  /**
   * Checks if a record with the given key exists.
   *
   * @param key - The record key
   * @returns True if the record exists, false otherwise
   */
  has(key: Key): boolean {
    return this.records.has(this.serializeKey(key));
  }

  /**
   * Inserts or updates a record in the table.
   *
   * If a record with the same key already exists, it will be updated.
   * The record is appended to the file.
   *
   * @param record - The record to insert or update
   * @throws {ValidationError} If the record is invalid
   * @throws {KeyError} If the key cannot be extracted
   * @throws {LimitError} If key or record size limits are exceeded
   */
  async put(record: Record): Promise<void> {
    // TODO: Implement file appending and key extraction
    // For now, just store in memory with a placeholder key
    const key = this.extractKeyFromRecord(record);
    this.records.set(this.serializeKey(key), record);
  }

  /**
   * Extracts the key from a record based on the key specifier.
   * @internal
   */
  private extractKeyFromRecord(record: Record): Key {
    // TODO: Implement proper key extraction with validation
    if (typeof this.keySpecifier === "string") {
      return record[this.keySpecifier] as Key;
    }
    // Tuple key
    return this.keySpecifier.map((field) => record[field]) as unknown as Key;
  }

  /**
   * Deletes a record by its key.
   *
   * A tombstone record is appended to the file.
   *
   * @param key - The record key to delete
   * @returns True if the record was deleted, false if it did not exist
   * @throws {KeyError} If the key is invalid
   */
  async delete(key: Key): Promise<boolean> {
    const serialized = this.serializeKey(key);
    if (!this.records.has(serialized)) {
      return false;
    }

    // TODO: Implement tombstone appending
    this.records.delete(serialized);
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
   * Note: Keys are returned as serialized strings. Use `all()` for
   * records with their original key values.
   *
   * @returns An iterator over all serialized keys
   */
  keys(): IterableIterator<string> {
    return this.records.keys();
  }

  /**
   * Returns all key-value pairs in the table.
   *
   * @returns An iterator over all entries
   */
  entries(): IterableIterator<[string, Record]> {
    return this.records.entries();
  }

  /**
   * Returns all records in key order.
   *
   * @returns An array of all records sorted by key
   */
  all(): Record[] {
    // TODO: Implement proper key ordering per spec
    return Array.from(this.records.values());
  }

  /**
   * Returns the number of records in the table.
   */
  get size(): number {
    return this.records.size;
  }

  /**
   * Alias for size property.
   */
  count(): number {
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

  /**
   * Returns the key specifier for this table.
   */
  get key(): KeySpecifier {
    return this.keySpecifier;
  }

  /**
   * Finds all records matching a predicate.
   *
   * @param predicate - A function that returns true for matching records
   * @returns An array of matching records
   */
  find(predicate: (record: Record) => boolean): Record[] {
    const results: Record[] = [];
    for (const record of this.records.values()) {
      if (predicate(record)) {
        results.push(record);
      }
    }
    return results;
  }

  /**
   * Finds the first record matching a predicate.
   *
   * @param predicate - A function that returns true for matching records
   * @returns The first matching record, or undefined if none found
   */
  findOne(predicate: (record: Record) => boolean): Record | undefined {
    for (const record of this.records.values()) {
      if (predicate(record)) {
        return record;
      }
    }
    return undefined;
  }

  /**
   * Removes all records from the table.
   *
   * This appends tombstones for all existing records.
   */
  async clear(): Promise<void> {
    // TODO: Implement tombstone appending for all records
    this.records.clear();
  }

  /**
   * Compacts the table by rewriting it with only the current state.
   *
   * This removes all historical operations and tombstones, leaving
   * only the current live records.
   */
  async compact(): Promise<void> {
    // TODO: Implement file compaction
  }
}
