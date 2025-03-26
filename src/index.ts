type DefinitionWithArrange<ArrangeResult, ActResult> = {
  /**
   * Sets up the necessary preconditions for the test. This function can return either the result directly or a Promise that resolves to the result.
   *
   * **Arrange**
   *
   * @returns The result of the arrange phase or a Promise of the result.
   */
  arrange: () => ArrangeResult | Promise<ArrangeResult>;
  /**
   * Performs the action being tested, utilizing the result from the arrange phase. This function can return either the result of the action directly or a Promise that resolves to the result.
   *
   * **Act**
   *
   * @param arrange The result from the arrange phase.
   * @returns The result of the act phase or a Promise of the result.
   */
  act: (arrange: ArrangeResult) => ActResult | Promise<ActResult>;
  /**
   * Verifies the outcome of the action, using both the result of the action and the result from the arrange phase. This function can optionally return a Promise that resolves when the assertion is complete.
   *
   * **Assert**
   *
   * @param result The result from the act phase.
   * @param arrange The result from the arrange phase.
   * @returns void or a Promise that resolves when the assertion is complete.
   */
  assert: (result: ActResult, arrange: ArrangeResult) => void | Promise<void>;
};

type DefinitionWithoutArrange<ActResult> = {
  /**
   * Performs the action being tested. This function can return either the result of the action directly or a Promise that resolves to the result.
   *
   * **Act**
   *
   * @returns The result of the act phase or a Promise of the result.
   */
  act: () => ActResult | Promise<ActResult>;
  /**
   * Verifies the outcome of the action. This function can optionally return a Promise that resolves when the assertion is complete.
   *
   * **Assert**
   *
   * @param result The result from the act phase.
   * @returns void or a Promise that resolves when the assertion is complete.
   */
  assert: (result: ActResult) => void | Promise<void>;
};

/**
 * Structures your tests following the Arrange-Act-Assert (AAA) pattern, improving readability and maintainability.
 *
 * @template ArrangeResult The type of the result from the arrange phase.
 * @template ActResult The type of the result from the act phase.
 * @param definition The test definition object with `arrange`, `act`, and `assert` functions.
 * @returns The test function.
 */
export function step<ArrangeResult, ActResult>(
  definition: DefinitionWithArrange<ArrangeResult, ActResult>,
): () => void;
/**
 * Structures your tests following the Act-Assert pattern.
 *
 * @template ActResult The type of the result from the act phase.
 * @param definition The test definition object with `act` and `assert` functions.
 * @returns The test function.
 */
export function step<ActResult>(
  definition: DefinitionWithoutArrange<ActResult>,
): () => void;
/**
 * Structures your tests following the Arrange-Act-Assert (AAA) pattern, improving readability and maintainability.
 *
 * This function takes a test definition object, which can either include an `arrange` function for setting up preconditions,
 * an `act` function for performing the action under test, and an `assert` function for verifying the result,
 * or just an `act` and `assert` function for simpler test cases.
 *
 * @template ArrangeResult The type of the result from the arrange phase (if applicable).
 * @template ActResult The type of the result from the act phase.
 * @param definition The test definition object.
 * @returns A function that encapsulates the test logic, ready to be executed by a test runner.
 */
export function step<ArrangeResult, ActResult>(
  definition:
    | DefinitionWithArrange<ArrangeResult, ActResult>
    | DefinitionWithoutArrange<ActResult>,
): () => void {
  return async () => {
    // narrowing type
    if ("arrange" in definition) {
      const arrangeMaybePromise = definition.arrange();
      const arrangeResult =
        arrangeMaybePromise instanceof Promise
          ? await arrangeMaybePromise
          : arrangeMaybePromise;
      const actMaybePromise = definition.act(arrangeResult);
      const actResult =
        actMaybePromise instanceof Promise
          ? await actMaybePromise
          : actMaybePromise;
      await definition.assert(actResult, arrangeResult);
    } else {
      const actMaybePromise = definition.act();
      const actResult =
        actMaybePromise instanceof Promise
          ? await actMaybePromise
          : actMaybePromise;
      await definition.assert(actResult);
    }
  };
}
