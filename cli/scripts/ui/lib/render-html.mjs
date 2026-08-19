export function renderPageMarkup(style) {
  const navigation = style.sections.find(({ type }) => type === "navigation");
  const footer = style.sections.find(({ type }) => type === "footer");
  const body = style.sections.filter(({ type }) => !["navigation", "footer"].includes(type));
  return [
    '<a class="skip-link" href="#main">Skip to content</a>',
    renderSection(navigation, style),
    '<main id="main">',
    ...body.map((section) => renderSection(section, style)),
    "</main>",
    renderSection(footer, style),
  ].join("\n");
}

function renderSection(section, style) {
  if (!section) throw new Error(`${style.id} is missing a required section`);
  const attributes = `id="${attr(section.id)}" class="ui-section ui-${attr(section.type)} theme-${attr(section.theme)} variant-${attr(section.variant)}"`;
  switch (section.type) {
    case "navigation":
      return `<header ${attributes}><div class="ui-container nav-inner"><a class="brand" href="#top">${text(section.brand)}</a><nav aria-label="Primary"><ul>${section.links.map((link) => `<li>${linkTo(link)}</li>`).join("")}</ul></nav>${linkTo(section.action, "button primary compact")}</div></header>`;
    case "hero":
      return `<section ${attributes}><div class="ui-container hero-copy">${eyebrow(section)}<h1>${text(section.heading)}</h1><p class="lead">${text(section.body)}</p><div class="actions">${linkTo(section.primaryAction, "button primary")}${section.secondaryAction ? linkTo(section.secondaryAction, "button secondary") : ""}</div></div><figure class="hero-visual"><img src="${assetUrl(style.id, section.asset)}" alt="${attr(assetAlt(style, section.asset))}" width="${asset(style, section.asset).width}" height="${asset(style, section.asset).height}" /></figure></section>`;
    case "showcase":
      return `<section ${attributes}><div class="ui-container showcase-grid"><div>${eyebrow(section)}<h2>${text(section.heading)}</h2><p class="lead">${text(section.body)}</p>${section.action ? linkTo(section.action, "text-link") : ""}</div>${section.asset ? `<figure><img src="${assetUrl(style.id, section.asset)}" alt="${attr(assetAlt(style, section.asset))}" width="${asset(style, section.asset).width}" height="${asset(style, section.asset).height}" loading="lazy" /></figure>` : '<div class="material-study" aria-hidden="true"><span></span><span></span><span></span></div>'}</div></section>`;
    case "features":
      return `<section ${attributes}><div class="ui-container">${eyebrow(section)}<h2>${text(section.heading)}</h2>${section.body ? `<p class="lead section-intro">${text(section.body)}</p>` : ""}<div class="feature-grid">${section.items.map((item) => `<article><span class="marker">${text(item.marker ?? "")}</span><h3>${text(item.title)}</h3><p>${text(item.description)}</p></article>`).join("")}</div></div></section>`;
    case "metrics":
      return `<section ${attributes}><div class="ui-container">${eyebrow(section)}<h2>${text(section.heading)}</h2><dl class="metrics-grid">${section.items.map((item) => `<div><dt>${text(item.label)}</dt><dd>${text(item.value)}</dd></div>`).join("")}</dl></div></section>`;
    case "logo-cloud":
      return `<section ${attributes}><div class="ui-container"><h2>${text(section.heading)}</h2><ul class="logo-row">${section.items.map((item) => `<li>${text(item)}</li>`).join("")}</ul></div></section>`;
    case "testimonials":
      return `<section ${attributes}><div class="ui-container"><h2>${text(section.heading)}</h2><div class="quote-grid">${section.items.map((item) => `<figure><blockquote>${text(item.quote)}</blockquote><figcaption>${text(item.name)} · ${text(item.role)}</figcaption></figure>`).join("")}</div></div></section>`;
    case "pricing":
      return `<section ${attributes}><div class="ui-container"><h2>${text(section.heading)}</h2>${section.body ? `<p class="lead section-intro">${text(section.body)}</p>` : ""}<div class="pricing-grid">${section.tiers.map((tier) => `<article><h3>${text(tier.name)}</h3><p class="price">${text(tier.price)}</p><p>${text(tier.description)}</p><ul>${tier.features.map((feature) => `<li>${text(feature)}</li>`).join("")}</ul></article>`).join("")}</div></div></section>`;
    case "cta":
      return `<section ${attributes}><div class="ui-container cta-inner">${eyebrow(section)}<h2>${text(section.heading)}</h2><p class="lead">${text(section.body)}</p>${linkTo(section.action, "button primary")}</div></section>`;
    case "footer":
      return `<footer ${attributes}><div class="ui-container footer-grid"><div><a class="brand" href="#top">${text(section.brand)}</a><p>${text(section.summary)}</p></div>${section.columns.map((column) => `<div><h2>${text(column.heading)}</h2><ul>${column.links.map((link) => `<li>${linkTo(link)}</li>`).join("")}</ul></div>`).join("")}</div><p class="ui-container legal">${text(section.legal)}</p></footer>`;
    default:
      throw new Error(`unsupported section type "${section.type}"`);
  }
}

function linkTo(link, className = "") {
  return `<a${className ? ` class="${className}"` : ""} href="${attr(link.href)}">${text(link.label)}</a>`;
}

function eyebrow(section) {
  return section.eyebrow ? `<p class="eyebrow">${text(section.eyebrow)}</p>` : "";
}

function asset(style, source) {
  const found = style.assets.find((item) => item.source === source);
  if (!found) throw new Error(`missing asset record for ${source}`);
  return found;
}

function assetAlt(style, source) {
  return asset(style, source).alt;
}

function assetUrl(id, source) {
  return `/ui/${id}/${source.slice("assets/".length)}`;
}

function text(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function attr(value) {
  return text(value).replaceAll('"', "&quot;");
}
