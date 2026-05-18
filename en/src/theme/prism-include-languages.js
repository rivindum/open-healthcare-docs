import siteConfig from '@generated/docusaurus.config';

export default function prismIncludeLanguages(PrismObject) {
  const {
    themeConfig: { prism },
  } = siteConfig;
  const { additionalLanguages = [] } = prism || {};

  // Prism components enhance the global Prism instance.
  globalThis.Prism = PrismObject;

  additionalLanguages.forEach((lang) => {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    require(`prismjs/components/prism-${lang}`);
  });

  // Register custom Ballerina grammar on the same Prism instance Docusaurus uses.
  PrismObject.languages.ballerina = {
    comment: [
      { pattern: /\/\/.*$/m, greedy: true },
      { pattern: /\/\*[\s\S]*?\*\//, greedy: true },
    ],
    string: [
      { pattern: /`(?:[^\\`]|\\.)*`/, greedy: true },
      { pattern: /"(?:[^\\"\r\n]|\\.)*"/, greedy: true },
    ],
    annotation: {
      pattern: /@(?:[\w.]+)/,
      alias: 'builtin',
    },
    'class-name': /\b[a-z]\w*:[A-Z]\w*\b/,
    'type-name': {
      pattern: /\b[A-Z]\w*\b/,
      alias: 'class-name',
    },
    keyword:
      /\b(?:import|as|public|private|external|final|service|resource|function|object|record|annotation|type|typedesc|new|map|future|error|stream|table|transaction|from|on|returns|return|match|foreach|in|while|do|if|else|fork|worker|wait|start|flush|send|receive|check|checkpanic|trap|panic|fail|is|typeof|var|const|configurable|isolated|transactional|rollback|commit|retry|lock|enum|class|distinct|readonly|any|anydata|never|byte|int|float|boolean|string|decimal|json|xml|handle|xmlns|listener|client|let|where|select|limit|join|outer|order|by|ascending|descending|equals|conflict|version)\b/,
    boolean: /\b(?:true|false)\b/,
    nil: {
      pattern: /\(\s*\)/,
      alias: 'constant',
    },
    number:
      /\b0[xX][\da-fA-F]+\b|\b0[oO][0-7]+\b|\b0[bB][01]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[eE][+-]?\d+)?(?:d|f)?\b/,
    operator: /->|=>|::|\.\.\.?|[+\-*/%^&|~!=<>?:]+/,
    punctuation: /[{}[\];(),.:]/,
  };

  delete globalThis.Prism;
}
