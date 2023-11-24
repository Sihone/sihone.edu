import { useTheme } from "@mui/material";
import useSettings from "app/hooks/useSettings";
import SecondarySidenavTheme from "../MatxTheme/SecondarySidenavTheme";
import SecondarySidebarContent from "./SecondarySidebarContent";
import SecondarySidebarToggle from "./SecondarySidebarToggle";

const SecondarySidebar = () => {
  const theme = useTheme();
  const { settings } = useSettings();
  const secondarySidebarTheme = settings.themes[settings.secondarySidebar.theme];

  return (
    <SecondarySidenavTheme theme={secondarySidebarTheme}>
      {settings.secondarySidebar.open && <SecondarySidebarContent chatTheme={theme} />}
      <SecondarySidebarToggle />
    </SecondarySidenavTheme>
  );
};

export default SecondarySidebar;
