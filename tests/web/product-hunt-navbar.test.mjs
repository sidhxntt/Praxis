import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const navbarPath = new URL("../../web/components/navbar.tsx", import.meta.url);

test("desktop navbar renders the official Praxis Product Hunt badge", async () => {
  const source = await readFile(navbarPath, "utf8");

  assert.match(
    source,
    /href="https:\/\/www\.producthunt\.com\/products\/praxis-4\/launches\/praxis-4\?embed=true&amp;utm_source=badge-featured&amp;utm_medium=badge&amp;utm_campaign=badge-praxis-4"/,
  );
  assert.match(
    source,
    /src="https:\/\/api\.producthunt\.com\/widgets\/embed-image\/v1\/featured\.svg\?post_id=1007579&amp;theme=dark&amp;t=1787151168808"/,
  );
  assert.match(source, /alt="Praxis  - Ship your SaaS in days not in months\. \| Product Hunt"/);
  assert.match(source, /width="250"/);
  assert.match(source, /height="54"/);
  assert.match(source, /target="_blank"/);
  assert.match(source, /rel="noopener noreferrer"/);
});
