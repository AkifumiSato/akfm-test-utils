type TestDefinitionWithArrange<Arrange, Act> = {
  arrange: () => Arrange;
  act: (context: { arrange: Arrange }) => Act;
  assert: (context: { arrange: Arrange; act: Act }) => void;
};

type TestDefinitionWithoutArrange<Act> = {
  act: () => Act;
  assert: (context: { act: Act }) => void;
};

type TestDefinition<Arrange, Act> =
  | TestDefinitionWithArrange<Arrange, Act>
  | TestDefinitionWithoutArrange<Act>;

export function step<Arrange, Act>(
  testDefinition: TestDefinitionWithArrange<Arrange, Act>,
): () => void;
export function step<Act>(
  testDefinition: TestDefinitionWithoutArrange<Act>,
): () => void;
export function step<Arrange, Act>(
  testDefinition: TestDefinition<Arrange, Act>,
): () => void {
  return () => {
    if ("arrange" in testDefinition) {
      const arrange = testDefinition.arrange();
      const act = testDefinition.act({ arrange });
      testDefinition.assert({ arrange, act });
    } else {
      const act = testDefinition.act();
      testDefinition.assert({ act });
    }
  };
}

/**
 * TODO
 * - [ ] 非同期対応
 */
