# @akfm/test-utils

Utility for test.

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

### `step<Arrange, Act>(definition: Definition<Arrange, Act>): () => void`

The `step()` function structures your tests following the Arrange-Act-Assert (AAA) pattern, improving readability and maintainability.

#### Type Definition

```ts
type Definition<Arrange, Act> =
  | {
      arrange: () => Arrange | Promise<Arrange>;
      act: (context: { arrange: Arrange }) => Act | Promise<Act>;
      assert: (context: { arrange: Arrange; act: Act }) => void | Promise<void>;
    }
  | {
      act: () => Act | Promise<Act>;
      assert: (context: { act: Act }) => void | Promise<void>;
    };
```

#### Arguments

- `definition: Definition<Arrange, Act>`: The test definition object.
  - `arrange?: () => Arrange | Promise<Arrange>`: A function that performs test preparation (optional).
  - `act: (context: { arrange: Arrange } | undefined) => Act | Promise<Act>`: A function that performs test execution.
  - `assert: (context: { arrange?: Arrange; act: Act }) => void | Promise<void>`: A function that verifies the test result.

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
    act: ({ arrange: { user, permissions } }) =>
      formatterUser(user, permissions),
    assert: ({ arrange, act }) => {
      expect(act.displayName).toBe("Test User (30)");
      expect(act.permissions).toEqual(arrange.permissions);
    },
  }),
);
```
