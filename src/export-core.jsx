import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

export const defineComponent = (elementName, Component) => {
  if (!customElements.get(elementName)) {
    customElements.define(
      elementName,
      class extends HTMLElement {
        constructor() {
          super();
          this.root = createRoot(this);
        }

        #parseAttrName(attr = "") {
          return attr
            .split("-")
            .map((word, index) =>
              index !== 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word,
            )
            .join("");
        }

        connectedCallback() {
          const props = {};
          for (const attrName of this.getAttributeNames()) {
            let attrValue = this.attributes[attrName].value;
            try {
              attrValue = window.eval(attrValue);
            } catch {
              if (attrValue.includes("{") && attrValue.includes("}")) {
                attrValue = JSON.parse(attrValue);
              }
            }
            props[this.#parseAttrName(attrName)] = attrValue;
          }

          this.root.render(
            <StrictMode>
              <Component {...props} />
            </StrictMode>,
          );
        }

        disconnectedCallback() {
          this.root.unmount();
        }
      },
    );
  }
};
