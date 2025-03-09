type DefinitionWithArrange<Arrange, Act> = {
  arrange: () => Arrange | Promise<Arrange>;
  act: (context: { arrange: Arrange }) => Act | Promise<Act>;
  assert: (context: { arrange: Arrange; act: Act }) => void | Promise<void>;
};

type DefinitionWithoutArrange<Act> = {
  act: () => Act | Promise<Act>;
  assert: (context: { act: Act }) => void | Promise<void>;
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
  return async () => {
    // narrowing type
    if ("arrange" in definition) {
      const arrangeResult = definition.arrange();
      const arrange =
        arrangeResult instanceof Promise ? await arrangeResult : arrangeResult;
      const actResult = definition.act({ arrange });
      const act = actResult instanceof Promise ? await actResult : actResult;
      await definition.assert({ arrange, act });
    } else {
      const actResult = definition.act();
      const act = actResult instanceof Promise ? await actResult : actResult;
      await definition.assert({ act });
    }
  };
}

/**
 * TODO
 * - [ ] Arrangeの共通化を促す（ArrangeFactory?）
 */
