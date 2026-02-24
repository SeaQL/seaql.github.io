# Blog Writing Style Guide

This guide captures the writing style used in SeaQL blog posts (author: Chris Tsang).
Apply it when drafting or editing blog content.

---

## Voice and Tone

- **Direct and technical.** The reader is a Rust developer. Do not explain the obvious.
- **Authoritative but not boastful.** State what the feature does and why it matters; let the code make the case.
- **Collegial, not corporate.** Use "we" for the team, "you" for the developer. Avoid "our product" or "our solution".
- **Honest.** Include trade-offs and limitations. Hiding gaps undermines credibility.

---

## Dos

- **Lead with the change, not the context.** The first sentence should say what is new or what the post covers. Skip "In this post, we will explore..."
- **Let code be the argument.** Every claim should be demonstrated with a code block or SQL output. Text is the caption; code is the evidence.
- **Explain the mechanism.** Not just *what* a feature does, but *how* it works internally — which trait, which counter, which SQL path. Engineers want to trust the implementation.
- **Use before/after pairs.** Show the manual approach, then show how SeaORM eliminates it. This makes value concrete.
- **Use comparison tables** for structured mappings (e.g. transaction depth → SQL commands, async vs sync API).
- **Use "Gist" sections** for long posts — a tight code example at the top before going deep.
- **Be specific in headings.** "Nested Transactions via Savepoints" not "Transactions Deep Dive". Include the mechanism or the technology name.
- **Bridge sections with a single sentence** that connects the previous section to the next. "That solved the read side. With nested ActiveModel, you can now do the reverse."
- **Close technical posts with a practical pointer** — a link to a working example, a next step, or a brief wrap-up. Do not recap what was already covered.

---

## Don'ts

- **No hype words.** Never: amazing, powerful, innovative, cutting-edge, game-changing, seamless, effortless, robust, best-in-class.
- **No filler phrases.** Cut: "It's worth noting that", "As you can see", "Simply put", "At the end of the day".
- **No passive voice** where active is possible. "SeaORM walks the tree" not "the tree is walked by SeaORM".
- **No listicle framing.** Avoid "10 reasons why" or "here are X good reasons". If numbering sections, let them stand on their own without a sales-pitch setup.
- **No redundant lead-ins.** Don't follow a section heading with a sentence that just restates it. "## What's in SeaORM X" does not need "Here is a detailed breakdown of what is in SeaORM X."
- **No emoji in body prose.** Emoji are acceptable only in special recurring section titles (Sponsors, Sticker Pack, etc.).
- **Don't over-explain to the audience.** If the reader is expected to know what a prepared statement or a foreign key is, don't define it.
- **Don't pad conclusions.** A two-sentence close that points somewhere useful is better than three paragraphs summarising what was just said.

---

## Structure Patterns

### Feature announcement post
1. One-paragraph context (what changed, why it matters)
2. Optional: CTA / access link if commercial
3. Numbered or headed sections, one per feature — each with prose + code
4. Limitations section (if relevant)
5. Brief close or CTA

### Deep-dive / how-we-built post
1. One-sentence hook stating the surprising or interesting thing
2. "Gist" section with the key code example
3. Subsections going progressively deeper
4. Conclusion: one or two sentences, no recap, optionally link to a runnable example

---

## Sentence Rhythm

- Prefer short sentences for key claims. Follow with a longer sentence for the mechanism.
- Colons are fine for introducing a list or consequence. Em-dashes for an aside or contrast.
- Avoid starting consecutive sentences with the same subject.

---

## Word Choices

| Instead of         | Use                          |
|--------------------|------------------------------|
| powerful           | (just show what it does)     |
| easy / simple      | only if genuinely true; be specific |
| handle gracefully  | handle transparently / correctly |
| no boilerplate     | no manual X required         |
| out of the box     | by default / automatically   |
| allows you to      | (just say what it does)      |
| utilize            | use                          |
| leverage           | use                          |
