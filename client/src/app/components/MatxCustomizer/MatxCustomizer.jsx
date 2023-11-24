import {
  Box,
  Button,
  Card,
  Drawer,
  Icon,
  IconButton,
  Link,
  styled,
  ThemeProvider,
  Tooltip,
  useTheme,
} from "@mui/material";
import useSettings from "app/hooks/useSettings";
import { Fragment, useState } from "react";
import Scrollbar from "react-perfect-scrollbar";
import { FlexBox } from "../FlexBox";
import { H5 } from "../Typography";
import BadgeSelected from "./BadgeSelected";

const Label = styled(Box)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "1rem",
  cursor: "pointer",
  borderRadius: "4px",
  letterSpacing: "1.5px",
  marginBottom: "2.5rem",
  padding: ".25rem .5rem",
  transform: "rotate(90deg)",
  color: theme.palette.secondary.main,
  backgroundColor: theme.palette.primary.dark,
  "&:hover, &.open": {
    color: theme.palette.secondary.contrastText,
    backgroundColor: theme.palette.secondary.main,
  },
}));

const MaxCustomaizer = styled("div")(({ theme }) => ({
  top: 0,
  right: 0,
  zIndex: 50,
  width: 320,
  height: "100vh",
  display: "flex",
  position: "fixed",
  paddingBottom: "32px",
  flexDirection: "column",
  boxShadow: theme.shadows[12],
  background: theme.palette.background.default,
  "& .helpText": { margin: "0px .5rem 1rem" },
}));

const LayoutBox = styled(BadgeSelected)({
  width: "100%",
  cursor: "pointer",
  marginTop: "12px",
  marginBottom: "12px",
  height: "152px !important",
  "& .layout-name": { display: "none" },
  "&:hover .layout-name": {
    zIndex: 12,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    position: "absolute",
    justifyContent: "center",
    background: "rgba(0,0,0,0.3)",
  },
});

const Controller = styled("div")(({ theme }) => ({
  minHeight: 58,
  display: "flex",
  padding: "14px 20px",
  alignItems: "center",
  marginBottom: "16px",
  boxShadow: theme.shadows[6],
  justifyContent: "space-between",
}));

const IMG = styled("img")({ width: "100%" });

const StyledScrollBar = styled(Scrollbar)({
  paddingLeft: "16px",
  paddingRight: "16px",
});

const MatxCustomizer = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const { settings, updateSettings } = useSettings();
  const secondary = theme.palette.text.secondary;

  const tooglePanel = () => setOpen(!open);
  const handleTabChange = (index) => setTabIndex(index);
  let activeTheme = { ...settings.themes[settings.activeTheme] };

  return (
    <Fragment>
      <Tooltip title="Theme Settings" placement="left">
        <Label className="open" onClick={tooglePanel}>
          DEMOS
        </Label>
      </Tooltip>

      <ThemeProvider theme={activeTheme}>
        <Drawer
          open={open}
          anchor={"right"}
          variant="temporary"
          onClose={tooglePanel}
          ModalProps={{ keepMounted: true }}
        >
          <MaxCustomaizer>
            <Controller>
              <Box display="flex">
                <Icon className="icon" color="primary">
                  settings
                </Icon>
                <H5 sx={{ ml: 1, fontSize: "1rem" }}>Theme Settings</H5>
              </Box>

              <IconButton onClick={tooglePanel}>
                <Icon className="icon">close</Icon>
              </IconButton>
            </Controller>

            <FlexBox gap={2} px={3} mb={2}>
              <Button
                variant="outlined"
                onClick={() => handleTabChange(0)}
                color={tabIndex === 0 ? "secondary" : "primary"}
              >
                Demos
              </Button>

              <Button
                variant="outlined"
                onClick={() => handleTabChange(1)}
                color={tabIndex === 1 ? "secondary" : "primary"}
              >
                Settings
              </Button>
            </FlexBox>

            <StyledScrollBar options={{ suppressScrollX: true }}>
              {tabIndex === 0 && (
                <Box sx={{ mb: 4, mx: 3 }}>
                  <Box sx={{ color: secondary }}>Layouts</Box>

                  <Box display="flex" flexDirection="column">
                    {demoLayouts.map((layout) => (
                      <LayoutBox
                        key={layout.name}
                        color="secondary"
                        badgeContent={"Pro"}
                        invisible={!layout.isPro}
                      >
                        <Card
                          elevation={4}
                          sx={{ position: "relative" }}
                          onClick={() => updateSettings(layout.options)}
                        >
                          <Box sx={{ overflow: "hidden" }} className="layout-name">
                            <Button variant="contained" color="secondary">
                              {layout.name}
                            </Button>
                          </Box>

                          <IMG src={layout.thumbnail} alt={layout.name} />
                        </Card>
                      </LayoutBox>
                    ))}
                  </Box>
                </Box>
              )}

              {/* END LAYOUT */}
              {tabIndex === 1 && (
                <div>
                  <div className="helpText">
                    We used React context API to control layout. Check out the{" "}
                    <Link href="http://demos.ui-lib.com/matx-react-doc/layout.html" target="_blank">
                      Documentation
                    </Link>
                  </div>
                </div>
              )}
            </StyledScrollBar>
          </MaxCustomaizer>
        </Drawer>
      </ThemeProvider>
    </Fragment>
  );
};

const demoLayouts = [
  {
    name: "Light Sidebar",
    thumbnail: "/assets/images/screenshots/layout1-customizer.png",
    isPro: false,
    options: {
      activeLayout: "layout1",
      activeTheme: "blue",
      layout1Settings: {
        leftSidebar: { mode: "full", theme: "whiteBlue", bgOpacity: 0.98 },
        topbar: { theme: "blueDark", fixed: true },
      },
      footer: { theme: "slateDark1" },
    },
  },
  {
    name: "Compact Sidebar",
    thumbnail: "/assets/images/screenshots/layout5-customizer.png",
    isPro: false,
    options: {
      activeLayout: "layout1",
      activeTheme: "blue",
      layout1Settings: {
        leftSidebar: { mode: "compact", theme: "slateDark1", bgOpacity: 0.92 },
        topbar: { theme: "whiteBlue", fixed: true },
      },
    },
  },
  {
    name: "Dark Sidebar",
    thumbnail: "/assets/images/screenshots/layout1-blue-customizer.png",
    isPro: false,
    options: {
      activeLayout: "layout1",
      activeTheme: "blue",
      layout1Settings: {
        leftSidebar: { mode: "full", theme: "slateDark1", bgOpacity: 0.92 },
        topbar: { theme: "blueDark", fixed: true },
      },
    },
  },
  {
    name: "Dark Theme",
    thumbnail: "/assets/images/screenshots/layout3-customizer.png",
    isPro: true,
    options: {
      activeLayout: "layout1",
      activeTheme: "purpleDark1",
      layout1Settings: {
        leftSidebar: { mode: "full", theme: "slateDark1", bgOpacity: 0.92 },
        topbar: { theme: "purpleDark1", fixed: true },
      },
      footer: { theme: "slateDark1" },
    },
  },
  {
    name: "Horizontal Navigation",
    thumbnail: "/assets/images/screenshots/layout4-customizer.png",
    isPro: true,
    options: {
      activeLayout: "layout2",
      activeTheme: "purple1",
      layout2Settings: { mode: "full" },
      footer: { theme: "slateDark1" },
    },
  },
];

export default MatxCustomizer;
