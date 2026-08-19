import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const navbarPath = new URL("../../web/components/navbar.tsx", import.meta.url);

test("desktop navbar links directly to the agent wiki", async () => {
  const source = await readFile(navbarPath, "utf8");

  assert.match(source, /href="https:\/\/github\.com\/sidhxntt\/Praxis\/wiki\/Agent-Guide"/);
  assert.match(source, />\s*Agent Wiki\s*</);
  assert.doesNotMatch(source, /Product Hunt|producthunt\.com/);
});
