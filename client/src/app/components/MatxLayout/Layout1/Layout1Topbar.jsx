import { Home, Person, PowerSettingsNew, Settings } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Icon,
  IconButton,
  MenuItem,
  Select,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTranslation } from 'react-i18next';
import { FlexBetween } from "app/components/FlexBox";
import MatxMenu from "app/components/MatxMenu";
import { themeShadows } from "app/components/MatxTheme/themeColors";
import { Span } from "app/components/Typography";
import { useAuth } from "app/hooks/useAuth";
import useSettings from "app/hooks/useSettings";
import { topBarHeight } from "app/utils/constant";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useData from "app/hooks/useData";

// styled components
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

const TopbarRoot = styled("div")({
  top: 0,
  zIndex: 96,
  height: topBarHeight,
  boxShadow: themeShadows[8],
  transition: "all 0.3s ease",
});

const TopbarContainer = styled(FlexBetween)(({ theme }) => ({
  height: "100%",
  padding: "8px",
  paddingLeft: 18,
  paddingRight: 20,
  background: theme.palette.primary.main,
  [theme.breakpoints.down("sm")]: { paddingLeft: 16, paddingRight: 16 },
  [theme.breakpoints.down("xs")]: { paddingLeft: 14, paddingRight: 16 },
}));

const UserMenu = styled(Box)({
  padding: 4,
  display: "flex",
  borderRadius: 24,
  cursor: "pointer",
  alignItems: "center",
  "& span": { margin: "0 8px" },
});

const StyledItem = styled(MenuItem)(({ theme }) => ({
  gap: 8,
  minWidth: 185,
  display: "flex",
  alignItems: "center",
  "& a": {
    gap: 8,
    width: "100%",
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
  },
  "& span": {
    marginRight: "10px",
    color: theme.palette.text.primary,
  },
}));

const IconBox = styled("div")(({ theme }) => ({
  display: "inherit",
  [theme.breakpoints.down("md")]: { display: "none !important" },
}));

const Layout1Topbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { settings, updateSettings } = useSettings();
  const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));

  const { t, i18n } = useTranslation();
  const { data: academic_years } = useData("academic_years", user.company_id);
  const [academicYear, setAcademicYear] = React.useState(null);

  const updateSidebarMode = (sidebarSettings) => {
    updateSettings({ layout1Settings: { leftSidebar: { ...sidebarSettings } } });
  };

  useEffect(() => {
    if (academic_years) {
      const currentYear = academic_years.find((year) => year.id == user.currentAcademicYearId);
      setAcademicYear(currentYear);
    }
  }, [academic_years]);

  const handleSidebarToggle = () => {
    let { layout1Settings } = settings;
    let mode;

    if (isMdScreen) {
      mode = layout1Settings.leftSidebar.mode === "close" ? "mobile" : "close";
    } else {
      mode = layout1Settings.leftSidebar.mode === "full" ? "close" : "full";
    }
    updateSidebarMode({ mode });
  };

  return (
    <TopbarRoot>
      <TopbarContainer>
        <Box display="flex">
          <StyledIconButton onClick={handleSidebarToggle}>
            <Icon>menu</Icon>
          </StyledIconButton>

          {/* <IconBox>
            <StyledIconButton>
              <Icon>mail_outline</Icon>
            </StyledIconButton>
          </IconBox> */}
        </Box>

        <Box display="flex" alignItems="center">
          {/* <MatxSearchBox />

          <NotificationBar />

          <ShoppingCart /> */}

          <Box ml={2} mr={3}>
            {t('main.academic year')}:{" "}
            <b>{academicYear?.name}</b>
          </Box>

          <MatxMenu
            menuButton={
              <UserMenu>
                <Span display={{ sm: "inline", xs: "none" }}>
                  {t('main.hi')} <strong>{user.first_name}!</strong>
                </Span>

                <Avatar src={user.avatar} />
              </UserMenu>
            }
          >
            <StyledItem onClick={() => navigate("/")}>
              <Home fontSize="small" />
              <Span> {t("main.menu.dashboard")} </Span>
            </StyledItem>

            {/* <StyledItem onClick={() => navigate("/page-layouts/user-profile")}>
              <Person fontSize="small" />
              <Span> Profile </Span>
            </StyledItem> */}

            <StyledItem onClick={() => navigate("/page-layouts/account")}>
              <Settings fontSize="small" />
              <Span> {t("settings.general title")} </Span>
            </StyledItem>

            <StyledItem onClick={logout}>
              <PowerSettingsNew fontSize="small" />
              <Span> {t("main.logout")} </Span>
            </StyledItem>
          </MatxMenu>
          <Select
            size="small"
            native
            variant="outlined"
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            sx={{ mb: 3 }}
            style={{margin: "32px"}}
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
          </Select>
        </Box>
      </TopbarContainer>
    </TopbarRoot>
  );
};

export default React.memo(Layout1Topbar);
