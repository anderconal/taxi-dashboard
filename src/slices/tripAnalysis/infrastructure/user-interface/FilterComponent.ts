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
  
      // Read the date from URL parameters if available
      const urlParams = new URLSearchParams(window.location.search);
      const dateParam = urlParams.get("date");
  
      // Determine the default date: use URL date if present, otherwise use first date
      const defaultDate = dateParam || this.formatDateToInput(this.firstDate);
  
      // Set the input's default value to the formatted first date or URL date
      filterInput.value = defaultDate;
  
      // If no date is in the URL, set it now to the default date
      if (!dateParam) {
        this.updateUrlWithDate(defaultDate);
      }
  
      filterInput.addEventListener("change", (event) => {
        const target = event.target as HTMLInputElement;
        const date = target.value;
        this.onFilterChange(date);
  
        // Update the URL with the selected date as a query parameter
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
      return date.toISOString().split("T")[0]; // Formats as YYYY-MM-DD
    }
  
    private updateUrlWithDate(date: string): void {
      const url = new URL(window.location.href);
      url.searchParams.set("date", date);
      window.history.replaceState({}, "", url.toString());
    }
  }
  
  customElements.define("filter-component", FilterComponent);
  