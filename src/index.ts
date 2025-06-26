type DefinitionWithArrange<ArrangeResult, ActResult, TestData> = {
  /**
   * Sets up the necessary preconditions for the test. This function can return either the result directly or a Promise that resolves to the result.
   *
   * **Arrange**
   *
   * @param testData The test data provided from `test.each` or similar test utilities.
   * @returns The result of the arrange phase or a Promise of the result.
   */
  arrange: (testData: TestData) => ArrangeResult | Promise<ArrangeResult>;
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

type DefinitionWithoutArrange<ActResult, TestData> = {
  /**
   * Performs the action being tested. This function can return either the result of the action directly or a Promise that resolves to the result.
   *
   * **Act**
   *
   * @param testData The test data provided from `test.each` or similar test utilities.
   * @returns The result of the act phase or a Promise of the result.
   */
  act: (testData: TestData) => ActResult | Promise<ActResult>;
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
 * @template TestData The type of the test data provided from `test.each` or similar test utilities.
 * @param definition The test definition object with `arrange`, `act`, and `assert` functions.
 * @returns The test function.
 */
export function step<ArrangeResult, ActResult, TestData = never>(
  definition: DefinitionWithArrange<ArrangeResult, ActResult, TestData>,
): (testData: TestData) => Promise<void>;
/**
 * Structures your tests following the Act-Assert pattern.
 *
 * @template ActResult The type of the result from the act phase.
 * @template TestData The type of the test data provided from `test.each` or similar test utilities.
 * @param definition The test definition object with `act` and `assert` functions.
 * @returns The test function.
 */
export function step<ActResult, TestData = never>(
  definition: DefinitionWithoutArrange<ActResult, TestData>,
): (testData: TestData) => Promise<void>;
/**
 * Structures your tests following the Arrange-Act-Assert (AAA) pattern, improving readability and maintainability.
 *
 * This function takes a test definition object, which can either include an `arrange` function for setting up preconditions,
 * an `act` function for performing the action under test, and an `assert` function for verifying the result,
 * or just an `act` and `assert` function for simpler test cases.
 *
 * Supports `test.each` and similar test utilities by accepting test data as a parameter.
 *
 * @template ArrangeResult The type of the result from the arrange phase (if applicable).
 * @template ActResult The type of the result from the act phase.
 * @template TestData The type of the test data provided from `test.each` or similar test utilities.
 * @param definition The test definition object.
 * @returns A function that encapsulates the test logic, ready to be executed by a test runner.
 */
export function step<ArrangeResult, ActResult, TestData = never>(
  definition:
    | DefinitionWithArrange<ArrangeResult, ActResult, TestData>
    | DefinitionWithoutArrange<ActResult, TestData>,
): () => Promise<void> {
  return async (testData?: TestData) => {
    const actArg =
      "arrange" in definition
        ? // Even though `definition.arrange()` might not return a Promise, we await it uniformly
          await definition.arrange(testData as TestData)
        : testData;
    // Even though `definition.act()` might not return a Promise, we await it uniformly
    const actResult = await definition.act(actArg as ArrangeResult & TestData);
    await definition.assert(actResult, actArg as ArrangeResult);
  };
}
