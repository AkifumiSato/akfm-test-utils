type DefinitionWithArrange<ArrangeResult, ActResult> = {
  arrange: () => ArrangeResult | Promise<ArrangeResult>;
  act: (arrange: ArrangeResult) => ActResult | Promise<ActResult>;
  assert: (result: ActResult, arrange: ArrangeResult) => void | Promise<void>;
};

type DefinitionWithoutArrange<ActResult> = {
  act: () => ActResult | Promise<ActResult>;
  assert: (result: ActResult) => void | Promise<void>;
};

export function step<ArrangeResult, ActResult>(
  definition: DefinitionWithArrange<ArrangeResult, ActResult>,
): () => void;
export function step<ActResult>(
  definition: DefinitionWithoutArrange<ActResult>,
): () => void;
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
