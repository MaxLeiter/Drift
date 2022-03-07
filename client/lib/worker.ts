import { expose } from "comlink";

async function RemarkPipeline(disallowedElements, markdown) {
  const markdownConverter = RemarkParseRemark()
    .use([
      RemarkParse,
      ...remarkPlugins,
      [
        RehypeUnwrap,
        { disallowedElements: disallowedElements, unwrapDisallowed: true },
      ],
    ])
    .freeze();
  const parsed = markdownConverter.parse(markdown);
  const transformed = await markdownConverter.run(parsed);
  return transformed;
}

expose(RemarkPipeline);
