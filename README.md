# @akfm/test-utils

[![npm version](https://badge.fury.io/js/@akfm%2Ftest-utils.svg)](https://badge.fury.io/js/@akfm%2Ftest-utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Utility for test with 0 dependencies. This is a very lightweight and simple utility for writing tests.

## Features

- Provides utilities to support the AAA (Arrange-Act-Assert) pattern.

## Install

```bash
# npm
npm install @akfm/test-utils
# pnpm
pnpm add @akfm/test-utils
# yarn
yarn add @akfm/test-utils
```

## API

### `step(definition)`

The `step()` function structures your tests following the Arrange-Act-Assert (AAA) pattern, improving readability and maintainability.

#### Type Definition

```ts
type Definition<ArrangeResult, ActResult, TestData> =
  | {
      // `testData` is only provided when `step` is used with `test.each`
      arrange: (testData: TestData) => ArrangeResult | Promise<ArrangeResult>;
      act: (arrange: ArrangeResult) => ActResult | Promise<ActResult>;
      assert: (
        result: ActResult,
        arrange: ArrangeResult,
      ) => void | Promise<void>;
    }
  | {
      // `testData` is only provided when `step` is used with `test.each`
      act: (testData: TestData) => ActResult | Promise<ActResult>;
      assert: (result: ActResult) => void | Promise<void>;
    };
```

#### Arguments

- `definition: Definition<ArrangeResult, ActResult, TestData>`: The test definition object.
  - `arrange?: (testData: TestData) => ArrangeResult | Promise<ArrangeResult>`: A function that performs test preparation (optional). `testData` is only provided when `step` is used with `test.each`.
  - `act: (arrange?: ArrangeResult | testData: TestData) => ActResult | Promise<ActResult>`: A function that performs test execution. `testData` is only provided when `step` is used with `test.each` and `arrange` is not provided.
  - `assert: (result: ActResult, arrange?: ArrangeResult) => void | Promise<void>`: A function that verifies the test result.

#### Returns

- `() => void`: The test function.

#### Usage

```ts
import { describe, expect, test } from "vitest";
import { step } from "@akfm/test-utils";

// ...

// test of `formatterUser()` example.
test(
  "Formats user details and permissions as expected.",
  step({
    arrange: () => ({
      user: {
        name: "Test User",
        age: 30,
      },
      permissions: ["read", "write"],
    }),
    act: ({ user, permissions }) => formatterUser(user, permissions),
    assert: (result, { permissions }) => {
      expect(result.displayName).toBe("Test User (30)");
      expect(result.permissions).toEqual(permissions);
    },
  }),
);

// With `test.each`
test.each([
  { a: 1, b: 2, expected: 3 },
  { a: 2, b: 3, expected: 5 },
])(
  "adds $a + $b = $expected",
  step({
    // `testData` is `{ a: number; b: number; expected: number }`
    arrange: (testData) => ({ ...testData, multiplier: 1 }),
    act: ({ a, b, multiplier }) => a + b * multiplier,
    assert: (result, { expected }) => expect(result).toBe(expected),
  }),
);
```

#### Note: AAA

The AAA (Arrange-Act-Assert) pattern is a common way to structure unit tests. It involves dividing a test into three distinct sections:

- Arrange: Set up the necessary preconditions for the test.
- Act: Execute the code being tested.
- Assert: Verify that the code behaves as expected.
