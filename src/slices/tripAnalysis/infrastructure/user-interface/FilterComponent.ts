export class FilterComponent extends HTMLElement {
    private onFilterChange: (filter: string) => void;
    private firstDate: string;
  
    constructor(onFilterChange: (filter: string) => void, firstDate: string) {
      super();
      this.onFilterChange = onFilterChange;
      this.firstDate = firstDate;
      this.attachShadow({ mode: "open" });
    }
  
    connectedCallback() {
      this.render();
    }
  
    render(): void {
      if (!this.shadowRoot) return;
  
      const filterLabel = document.createElement("label");
      filterLabel.setAttribute("for", "filter");
      filterLabel.textContent = "Filter by Date:";
  
      const filterInput = document.createElement("input");
      filterInput.type = "date";
      filterInput.id = "filter";
  
      const urlParams = new URLSearchParams(window.location.search);
      const dateParam = urlParams.get("date");
  
      const defaultDate = dateParam || this.formatDateToInput(this.firstDate);
  
      filterInput.value = defaultDate;
  
      if (!dateParam) {
        this.updateUrlWithDate(defaultDate);
      }
  
      filterInput.addEventListener("change", (event) => {
        const target = event.target as HTMLInputElement;
        const date = target.value;
        this.onFilterChange(date);
  
        this.updateUrlWithDate(date);
      });
  
      const style = document.createElement("style");
      style.textContent = `
        :host {
          display: flex;
          align-items: center;
          gap: var(--padding);
          background: white;
          padding: var(--padding);
          border-radius: var(--border-radius);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
  
        label {
          font-weight: bold;
          color: var(--secondary-color);
        }
  
        input[type="date"] {
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: var(--border-radius);
          max-width: 200px;
        }
  
        @media (max-width: var(--breakpoint-small)) {
          input[type="date"] {
            max-width: 100%;
          }
        }
      `;
      this.shadowRoot.appendChild(style);
  
      this.shadowRoot.appendChild(filterLabel);
      this.shadowRoot.appendChild(filterInput);
    }
  
    private formatDateToInput(dateString: string): string {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    }
  
    private updateUrlWithDate(date: string): void {
      const url = new URL(window.location.href);
      url.searchParams.set("date", date);
      window.history.replaceState({}, "", url.toString());
    }
  }
  
  customElements.define("filter-component", FilterComponent);
  