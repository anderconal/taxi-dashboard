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
  
      const select = document.createElement("select");
      select.innerHTML = `
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      `;
      select.addEventListener("change", () => {
        const selectedValue = select.value as "low" | "medium" | "high";
        this.onChange(selectedValue);
      });
  
      this.shadowRoot.appendChild(select);
    }
  }
  
  customElements.define("profit-category-filter", ProfitCategoryFilter);
