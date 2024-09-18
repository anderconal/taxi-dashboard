import * as echarts from "echarts";
import { AverageNetMargin } from "../../application/GetAverageNetMarginByProfitUseCase";

interface LabelFormatterParams {
  value: number | string;
}

export class NetMarginBarChart extends HTMLElement {
  private chart!: echarts.ECharts;
  private container!: HTMLDivElement;
  private averageMargins: AverageNetMargin[] = [];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();

    requestAnimationFrame(() => {
      this.initializeChart();
    });

    window.addEventListener("resize", this.handleResize);
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this.handleResize);
  }

  render() {
    if (!this.shadowRoot) return;

    this.container = document.createElement("div");
    this.container.style.width = "100%";
    this.container.style.height = "500px";

    this.shadowRoot.appendChild(this.container);

    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: block;
        padding: var(--padding);
      }
      div {
        width: 100%;
        height: 100%;
      }
    `;
    this.shadowRoot.appendChild(style);
  }

  initializeChart() {
    if (!this.container) return;

    this.chart = echarts.init(this.container);

    if (this.averageMargins.length > 0) {
      this.update(this.averageMargins);
    }
  }

  update(averageMargins: AverageNetMargin[]) {
    this.averageMargins = averageMargins;

    if (!this.chart) return;

    const option = {
      title: {
        text: "Average Net Margin per Route",
        left: "center",
        textStyle: {
          fontSize: 16,
          fontWeight: "bold",
          color: "#333",
        },
      },
      grid: {
        top: 80,
        bottom: 140,
        left: "10%",
        right: "10%",
      },
      xAxis: {
        type: "category",
        data: averageMargins.map((route) => route.route),
        axisLabel: {
          rotate: 25,
          interval: 0,
          margin: 20,
          fontSize: 8,
        },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          formatter: (value: number) => `${value.toFixed(2)} €`,
        },
      },
      series: [
        {
          data: averageMargins.map((route) => route.averageNetMargin),
          type: "bar",
          label: {
            show: true,
            position: "top",
            formatter: (param: LabelFormatterParams) => {
              const value = typeof param.value === "number" ? param.value : parseFloat(param.value as string);
              return `${value.toFixed(2)} €`;
            },
          },
        },
      ],
    };

    this.chart.setOption(option);

    this.chart.resize();
  }

  handleResize = () => {
    if (this.chart) {
      this.chart.resize();
    }
  };
}

customElements.define("net-margin-bar-chart", NetMarginBarChart);
