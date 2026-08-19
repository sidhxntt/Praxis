export function renderVue(markup, language) {
  return `<script setup${language === "typescript" ? ' lang="ts"' : ""}>
</script>

<template>
${indent(markup, 2)}
</template>
`;
}

function indent(value, spaces) {
  const prefix = " ".repeat(spaces);
  return value.split("\n").map((line) => `${prefix}${line}`).join("\n");
}
