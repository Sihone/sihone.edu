import { Box, Divider, styled, useTheme } from "@mui/material";
import { getTimeDifference } from "app/utils/utils";
import { Link } from "react-router-dom";
import { themeShadows } from "../MatxTheme/themeColors";
import { H5, Paragraph, Small, Span } from "../Typography";

const Circle = styled("div")(({ theme }) => ({
  top: 23,
  left: 18,
  width: 16,
  height: 16,
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  position: "absolute",
  justifyContent: "center",
  boxShadow: themeShadows[3],
  "& .circleContent": {
    padding: "4px",
    overflow: "hidden",
    borderRadius: "300px",
    background: theme.palette.primary.main,
  },
}));

const VerticalLine = styled("div")({
  left: 25,
  width: 2,
  position: "absolute",
  background: "rgba(var(--body), 0.1)",
});

const UpperLine = styled(VerticalLine)({
  left: 25,
  width: 2,
  position: "absolute",
  background: "rgba(var(--body), 0.1)",
});

const LowerLine = styled(VerticalLine)({
  left: 25,
  width: 2,
  position: "absolute",
  background: "rgba(var(--body), 0.1)",
});

const StyledP = styled(Paragraph)({
  fontSize: "14px",
  borderRadius: 4,
  padding: "6px 12px",
  marginTop: "8px",
  marginBottom: "8px",
  background: "rgba(var(--body),0.03)",
});

const StyledLink = styled(Link)(({ theme }) => ({
  marginLeft: "4px",
  fontWeight: "500",
  color: theme.palette.primary.main,
}));

const NotificationCard = (props) => {
  const { notification, isFirstIndex, isLastIndex } = props;
  const theme = useTheme();
  const secondary = theme.palette.text.secondary;

  return (
    <Box position="relative">
      <Box pl={6} pr={4} py={3}>
        {!isFirstIndex && <UpperLine />}
        <Circle>
          <div className="circleContent"></div>
        </Circle>

        {!isLastIndex && <LowerLine />}

        <Box display="flex" justifyContent="space-between">
          <Box fontSize="13px">
            <H5 sx={{ mt: 0, mb: "4px", fontSize: "14px" }}>{notification.title}</H5>
            <Span sx={{ color: secondary }}>on</Span>
            <StyledLink to="/">Project Name</StyledLink>
          </Box>

          <Small sx={{ color: secondary }}>
            {getTimeDifference(new Date(notification.timestamp))}
            ago
          </Small>
        </Box>

        <StyledP>{notification.subtitle}</StyledP>
      </Box>

      <Divider />
    </Box>
  );
};

export default NotificationCard;
