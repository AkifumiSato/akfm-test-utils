type TestDefinition<Arrange, Act> = {
  arrange: () => Arrange;
  act: (context: { arrange: Arrange }) => Act;
  assert: (context: { arrange: Arrange; act: Act }) => void;
};

export const stepTest = <Arrange, Act>(
  testDefinition: TestDefinition<Arrange, Act>,
) => {
  return () => {
    const arrange = testDefinition.arrange();
    const act = testDefinition.act({ arrange });
    testDefinition.assert({ arrange, act });
  };
};

/**
 * TODO
 * - [ ] arrangeを省略可能に
 */
