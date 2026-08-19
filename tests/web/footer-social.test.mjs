import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const footerPath = new URL("../../web/components/footer.tsx", import.meta.url);

test("footer does not render a standalone GitHub social icon", async () => {
  const source = await readFile(footerPath, "utf8");

  assert.doesNotMatch(source, /IconBrandGithub/);
  assert.doesNotMatch(source, /const socials/);
  assert.doesNotMatch(source, /<SocialIcon/);
});
