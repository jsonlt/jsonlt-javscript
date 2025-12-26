import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: false,
    include: ["tests/**/*.test.ts"],
    exclude: ["tests/benchmarks/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.d.ts", "src/version.ts"],
    },
    typecheck: {
      enabled: true,
    },
    projects: [
      {
        test: {
          name: "unit",
          include: ["tests/unit/**/*.test.ts"],
        },
      },
      {
        test: {
          name: "conformance",
          include: ["tests/conformance/**/*.test.ts"],
        },
      },
      {
        test: {
          name: "integration",
          include: ["tests/integration/**/*.test.ts"],
        },
      },
      {
        test: {
          name: "properties",
          include: ["tests/properties/**/*.test.ts"],
        },
      },
      {
        test: {
          name: "examples",
          include: ["tests/examples/**/*.test.ts"],
        },
      },
    ],
  },
});
