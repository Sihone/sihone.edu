import { Clear } from "@mui/icons-material";
import {
  Badge,
  Box,
  Button,
  Card,
  Drawer,
  Icon,
  IconButton,
  styled,
  ThemeProvider,
  useTheme,
} from "@mui/material";
import useNotification from "app/hooks/useNotification";
import useSettings from "app/hooks/useSettings";
import { deleteAllNotification, deleteNotification } from "app/redux/slices/notificationSlice";
import { sideNavWidth, topBarHeight } from "app/utils/constant";
import { getTimeDifference } from "app/utils/utils.js";
import { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { FlexBetween } from "./FlexBox";
import { themeShadows } from "./MatxTheme/themeColors";
import { Paragraph, Small } from "./Typography";

// styled components
const Notification = styled(Box)({
  padding: "16px",
  display: "flex",
  marginBottom: "16px",
  alignItems: "center",
  height: topBarHeight,
  boxShadow: themeShadows[6],
  "& h5": {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: "8px",
    fontWeight: "500",
  },
});

const NotificationCard = styled(Box)(({ theme }) => ({
  position: "relative",
  "& .icon": { fontSize: "1.25rem" },
  "& .messageTime": { color: theme.palette.text.secondary },
  "&:hover": {
    "& .messageTime": { display: "none" },
    "& .deleteButton": { display: "block" },
  },
}));

const DeleteButton = styled(IconButton)({
  padding: 0,
  display: "none",
  background: "rgba(0, 0, 0, 0.01)",
});

const CardLeftContent = styled(FlexBetween)(({ theme }) => ({
  padding: "12px 8px",
  background: "rgba(0, 0, 0, 0.02)",
  "& small": {
    fontWeight: "500",
    marginLeft: "16px",
    color: theme.palette.text.secondary,
  },
}));

const Heading = styled("span")(({ theme }) => ({
  fontWeight: "500",
  color: theme.palette.text.secondary,
}));

const NotificationBar = ({ container }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { settings } = useSettings();
  const { notifications } = useNotification();
  const [panelOpen, setPanelOpen] = useState(false);

  const secondary = theme.palette.text.secondary;
  const handleDrawerToggle = () => setPanelOpen(!panelOpen);

  return (
    <Fragment>
      <IconButton onClick={handleDrawerToggle}>
        <Badge color="secondary" badgeContent={notifications?.length}>
          <Icon sx={{ color: "text.primary" }}>notifications</Icon>
        </Badge>
      </IconButton>

      <ThemeProvider theme={settings.themes[settings.activeTheme]}>
        <Drawer
          width="100px"
          anchor="right"
          open={panelOpen}
          variant="temporary"
          container={container}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
        >
          <Box sx={{ width: sideNavWidth, flexGrow: 1 }}>
            <Notification>
              <Icon color="primary">notifications</Icon>
              <h5>Notifications</h5>
            </Notification>

            {notifications?.map((notification) => (
              <NotificationCard key={notification.id}>
                <Card sx={{ mx: 2, mb: 3 }} elevation={3}>
                  <CardLeftContent>
                    <Box display="flex" gap={1}>
                      <Icon className="icon" color={notification.icon.color}>
                        {notification.icon.name}
                      </Icon>
                      <Heading>{notification.heading}</Heading>
                    </Box>

                    <Small className="messageTime">
                      {getTimeDifference(new Date(notification.timestamp))}
                      ago
                    </Small>

                    <DeleteButton
                      size="small"
                      className="deleteButton"
                      onClick={(e) => dispatch(deleteNotification(notification.id))}
                    >
                      <Clear sx={{ fontSize: 16 }} />
                    </DeleteButton>
                  </CardLeftContent>

                  <Box sx={{ px: 2, pt: 1, pb: 2 }}>
                    <Paragraph sx={{ m: 0 }}>{notification.title}</Paragraph>
                    <Small sx={{ color: secondary }}>{notification.subtitle}</Small>
                  </Box>
                </Card>
              </NotificationCard>
            ))}
          </Box>

          {!!notifications?.length && (
            <Button
              fullWidth
              color="primary"
              variant="contained"
              onClick={() => dispatch(deleteAllNotification())}
              sx={{ borderRadius: 0, boxShadow: "none" }}
            >
              Clear Notifications
            </Button>
          )}
        </Drawer>
      </ThemeProvider>
    </Fragment>
  );
};

export default NotificationBar;
