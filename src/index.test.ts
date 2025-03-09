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
        act: ({ arrange }) => arrange.a + arrange.b,
        assert: ({ arrange, act }) => {
          expect(act).toBe(3);
          expect(arrange.a).toBe(1);
          expect(arrange.b).toBe(2);
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
        act: ({ arrange }) => ({
          displayName: `${arrange.user.name} (${arrange.user.age})`,
          ...arrange,
        }),
        assert: ({ arrange, act }) => {
          expect(act.displayName).toBe("Test User (30)");
          expect(act.user).toEqual(arrange.user);
          expect(act.permissions).toEqual(arrange.permissions);
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
        act: async ({ arrange }) => ({
          displayName: `${arrange.user.name} (${arrange.user.age})`,
          ...arrange,
        }),
        assert: async ({ arrange, act }) => {
          expect(act.displayName).toBe("Test User (30)");
          expect(act.user).toEqual(arrange.user);
          expect(act.permissions).toEqual(arrange.permissions);
        },
      }),
    );
  });

  describe("arrange omitted", () => {
    test(
      "Ability to perform simple calculations.",
      step({
        act: () => 1 + 2,
        assert: ({ act }) => {
          expect(act).toBe(3);
        },
      }),
    );

    test(
      "Supports asynchronous act.",
      step({
        act: async () => 1 + 2,
        assert: async ({ act }) => {
          expect(act).toBe(3);
        },
      }),
    );
  });
});
