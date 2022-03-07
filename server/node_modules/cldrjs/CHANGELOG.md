# 0.4.0

## Breaking Changes

- Bundle Lookup Matcher ([f9572aa][], [#17][]).

Applications that explicitly use `/main/{languageId}` to traverse main items need to update it to `/main/{bundle}`. Applications that use the `.main()` method need to take no action.

This change improves how cldrjs performs lookup for the right bundle when traversing main items. See more information at [Bundle Lookup Matcher][].

[f9572aa]: https://github.com/rxaviers/cldrjs/commit/f9572aa0164a8e4fcb5b7c4ae95957f2ced8e96a
[#17]: https://github.com/rxaviers/cldrjs/issues/17
[Bundle Lookup Matcher]: ./doc/bundle_lookup_matcher.md
