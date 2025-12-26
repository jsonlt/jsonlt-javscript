import { describe, expect, it } from "vitest";
import { Table } from "../../src/table.js";
import type { Record } from "../../src/types.js";

describe("Table", () => {
  describe("open", () => {
    it("should create a new table instance", async () => {
      const table = await Table.open("/tmp/test.jsonlt", { create: true });
      expect(table).toBeInstanceOf(Table);
    });

    it("should return an empty table for a new file", async () => {
      const table = await Table.open("/tmp/test.jsonlt", { create: true });
      expect(table.size).toBe(0);
    });
  });

  describe("get/set", () => {
    it("should store and retrieve a record", async () => {
      const table = await Table.open("/tmp/test.jsonlt", { create: true });
      const record: Record = { _key: "test:1", name: "Test", value: 42 };

      await table.set(record);
      const retrieved = table.get("test:1");

      expect(retrieved).toEqual(record);
    });

    it("should return undefined for non-existent key", async () => {
      const table = await Table.open("/tmp/test.jsonlt", { create: true });
      expect(table.get("nonexistent")).toBeUndefined();
    });
  });

  describe("has", () => {
    it("should return true for existing key", async () => {
      const table = await Table.open("/tmp/test.jsonlt", { create: true });
      await table.set({ _key: "test:1", value: 1 });

      expect(table.has("test:1")).toBe(true);
    });

    it("should return false for non-existent key", async () => {
      const table = await Table.open("/tmp/test.jsonlt", { create: true });
      expect(table.has("nonexistent")).toBe(false);
    });
  });

  describe("delete", () => {
    it("should remove an existing record", async () => {
      const table = await Table.open("/tmp/test.jsonlt", { create: true });
      await table.set({ _key: "test:1", value: 1 });

      const deleted = await table.delete("test:1");

      expect(deleted).toBe(true);
      expect(table.has("test:1")).toBe(false);
    });

    it("should return false when deleting non-existent key", async () => {
      const table = await Table.open("/tmp/test.jsonlt", { create: true });
      const deleted = await table.delete("nonexistent");

      expect(deleted).toBe(false);
    });
  });

  describe("iteration", () => {
    it("should iterate over all values", async () => {
      const table = await Table.open("/tmp/test.jsonlt", { create: true });
      await table.set({ _key: "a", value: 1 });
      await table.set({ _key: "b", value: 2 });

      const values = [...table.values()];
      expect(values).toHaveLength(2);
    });

    it("should iterate over all keys", async () => {
      const table = await Table.open("/tmp/test.jsonlt", { create: true });
      await table.set({ _key: "a", value: 1 });
      await table.set({ _key: "b", value: 2 });

      const keys = [...table.keys()];
      expect(keys).toEqual(expect.arrayContaining(["a", "b"]));
    });
  });
});
