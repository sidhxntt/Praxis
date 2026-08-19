import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const productsPath = new URL("../../web/lib/products.ts", import.meta.url);

test("website shows the public npm install command", async () => {
  const source = await readFile(productsPath, "utf8");

  const commands = source.match(/command: "([^"]+)"/g) ?? [];
  assert.ok(commands.length > 0);
  assert.ok(commands.every((command) => command === 'command: "npm i -g praxiflow"'));
  assert.doesNotMatch(source, /@sidhxntt\/praxiflow/);
});
