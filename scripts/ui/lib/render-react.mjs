export function renderNext(markup, language) {
  const jsx = toJsx(markup);
  return `${language === "typescript" ? "" : ""}export default function Home() {
  return (
    <>
${indent(jsx, 6)}
    </>
  );
}
`;
}

export function renderVite(markup) {
  return `export default function App() {
  return (
    <>
${indent(toJsx(markup), 6)}
    </>
  );
}
`;
}

function toJsx(markup) {
  return markup.replaceAll(" class=", " className=");
}

function indent(value, spaces) {
  const prefix = " ".repeat(spaces);
  return value.split("\n").map((line) => `${prefix}${line}`).join("\n");
}
