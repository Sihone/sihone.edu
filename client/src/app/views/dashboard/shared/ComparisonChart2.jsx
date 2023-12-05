import { useTheme } from "@mui/material";
import { useAuth } from "app/hooks/useAuth";
import useData from "app/hooks/useData";
import ReactEcharts from "echarts-for-react";
import React from "react";
import { useTranslation } from "react-i18next";

const ComparisonChart2 = ({ height }) => {
  const { palette } = useTheme();

  const { user } = useAuth();
  const { data: programs } = useData("academic_programs", user.company_id);
  const { data: academicYears } = useData("academic_years", user.company_id);
  const { data: students } = useData("students", user.company_id);
  const { i18n } = useTranslation();

  const [source, setSource] = React.useState([]);
  const [series, setSeries] = React.useState([]);

  React.useEffect(() => {
    if (students.length > 0 && academicYears.length > 0 && programs.length > 0) {
      let _source = [];
      let _sourceVal = ["Month"];
      let _series = [];
      programs.forEach((program) => {
        _sourceVal.push(i18n.language == "en" ? program.short_name_en + " - " + program.name_en : (program.short_name_fr + " - " + program.name_fr));
        _series.push({
          type: "bar",
          itemStyle: { borderRadius: [10, 10, 0, 0] },
        });
      });
      _source.push(_sourceVal);
      academicYears.forEach((ay) => {
        let _ay = [ay.name];
        programs.forEach((program) => {
          const _students = students.filter((student) => student.program_id == program.id && student.academic_year_id == ay.id);
          _ay.push(_students.length);
        });
        _source.push(_ay);
      });
      setSource(_source);
      setSeries(_series);
    }
  }, [students, academicYears, programs, i18n.language]);

  const option = {
    grid: { left: "6%", bottom: "10%", right: "1%" },
    legend: {
      itemGap: 20,
      icon: "circle",
      textStyle: {
        fontSize: 13,
        fontFamily: "roboto",
        color: palette.text.secondary,
      },
    },
    color: [
      palette.primary.dark,
      palette.primary.light,
      palette.secondary.light,
      palette.error.light,
    ],
    barMaxWidth: 13,
    tooltip: {},
    dataset: {
      source,
    },
    xAxis: {
      type: "category",
      axisLine: { show: false },
      splitLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        fontSize: 13,
        fontFamily: "roboto",
        color: palette.text.secondary,
      },
    },
    yAxis: {
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        // show: false
        lineStyle: {
          color: palette.text.secondary,
          opacity: 0.15,
        },
      },
      axisLabel: {
        fontSize: 13,
        fontFamily: "roboto",
        color: palette.text.secondary,
      },
    },
    // Declare several bar series, each will be mapped
    // to a column of dataset.source by default.
    series,
  };

  return <ReactEcharts style={{ height: height }} option={option} />;
};

export default ComparisonChart2;
