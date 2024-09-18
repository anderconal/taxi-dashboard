import * as echarts from "echarts";
import { AverageNetMargin } from "../../application/GetAverageNetMarginByProfitUseCase";

export class NetMarginBarChart extends HTMLElement {
  private chart!: echarts.ECharts;

  connectedCallback() {
    this.render();
  }

  render() {
    const container = document.createElement("div");
    container.style.width = "100%";
    container.style.height = "400px";
    this.appendChild(container);
    this.chart = echarts.init(container);
  }

  update(averageMargins: AverageNetMargin[]) {
    const option = {
      title: {
        text: "Average Net Margin per Route",
        left: "center",
        top: 20,
        textStyle: {
          fontSize: 18,
          fontWeight: "bold"
        }
      },
      xAxis: {
        type: "category",
        data: averageMargins.map(route => route.route),
        axisLabel: { rotate: 45 },
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: averageMargins.map(route => route.averageNetMargin),
          type: "bar",
          label: {
            show: true,
            position: "top",
            formatter: "{c}"
          },
        },
      ],
    };
    this.chart.setOption(option);
  }
}

customElements.define("net-margin-bar-chart", NetMarginBarChart);
