import { ProfitCategory } from "../../application/ProfitCategory";

export class ProfitCategoryFilter extends HTMLElement {
  private onChangeCallback: (profitCategory: ProfitCategory) => void;
  private profitCategory: ProfitCategory;

  constructor(onChangeCallback: (profitCategory: ProfitCategory) => void, initialCategory: ProfitCategory) {
    super();
    this.onChangeCallback = onChangeCallback;
    this.profitCategory = initialCategory;
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (!this.shadowRoot) return;

    const container = document.createElement("div");
    container.innerHTML = `
      <label for="profit-category">Filter by Profit Category: </label>
      <select id="profit-category">
        <option value=${ProfitCategory.Low} ${this.profitCategory === ProfitCategory.Low ? "selected" : ""}>Low</option>
        <option value=${ProfitCategory.Medium} ${this.profitCategory === ProfitCategory.Medium ? "selected" : ""}>Medium</option>
        <option value=${ProfitCategory.High} ${this.profitCategory === ProfitCategory.High ? "selected" : ""}>High</option>
      </select>
    `;

    const selectElement = container.querySelector("select");
    selectElement?.addEventListener("change", (event) => {
      const selectedCategory = (event.target as HTMLSelectElement).value as ProfitCategory;
      this.onChangeCallback(selectedCategory);
    });

    const style = document.createElement("style");
    style.textContent = `
        :host {
          display: flex;
          align-items: center;
          gap: var(--padding);
          background: white;
          padding: var(--padding);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
  
        label {
          font-weight: bold;
          color: var(--secondary-color);
        }
  
        select {
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: var(--border-radius);
          max-width: 200px;
        }

        select option {
          padding: 0.5rem;
        }
  
        @media (max-width: var(--breakpoint-small)) {
          select {
            max-width: 100%;
          }
        }
      `;
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(container);
  }
}

customElements.define("profit-category-filter", ProfitCategoryFilter);
