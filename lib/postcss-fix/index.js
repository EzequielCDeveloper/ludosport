// PostCSS plugin to remove Tailwind v4 internal --color-* resolution patterns.
// These contain `var(--color-*)` with a wildcard that is invalid CSS
// and rejected by Turbopack's parser.
module.exports = () => ({
  postcssPlugin: "remove-tailwind-color-star",
  OnceExit(css) {
    css.walkRules((rule) => {
      if (rule.selector.includes("--color-\\*")) {
        rule.remove();
      }
    });
  },
});
module.exports.postcss = true;
