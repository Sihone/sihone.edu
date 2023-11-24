import { useMediaQuery, useTheme } from "@mui/material";
import useSettings from "app/hooks/useSettings";
import { useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Brand from "../../Brand";
import SidenavTheme from "../../MatxTheme/SidenavTheme";
import Sidenav from "../../Sidenav";

const Layout2Sidenav = () => {
  const theme = useTheme();
  const { pathname } = useLocation();
  const { settings, updateSettings } = useSettings();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const sidenavTheme = settings.themes[settings.layout2Settings.leftSidebar.theme] || theme;

  const updateSidebarMode = useCallback(
    (sidebarSettings) =>
      updateSettings({ layout2Settings: { leftSidebar: { ...sidebarSettings } } }),
    [updateSettings]
  );

  useEffect(() => {
    if (isMobile) updateSidebarMode({ mode: "close" });
  }, [isMobile, pathname, updateSidebarMode]);

  return (
    <SidenavTheme theme={sidenavTheme} settings={settings}>
      <div className="sidenav">
        <div className="sidenav__hold">
          <Brand />
          <Sidenav />
        </div>
      </div>
    </SidenavTheme>
  );
};

export default Layout2Sidenav;
