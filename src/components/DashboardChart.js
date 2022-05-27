import React, { useRef, useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function DashboardChart({ account, initbalance }) {
  const down1 = (ctx, value) => ctx.p0.parsed.x > 2 ? value : undefined;
  const down2 = (ctx, value) => ctx.p1.parsed.x > 3 ? value : undefined;
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    onResize: (ctx, new_size) => {
    },
    elements: {
      point: {
        radius: 10,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      y: {
        ticks: {
          display: false,
          labelOffset: 0,
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
        position: 'top',
      },
      showLabel: true,
      datalabels: {
        formatter: function (value, context) {
          if (context.chart.data.labels[context.dataIndex] != 30) {
            return null
          }
          if (!account) {
            return "Connect Wallet"
          } else {

          }
          return context.dataset.label + '\n' + '$ ' + value.toFixed(2)
        },
        textAlign: 'center',
        align: "bottom",
        anchor: "center",
        offset: 10,
        padding: 10,
        clip: true,
        spacing: 3,
        font: {
          size: "14",
          // weight: "bold",
          lineHeight: '1.2',
          family: 'Axiforma'
        },
        color: "white",
      },
      title: {
        display: false,
        padding: {
          top: 60,
          bottom: 20,
          left: 82,
        },
        text: '30 DAY PROJECTIONS',
        color: '#fff',
        font: {
          size: 20,
          weight: 'bold',
          lineHeight: 1.8,
          family: 'Blender'
        },
      }
    },
  }

  const labels = ['', '07', '10', '14', '21', '25', '30', '', '']
  const days = ['01', '07', '10', '14', '21', '25', '30', '35', '38']
  const apd = 1.0201808352359789181160765506086
  var rewardArry = [];
  var balanceArry = [];
  for (var i = 0; i < days.length; i++) {
    var reward = Math.pow(apd, Number(days[i])) * initbalance;
    if (account) {
      rewardArry.push(reward)
      balanceArry.push(reward + initbalance)
    } else {
      balanceArry.push(0)
    }
  }

  const data = {
    labels,
    datasets: [
      {
        lineTension: 0.8,
        label: 'Balance',
        data: balanceArry,
        borderColor: '#FA55FF',
        pointBorderWidth: 0,
        pointHoverRadius: 8,
        pointHoverBorderWidth: 3,
        pointBackgroundColor: "#FA55FF",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 600, 0);
          gradient.addColorStop(0, "rgba(250, 85, 255,0.1)");
          gradient.addColorStop(0.4, "rgba(250, 85, 255,0.03)");
          gradient.addColorStop(0.5, "rgba(250, 85, 255,0.01)");
          gradient.addColorStop(0.6, "rgba(250, 85, 255,0.01)");
          gradient.addColorStop(1, "rgba(250, 85, 255,0.01)");
          return gradient;
        },
        fill: "start",
        segment: {
          borderColor: ctx => down1(ctx, '#FA55FF'),
          borderDash: ctx => down1(ctx, [10, 10]),
        },
      },
      {
        lineTension: 0.8,
        label: 'Reward',
        data: rewardArry,
        borderColor: '#6EEFF3',
        pointBackgroundColor: "#6EEFF3",
        pointBorderWidth: 2,
        pointHoverRadius: 8,
        pointHoverBorderWidth: 3,
        fill: "start",
        segment: {
          borderColor: ctx => down2(ctx, '#6EEFF3'),
          borderDash: ctx => down2(ctx, [10, 10]),
        }
      },
    ],
  }

  const lineChartEl = useRef(null);
  var vWidth = window.innerWidth;
  const [pHeight, setPHeight] = useState(568);
  const [aTop, setTitleTop] = useState(56.16)
  const displayWindowSize = () => {
    if (document.getElementsByClassName("chart-pannel")[0] !== undefined && document.getElementsByClassName("chart-pannel")[0].offsetWidth > 0) {
      var oWidth = document.getElementsByClassName("chart-pannel")[0].offsetWidth;
      var oHeight = oWidth * 0.6;
      setPHeight(oHeight);
      if (lineChartEl.current) {
        setTitleTop(oHeight * 0.1)
        lineChartEl.current.resize(document.getElementsByClassName("chart-pannel")[0].offsetWidth, oHeight);
      }
    }
  }
  window.addEventListener("resize", displayWindowSize);
  var point_radius = [];
  var point_length = 8;
  for (var i = 0; i < point_length; i++) {
    point_radius.push(0)
  }
  point_radius[6] = 7;
  data.datasets[0].pointRadius = point_radius;
  data.datasets[1].pointRadius = point_radius;
  data.datasets[0].pointLabelFontSize = 20;
  return (
    <>
      <div className="chart-title absolute left-6 md:left-12" style={{ top: 0 }}>
        <p className="text-white text-xl">30 DAY PROJECTIONS</p>
      </div>
      <div className="chart-pannel" style={{ height: (vWidth > 500) ? pHeight : vWidth * 0.67 }}>
        <Line ref={lineChartEl} options={options} height={568} plugins={[ChartDataLabels]} data={data} />
      </div>
    </>
  )
}
