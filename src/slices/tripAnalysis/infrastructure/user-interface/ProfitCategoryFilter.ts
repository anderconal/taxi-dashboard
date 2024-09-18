export class ProfitCategoryFilter extends HTMLElement {
    private onChange: (value: "low" | "medium" | "high") => void;
  
    constructor(onChange: (value: "low" | "medium" | "high") => void) {
      super();
      this.onChange = onChange;
      this.attachShadow({ mode: "open" });
    }
  
    connectedCallback() {
      this.render();
    }
  
    render() {
      if (!this.shadowRoot) return;
  
      const filterLabel = document.createElement("label");
      filterLabel.setAttribute("for", "filter");
      filterLabel.textContent = "Filter by Profit Category:";

      const select = document.createElement("select");
      select.innerHTML = `
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      `;
      select.id = "filter";

      select.addEventListener("change", () => {
        const selectedValue = select.value as "low" | "medium" | "high";
        this.onChange(selectedValue);
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
  
      this.shadowRoot.appendChild(filterLabel);
      this.shadowRoot.appendChild(select);
    }
  }
  
  customElements.define("profit-category-filter", ProfitCategoryFilter);
