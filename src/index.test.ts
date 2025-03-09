import { describe, expect, test } from "vitest";
import { step } from ".";

describe("`step()`", () => {
  describe("with arrange specified", () => {
    test(
      "Ability to perform simple calculations.",
      step({
        arrange: () => ({
          a: 1,
          b: 2,
        }),
        act: ({ a, b }) => a + b,
        assert: (result, { a, b }) => {
          expect(result).toBe(3);
          expect(a).toBe(1);
          expect(b).toBe(2);
        },
      }),
    );

    test(
      "Ability to pass complex objects around.",
      step({
        arrange: () => ({
          user: {
            name: "Test User",
            age: 30,
          },
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
      "Supports asynchronous arrange, act, assert.",
      step({
        arrange: async () => ({
          user: {
            name: "Test User",
            age: 30,
          },
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

  describe("arrange omitted", () => {
    test(
      "Ability to perform simple calculations.",
      step({
        act: () => 1 + 2,
        assert: (result) => {
          expect(result).toBe(3);
        },
      }),
    );

    test(
      "Supports asynchronous act.",
      step({
        act: async () => 1 + 2,
        assert: async (result) => {
          expect(result).toBe(3);
        },
      }),
    );
  });
});
