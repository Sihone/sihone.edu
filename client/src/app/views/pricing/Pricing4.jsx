import { Box, Button, Card, Icon, styled } from "@mui/material";
import { H1, H5, Paragraph } from "app/components/Typography";
import { Link } from "react-router-dom";

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  position: "relative",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
}));

const StyledButton = styled(Button)(() => ({
  color: "#08ad6c",
  overflow: "hidden",
  padding: "2px 16px",
  borderRadius: "300px",
  fontSize: "0.8125rem",
  background: "rgba(9, 182, 109, 0.15)",
  transition: "all 250ms",
  "&:hover": {
    color: "#ffffff",
    background: `rgba(9, 182, 109, 1) !important`,
    fallbacks: [{ color: "white !important" }],
  },
}));

const StyledTable = styled("table")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  minWidth: 600,
  "& tbody": {
    "& tr": {
      "& td": {
        paddingTop: "0.75rem",
        paddingBottom: "0.75rem",
        textAlign: "center",
        color: theme.palette.text.secondary,
        "& span": { fontSize: 20, color: "#08ad6c" },
        "& h5": { color: "black" },
      },
      "& .title": { paddingTop: "32px" },
      "& td:first-of-type": {
        textAlign: "left",
      },
    },
    "& tr:first-of-type": {
      "& h5": { color: "black" },
      "& p, a": {
        padding: "10px 20px",
        color: theme.palette.text.secondary,
      },
      "& a": { display: "block" },
      "& button": {
        paddingLeft: "24px",
        paddingRight: "24px",
        marginBottom: "16px",
        overflow: "hidden",
        borderRadius: "300px",
      },
    },
  },
}));

const Pricing4 = () => {
  return (
    <Container>
      <Card sx={{ px: 3, py: 7 }} elevation={3}>
        <H1 sx={{ mb: 6, fontSize: 32, textAlign: "center" }}>Simple Pricing</H1>
        <Box overflow="auto">
          <StyledTable>
            <tbody>
              <tr>
                <td></td>
                {["Essential", "Premium", "Enterprise"].map((item, ind) => (
                  <td key={ind}>
                    <Box textAlign="center">
                      <H5>{item}</H5>
                      <Paragraph>All the basics for event &amp; team crowdfunding</Paragraph>
                      <Button variant="contained" color="primary">
                        Get Started
                      </Button>
                      <Link to="/">Learn More</Link>
                    </Box>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="title">
                  <H5>Pricing</H5>
                </td>
              </tr>

              <tr>
                <td>Plan Cost</td>
                <td>Free</td>
                <td>
                  <StyledButton>Contact Us</StyledButton>
                </td>
                <td>
                  <StyledButton>Contact Us</StyledButton>
                </td>
              </tr>

              <tr>
                <td>Platform fee</td>
                <td>5%</td>
                <td>3%</td>
                <td>
                  <StyledButton>Contact Us</StyledButton>
                </td>
              </tr>

              <tr>
                <td>Payment processing</td>
                <td>2.9%</td>
                <td>2.4%</td>
                <td>
                  <StyledButton>Contact Us</StyledButton>
                </td>
              </tr>

              <tr>
                <td className="title">
                  <H5>Features</H5>
                </td>
              </tr>

              <tr>
                <td>Unlimited Fundraising campaigns</td>
                <td>
                  <Icon>check_circle</Icon>
                </td>
                <td>
                  <Icon>check_circle</Icon>
                </td>
                <td>
                  <Icon>check_circle</Icon>
                </td>
              </tr>

              <tr>
                <td>Easy access to funds</td>
                <td>
                  <Icon>check_circle</Icon>
                </td>
                <td>
                  <Icon>check_circle</Icon>
                </td>
                <td>
                  <Icon>check_circle</Icon>
                </td>
              </tr>

              <tr>
                <td>Mobile Optimized</td>
                <td>
                  <Icon>check_circle</Icon>
                </td>
                <td>
                  <Icon>check_circle</Icon>
                </td>
                <td>
                  <Icon>check_circle</Icon>
                </td>
              </tr>

              <tr>
                <td>Basic donor data</td>
                <td>
                  <Icon>check_circle</Icon>
                </td>
                <td>
                  <Icon>check_circle</Icon>
                </td>
                <td>
                  <Icon>check_circle</Icon>
                </td>
              </tr>

              <tr>
                <td>Team fundraising</td>
                <td>
                  <Icon>check_circle</Icon>
                </td>
                <td>
                  <Icon>check_circle</Icon>
                </td>
                <td>
                  <Icon>check_circle</Icon>
                </td>
              </tr>

              <tr>
                <td>Unlimited Fundraising events</td>
                <td></td>
                <td>
                  <Icon>check_circle</Icon>
                </td>
                <td>
                  <Icon>check_circle</Icon>
                </td>
              </tr>

              <tr>
                <td>Comphensive donor data</td>
                <td></td>
                <td>
                  <Icon>check_circle</Icon>
                </td>
                <td>
                  <Icon>check_circle</Icon>
                </td>
              </tr>
            </tbody>
          </StyledTable>
        </Box>
      </Card>
    </Container>
  );
};

export default Pricing4;
