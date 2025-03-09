import { describe, expect, test } from "vitest";
import { step } from ".";

describe("`step()`", () => {
  describe("with arrange specified", () => {
    test(
      "can perform simple calculations",
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
      "can pass complex objects around",
      step({
        arrange: () => ({
          user: {
            name: "テストユーザー",
            age: 30,
          },
          permissions: ["read", "write"],
        }),
        act: ({ arrange }) => ({
          displayName: `${arrange.user.name} (${arrange.user.age})`,
          ...arrange,
        }),
        assert: ({ arrange, act }) => {
          expect(act.displayName).toBe("テストユーザー (30)");
          expect(act.user).toEqual(arrange.user);
          expect(act.permissions).toEqual(arrange.permissions);
        },
      }),
    );
  });

  describe("arrange omitted", () => {
    test(
      "can perform simple calculations",
      step({
        act: () => 1 + 2,
        assert: ({ act }) => {
          expect(act).toBe(3);
        },
      }),
    );
  });
});
