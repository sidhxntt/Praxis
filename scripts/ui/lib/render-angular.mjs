export function renderAngularComponent() {
  return `import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  standalone: true,
  templateUrl: "./app.html",
})
export class App {}
`;
}

export function renderAngularTemplate(markup) {
  return markup;
}
