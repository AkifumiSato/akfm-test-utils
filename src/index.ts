type DefinitionWithArrange<Arrange, Act> = {
  arrange: () => Arrange;
  act: (context: { arrange: Arrange }) => Act;
  assert: (context: { arrange: Arrange; act: Act }) => void;
};

type DefinitionWithoutArrange<Act> = {
  act: () => Act;
  assert: (context: { act: Act }) => void;
};

export function step<Arrange, Act>(
  definition: DefinitionWithArrange<Arrange, Act>,
): () => void;
export function step<Act>(
  definition: DefinitionWithoutArrange<Act>,
): () => void;
export function step<Arrange, Act>(
  definition:
    | DefinitionWithArrange<Arrange, Act>
    | DefinitionWithoutArrange<Act>,
): () => void {
  return () => {
    // narrowing type
    if ("arrange" in definition) {
      const arrange = definition.arrange();
      const act = definition.act({ arrange });
      definition.assert({ arrange, act });
    } else {
      const act = definition.act();
      definition.assert({ act });
    }
  };
}

/**
 * TODO
 * - [ ] 非同期対応
 * - [ ] Arrangeの共通化を促す（ArrangeFactory?）
 */
