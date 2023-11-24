import {
  AssignmentTurnedIn,
  Book,
  Description,
  Games,
  ListAlt,
  PlayCircleFilled,
  PlayCircleOutline,
  Textsms,
  ViewWeek,
  Web,
} from "@mui/icons-material";
import {
  Card,
  Grid,
  Box,
  LinearProgress,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  styled,
  Avatar,
  Chip,
  Button,
  alpha,
  Tooltip,
} from "@mui/material";
import { Breadcrumb } from "app/components";
import { FlexAlignCenter, FlexBetween, FlexBox } from "app/components/FlexBox";
import { H6, Paragraph, Small } from "app/components/Typography";
import EducationChart from "./shared/EducationChart";

// styled components
const BodyTableCell = styled(TableCell)({
  paddingInline: 24,
});

const HeadTableCell = styled(BodyTableCell)({
  paddingBlock: 16,
});

const StyledChip = styled(Chip)({
  color: "white",
  borderRadius: 8,
});

const resultList = [
  { name: "React", date: "20 March", value: 50 },
  { name: "Angular", date: "10 March", value: 85 },
  { name: "Javascript", date: "20 March", value: 40 },
  { name: "CSS", date: "30 March", value: 90 },
  { name: "HTML", date: "10 March", value: 90 },
];

const productList = [
  {
    imgUrl: "/assets/images/logos/angular.png",
    name: "Angular Beyond the Basics",
    price: 100,
    available: 15,
  },
  {
    imgUrl: "/assets/images/logos/react.png",
    name: "React Development Course",
    price: 150,
    available: 30,
  },
  {
    imgUrl: "/assets/images/logos/webpack.png",
    name: "Webpack for Busy Developer",
    price: 190,
    available: 35,
  },
  {
    imgUrl: "/assets/images/logos/sass.png",
    name: "Complete SASS course",
    price: 100,
    available: 0,
  },
  {
    imgUrl: "/assets/images/logos/bootstrap.png",
    name: "Bootstrap for Everyone",
    price: 119,
    available: 5,
  },
];

