import { describe, expect, test } from "vitest";
import { stepTest } from "./index";

describe("stepTest", () => {
  test(
    "arrange指定あり",
    stepTest({
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
    "arrange指定なし",
    stepTest({
      arrange: () => {},
      act: () => 1 + 2,
      assert: ({ act }) => {
        expect(act).toBe(3);
      },
    }),
  );

  test(
    "複雑なオブジェクトでも動作する",
    stepTest({
      arrange: () => ({
        user: {
          name: "テストユーザー",
          age: 30,
        },
        permissions: ["read", "write"],
      }),
      act: ({ arrange }) => ({
        displayName: `${arrange.user.name} (${arrange.user.age})`,
        isAdmin: arrange.permissions.includes("admin"),
      }),
      assert: ({ arrange, act }) => {
        expect(act.displayName).toBe("テストユーザー (30)");
        expect(act.isAdmin).toBe(false);
        expect(arrange.permissions).toHaveLength(2);
      },
    }),
  );
});
