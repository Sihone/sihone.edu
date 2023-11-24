import { useTheme } from "@mui/material";
import ReactEcharts from "echarts-for-react";

const EducationChart = ({ height = 150 }) => {
  const theme = useTheme();

  const options = {
    barGap: 50,
    barMaxWidth: "6px",

    grid: { top: 24, left: 26, right: 26, bottom: 25 },

    legend: {
      itemGap: 32,
      top: -4,
      left: -4,
      icon: "circle",
      width: "auto",
      data: ["Angular", "React", "Javascript"],
      textStyle: {
        fontSize: 12,
        align: "center",
        color: theme.palette.text.secondary,
        fontFamily: theme.typography.fontFamily,
      },
    },
    tooltip: {},
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      showGrid: false,
      boundaryGap: false,
      axisLine: { show: false },
      splitLine: { show: false },
      axisLabel: {
        margin: 16,
        fontSize: 12,
        color: theme.palette.text.secondary,
        fontFamily: theme.typography.fontFamily,
      },
      axisTick: { show: false },
    },
    color: [theme.palette.primary.main, "#e95455", theme.palette.secondary.main],
    yAxis: {
      type: "value",
      show: false,
      axisLine: { show: false },
      splitLine: { show: false },
    },
    series: [
      {
        type: "bar",
        stack: "one",
        name: "Angular",
        data: [50, 50, 80, 80, 80, 60, 70],
        itemStyle: { barBorderRadius: [0, 0, 10, 10] },
      },
      {
        type: "bar",
        stack: "one",
        name: "React",
        data: [70, 80, 90, 100, 70, 80, 65],
      },
      {
        type: "bar",
        stack: "one",
        name: "Javascript",
        data: [65, 80, 70, 100, 90, 70, 55],
        itemStyle: { barBorderRadius: [10, 10, 0, 0] },
      },
    ],
  };

  return <ReactEcharts style={{ height: height }} option={options} />;
};

export default EducationChart;
