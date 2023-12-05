import { Box, Card, Grid, Icon, IconButton, useTheme } from "@mui/material";
import { H3, Paragraph } from "app/components/Typography";
import { useAuth } from "app/hooks/useAuth";
import useData from "app/hooks/useData";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import _ from "lodash";

const StatCard3 = () => {

  const [academicYear, setAcademicYear] = useState(null);
  const [activePrograms, setActivePrograms] = useState(0);
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: students } = useData('students_ay', user.company_id, user.currentAcademicYearId);
  const { data: academicYears } = useData('academic_years', user.company_id);
  const { data: employees } = useData('employees', user.company_id);

  useEffect(() => {
    if (academicYears) {
      setAcademicYear(academicYears.find((ay) => ay.id === user.currentAcademicYearId));
    }

    if (students) {
      setActivePrograms(Object.keys(_.groupBy(students, 'program_id')).length);
    }
  }, [academicYears, user.currentAcademicYearId, students]);

  const statList = [
    {
      icon: "calendar_today",
      amount: academicYear?.name || "",
      title: t("academics.table header.academic year"),
    },
    {
      icon: "school",
      amount: students.length,
      title: t("students.title"),
    },
    {
      icon: "book",
      amount: activePrograms || 0,
      title: t("academics.active programs"),
    },
    {
      icon: "people",
      amount: employees.length,
      title: t("employees.name")
    },
  ];
  const { palette } = useTheme();
  const textMuted = palette.text.secondary;

  return (
    <div>
      <Grid container spacing={3}>
        {statList.map((item, ind) => (
          <Grid key={item.title} item md={3} sm={6} xs={12}>
            <Card elevation={3} sx={{ p: "20px", display: "flex" }}>
              <div>
                <IconButton
                  size="small"
                  sx={{
                    padding: "8px",
                    background: "rgba(0, 0, 0, 0.01)",
                  }}
                >
                  <Icon sx={{ color: textMuted }}>{item.icon}</Icon>
                </IconButton>
              </div>
              <Box ml={2}>
                <H3 sx={{ mt: "-4px", fontSize: "32px" }}>{item.amount.toLocaleString()}</H3>
                <Paragraph sx={{ m: 0, color: textMuted }}>{item.title}</Paragraph>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default StatCard3;
