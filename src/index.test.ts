import { describe, expect, test } from "vitest";
import { step } from ".";

describe("`step()`", () => {
  describe("with `arrange`", () => {
    test(
      "simple calculations",
      step({
        arrange: () => ({ a: 1, b: 2 }),
        act: ({ a, b }) => a + b,
        assert: (result, { a, b }) => {
          expect(result).toBe(3);
          expect(a).toBe(1);
          expect(b).toBe(2);
        },
      }),
    );

    test(
      "complex objects",
      step({
        arrange: () => ({
          user: { name: "Test User", age: 30 },
          permissions: ["read", "write"],
        }),
        act: ({ user, permissions }) => ({
          displayName: `${user.name} (${user.age})`,
          permissions,
        }),
        assert: (result, { permissions }) => {
          expect(result.displayName).toBe("Test User (30)");
          expect(result.permissions).toEqual(permissions);
        },
      }),
    );

    test(
      "async operations",
      step({
        arrange: async () => ({
          user: { name: "Test User", age: 30 },
          permissions: ["read", "write"],
        }),
        act: async ({ user, permissions }) => ({
          displayName: `${user.name} (${user.age})`,
          permissions,
        }),
        assert: async (result, { permissions }) => {
          expect(result.displayName).toBe("Test User (30)");
          expect(result.permissions).toEqual(permissions);
        },
      }),
    );
  });

  describe("without `arrange`", () => {
    test(
      "simple calculations",
      step({
        act: () => 1 + 2,
        assert: (result) => {
          expect(result).toBe(3);
        },
      }),
    );

    test(
      "async operations",
      step({
        act: async () => 1 + 2,
        assert: async (result) => {
          expect(result).toBe(3);
        },
      }),
    );
  });

  describe("`test.each` support", () => {
    describe("with `arrange`", () => {
      test.each([{ a: 1, b: 2, expected: 3 }])(
        "adds $a + $b = $expected",
        step({
          arrange: (testData) => ({ ...testData, multiplier: 1 }),
          act: ({ a, b, multiplier, expected }) => ({
            result: (a + b) * multiplier,
            expected,
          }),
          assert: ({ result, expected }) => {
            expect(result).toBe(expected);
          },
        }),
      );

      test.each([[1, 2, 3]])(
        "adds $a + $b = $expected",
        step({
          arrange: (a, b, expected) => ({
            a,
            b,
            expected,
          }),
          act: ({ a, b }) => ({
            result: a + b,
          }),
          assert: ({ result }, { expected }) => {
            expect(result).toBe(expected);
          },
        }),
      );
    });

    describe("without `arrange`", () => {
      test.each([{ a: 1, b: 2, expected: 3 }])(
        "adds $a + $b = $expected",
        step({
          act: ({ a, b, expected }) => ({
            result: a + b,
            expected,
          }),
          assert: ({ result, expected }) => {
            expect(result).toBe(expected);
          },
        }),
      );

      test.each([[1, 2, 3]])(
        "adds %s + %s = %s",
        step({
          act: (a, b, expected) => ({
            result: a + b,
            expected,
          }),
          assert: ({ result, expected }) => {
            expect(result).toBe(expected);
          },
        }),
      );
    });
  });
});
