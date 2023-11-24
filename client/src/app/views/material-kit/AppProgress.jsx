import { Box, CircularProgress, LinearProgress, Stack, styled } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import { useEffect, useState } from "react";

const ProgressRoot = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
  "& .progress": { margin: theme.spacing(2) },
}));

const AppProgress = () => {
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    function progress() {
      setCompleted((oldCompleted) => {
        if (oldCompleted === 100) return 0;

        const diff = Math.random() * 10;
        return Math.min(oldCompleted + diff, 100);
      });
    }

    const timer = setInterval(progress, 500);
    return () => clearInterval(timer);
  }, []);

  return (
    <ProgressRoot>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[{ name: "Material", path: "/material" }, { name: "Prgress" }]}
        />
      </Box>

      <Stack spacing={3}>
        <SimpleCard title="Circuar Progress (Indeterminate)">
          <CircularProgress className="progress" />
          <CircularProgress className="progress" color="secondary" />
        </SimpleCard>

        <SimpleCard title="Circuar Progress (static)">
          <CircularProgress value={25} className="progress" variant="determinate" />
          <CircularProgress
            variant="determinate"
            value={50}
            className="progress"
            color="secondary"
          />
          <CircularProgress
            variant="determinate"
            value={75}
            className="progress"
            color="secondary"
          />
        </SimpleCard>

        <SimpleCard title="Linear Progress (Indeterminate)">
          <LinearProgress />
          <br />
          <LinearProgress color="secondary" />
        </SimpleCard>

        <SimpleCard title="Linear Progress (Determinate)">
          <LinearProgress variant="determinate" value={completed} />
          <br />
          <LinearProgress color="secondary" variant="determinate" value={completed} />
        </SimpleCard>
      </Stack>
    </ProgressRoot>
  );
};
export default AppProgress;