const LearningManagement = () => {
  const routes = [{ name: "Dashboard", path: "/dashboard" }, { name: "Learning" }];

  return (
    <Box m={3}>
      <Box mb={3}>
        <Breadcrumb routeSegments={routes} />
      </Box>

      <Grid container spacing={3}>
        <Grid item lg={8} md={8} sm={12} xs={12}>
          <Card
            elevation={6}
            sx={{
              p: 4,
              display: "flex",
              alignItems: "center",
              bgcolor: "primary.main",
              justifyContent: "space-between",
              overflow: "visible",
            }}
          >
            <Box color="white">
              <Paragraph fontSize={22} mb={1}>
                Welcome back! Watson
              </Paragraph>

              <Paragraph color="grey.300">
                You have completed <b>40%</b> of your goal this week! <br />
                Start a new goal and improve your result
              </Paragraph>
            </Box>

            <Box
              mt={-11}
              alt="designer"
              component="img"
              src="/assets/images/illustrations/designer.svg"
              display={{ md: "block", xs: "none" }}
            />
          </Card>

          <Box mt={3}>
            <Grid container spacing={3}>
              <Grid item md={5} xs={12}>
                <Card sx={{ p: 3, height: "100%" }}>
                  <H6 fontSize={16}>Results</H6>

                  {resultList.map(({ date, name, value }, i) => (
                    <FlexBetween pt={2} key={i}>
                      <FlexBox flexGrow={1} alignItems="baseline" gap={1}>
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            backgroundColor: value < 51 ? "secondary.main" : "primary.main",
                          }}
                        />

                        <Box>
                          <Paragraph>{name}</Paragraph>
                          <Small color="text.secondary">{date}</Small>
                        </Box>
                      </FlexBox>

                      <FlexBox gap={2} maxWidth={120} alignItems="center" width="100%">
                        <LinearProgress
                          value={value}
                          variant="determinate"
                          color={value < 51 ? "secondary" : "primary"}
                          sx={{ flex: 1, borderRadius: 2, height: 5 }}
                        />

                        <Paragraph color={value < 51 ? "secondary.main" : "primary.main"}>
                          {value}%
                        </Paragraph>
                      </FlexBox>
                    </FlexBetween>
                  ))}
                </Card>
              </Grid>

              <Grid item md={7} xs={12}>
                <Card sx={{ p: 3 }}>
                  <H6 fontSize={16} mb={2}>
                    Study Time Last Week
                  </H6>

                  <EducationChart height={280} />
                </Card>
              </Grid>
            </Grid>
          </Box>

          <Box mt={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card
                  elevation={6}
                  sx={{
                    p: 3,
                    display: "flex",
                    alignItems: "center",
                    bgcolor: "primary.main",
                    justifyContent: "space-between",
                  }}
                >
                  <FlexBox alignItems="center" gap={2}>
                    <FlexAlignCenter
                      width={40}
                      height={40}
                      borderRadius={1}
                      bgcolor="primary.light"
                    >
                      <Paragraph fontWeight={500} color="white">
                        C1
                      </Paragraph>
                    </FlexAlignCenter>

                    <Box className="ml-12">
                      <Paragraph color="grey.300">You watched today</Paragraph>

                      <H6 fontSize={15} color="white" mt={0.5}>
                        Python 101
                      </H6>
                    </Box>
                  </FlexBox>

                  <IconButton>
                    <PlayCircleOutline sx={{ fontSize: 34, color: "white" }} />
                  </IconButton>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card
                  elevation={6}
                  sx={{
                    p: 3,
                    display: "flex",
                    alignItems: "center",
                    bgcolor: "error.main",
                    justifyContent: "space-between",
                  }}
                >
                  <FlexBox alignItems="center" gap={2}>
                    <FlexAlignCenter width={40} height={40} borderRadius={1} bgcolor="error.light">
                      <Paragraph fontWeight={500} color="white">
                        C2
                      </Paragraph>
                    </FlexAlignCenter>

                    <Box className="ml-12">
                      <Paragraph color="grey.300">You watched today</Paragraph>

                      <H6 fontSize={15} color="white" mt={0.5}>
                        Javascript 101
                      </H6>
                    </Box>
                  </FlexBox>

                  <IconButton>
                    <PlayCircleOutline sx={{ fontSize: 34, color: "white" }} />
                  </IconButton>
                </Card>
              </Grid>
            </Grid>
          </Box>

          <Card elevation={6} sx={{ mt: 3 }}>
            <div className="overflow-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <HeadTableCell colSpan={4}>Course</HeadTableCell>
                    <HeadTableCell colSpan={2}>Fee</HeadTableCell>
                    <HeadTableCell colSpan={2}>Enrolled</HeadTableCell>
                    <HeadTableCell colSpan={1}>Action</HeadTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {productList.map((product, index) => (
                    <TableRow key={index}>
                      <BodyTableCell colSpan={4} align="left">
                        <FlexBox alignItems="center" gap={1}>
                          <Avatar variant="square" src={product.imgUrl} alt="user" />
                          <Paragraph>{product.name}</Paragraph>
                        </FlexBox>
                      </BodyTableCell>

                      <BodyTableCell align="left" colSpan={2}>
                        $
                        {product.price > 999
                          ? (product.price / 1000).toFixed(1) + "k"
                          : product.price}
                      </BodyTableCell>

                      <BodyTableCell align="left" colSpan={2}>
                        {product.available ? (
                          product.available < 20 ? (
                            <StyledChip size="small" color="secondary" label={product.available} />
                          ) : (
                            <StyledChip size="small" color="primary" label={product.available} />
                          )
                        ) : (
                          <StyledChip size="small" color="error" label={product.available} />
                        )}
                      </BodyTableCell>

                      <BodyTableCell colSpan={1}>
                        <IconButton>
                          <PlayCircleFilled color="secondary" />
                        </IconButton>
                      </BodyTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </Grid>

        <Grid item lg={4} md={4} sm={12} xs={12}>
          <Card elevation={6} sx={{ p: 3, height: "100%" }}>
            <Box
              borderRadius={2}
              sx={{
                p: 4,
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
                backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
              }}
            >
              <img src="/assets/images/illustrations/upgrade.svg" alt="upgrade" />

              <Paragraph py={3} color="text.secondary" textAlign="center">
                Upgrade to <b>PRO</b> for <br /> more resources
              </Paragraph>

              <Button size="large" variant="contained" color="primary">
                Upgrade Now
              </Button>
            </Box>

            <Box mt={4}>
              <H6 fontSize={16}>Achievements</H6>

              <FlexBox mt={2} alignItems="center" gap={3}>
                <Tooltip title="Completed first course" placement="top">
                  <img src="/assets/images/badges/badge-1.svg" alt="badge" height="25px" />
                </Tooltip>

                <Tooltip title="Won a challenge" placement="top">
                  <img src="/assets/images/badges/badge-2.svg" alt="badge" height="25px" />
                </Tooltip>

                <Tooltip title="Won a competition" placement="top">
                  <img src="/assets/images/badges/badge-3.svg" alt="badge" height="25px" />
                </Tooltip>
              </FlexBox>
            </Box>

            <Box mt={4}>
              <H6 fontSize={16} mb={1}>
                Reminder
              </H6>

              <ListItem Icon={ViewWeek} title="Data Structue Test" date="28 December 2019" />
              <ListItem Icon={Games} title="Front End Test" date="29 December 2019" />
              <ListItem Icon={Textsms} title="Backend Test" date="30 December 2019" />
              <ListItem Icon={Book} title="Algorithm Test" date="31 December 2019" />
            </Box>

            <Box mt={4}>
              <H6 fontSize={16} mb={1}>
                Upcoming Challenges
              </H6>

              <ListItem Icon={Web} title="Ecommerce Website" date="28 December 2019" />

              <ListItem
                color="error"
                Icon={ListAlt}
                title="Todo Application"
                date="29 December 2019"
              />
              <ListItem Icon={Description} title="Project Management" date="30 December 2019" />

              <ListItem
                color="warning"
                Icon={AssignmentTurnedIn}
                title="Invoice Design"
                date="31 December 2019"
              />

              <ListItem
                color="success"
                Icon={AssignmentTurnedIn}
                title="E-Larning Platfrom"
                date="01 January 2020"
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

const ListItem = ({ Icon, title, date, color = "primary" }) => {
  const getColor = (theme) => {
    let bgColor = theme.palette.primary.main;

    if (color === "error") bgColor = theme.palette.error.main;
    if (color === "warning") bgColor = theme.palette.warning.main;
    if (color === "success") bgColor = theme.palette.success.main;

    return alpha(bgColor, 0.1);
  };

  return (
    <FlexBetween
      sx={{ p: 1, borderRadius: 2, cursor: "pointer", ":hover": { backgroundColor: "grey.100" } }}
    >
      <FlexBox gap={2}>
        <FlexAlignCenter
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            backgroundColor: (theme) => getColor(theme),
          }}
        >
          <Icon color={color} />
        </FlexAlignCenter>

        <Box>
          <Paragraph>{title}</Paragraph>
          <Paragraph>{date}</Paragraph>
        </Box>
      </FlexBox>

      <IconButton>
        <PlayCircleOutline color={color} />
      </IconButton>
    </FlexBetween>
  );
};

export default LearningManagement;
