import { Edit } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  Chip,
  Divider,
  Grid,
  IconButton,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";
import { Breadcrumb } from "app/components";
import { FlexAlignCenter, FlexBetween, FlexBox } from "app/components/FlexBox";
import { H6, Paragraph } from "app/components/Typography";
import { Fragment } from "react";
import ComparisonChart from "../charts/echarts/ComparisonChart";
import DoughnutChart from "./shared/Doughnut";
import SalesCard from "./shared/SalesCard";

// styled components
const BodyTableCell = styled(TableCell)({
  paddingInline: "1.5rem",
});

const HeadTableCell = styled(BodyTableCell)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

const productList = [
  {
    imgUrl: "/assets/images/products/headphone-2.jpg",
    name: "Earphone",
    price: 100,
    available: 15,
  },
  {
    imgUrl: "/assets/images/products/headphone-3.jpg",
    name: "Earphone",
    price: 1500,
    available: 30,
  },
  {
    imgUrl: "/assets/images/sq-11.jpg",
    name: "Bulb",
    price: 1900,
    available: 35,
  },
  {
    imgUrl: "/assets/images/products/iphone-1.jpg",
    name: "Pen",
    price: 100,
    available: 0,
  },
  {
    imgUrl: "/assets/images/products/headphone-3.jpg",
    name: "Head phone",
    price: 1190,
    available: 5,
  },
];

const paymentList = [
  {
    img: "/assets/images/payment-methods/master-card.png",
    type: "Master Card",
    product: "Bundled product",
    amount: 909,
  },
  {
    img: "/assets/images/payment-methods/paypal.png",
    type: "Paypal",
    product: "Bundled product",
    amount: 303,
  },
  {
    img: "/assets/images/payment-methods/visa.png",
    type: "Visa",
    product: "Bundled product",
    amount: 330,
  },
  {
    img: "/assets/images/payment-methods/maestro.png",
    type: "Maestro",
    product: "Bundled product",
    amount: 909,
  },
  {
    img: "/assets/images/payment-methods/maestro.png",
    type: "Master Card",
    product: "Bundled product",
    amount: 909,
  },
];

const Sales = () => {
  const theme = useTheme();

  return (
    <Box m={3}>
      <Box mb={3}>
        <Breadcrumb
          routeSegments={[{ name: "Dashboard", path: "/dashboard" }, { name: "Sales" }]}
        />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <SalesCard bgColor={theme.palette.primary.main} />
        </Grid>

        <Grid item xs={12} md={4}>
          <SalesCard bgColor={theme.palette.error.main} />
        </Grid>

        <Grid item xs={12} md={4}>
          <SalesCard bgColor={theme.palette.warning.main} />
        </Grid>

        <Grid item lg={4} md={4} sm={12} xs={12}>
          <Card elevation={3} sx={{ height: "100%" }}>
            {paymentList.map((method, index) => (
              <Fragment key={index}>
                <FlexBetween px={3} py={2}>
                  <FlexBox alignItems="center" gap={2}>
                    <FlexAlignCenter
                      sx={{
                        p: 1,
                        width: 52,
                        height: 52,
                        borderRadius: 1,
                        overflow: "hidden",
                        backgroundColor: "grey.200",
                        "& img": { width: "100%" },
                      }}
                    >
                      <img src={method.img} alt="master card" />
                    </FlexAlignCenter>

                    <Box>
                      <Paragraph fontSize={15}>{method.type}</Paragraph>
                      <Paragraph color="text.secondary">{method.product}</Paragraph>
                    </Box>
                  </FlexBox>

                  <Paragraph fontSize={18} color="text.secondary">
                    ${method.amount}
                  </Paragraph>
                </FlexBetween>

                {index !== paymentList.length - 1 && <Divider />}
              </Fragment>
            ))}
          </Card>
        </Grid>

        <Grid item lg={8} md={8} sm={12} xs={12}>
          <Card elevation={6} sx={{ p: 3, height: "100%" }}>
            <H6 fontSize={16}>Website Vs App</H6>
            <Paragraph color="text.secondary" mb={3}>
              Last 6 months
            </Paragraph>

            <ComparisonChart
              height={300}
              color={[theme.palette.primary.main, theme.palette.primary.light]}
            />
          </Card>
        </Grid>

        <Grid item lg={8} md={8} sm={12} xs={12}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <H6 fontSize={16} p={3} pb={0}>
              Top Selling Products
            </H6>

            <TableContainer sx={{ minWidth: 600 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <HeadTableCell colSpan={4}>Name</HeadTableCell>
                    <HeadTableCell colSpan={2}>Revenue</HeadTableCell>
                    <HeadTableCell colSpan={3}>Stock Status</HeadTableCell>
                    <HeadTableCell colSpan={2}>Action</HeadTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {productList.map((product, index) => (
                    <TableRow key={index}>
                      <BodyTableCell colSpan={4} align="left">
                        <FlexBox alignItems="center" gap={2}>
                          <Avatar variant="rounded" src={product.imgUrl} alt="user" />
                          <Paragraph>{product.name}</Paragraph>
                        </FlexBox>
                      </BodyTableCell>

                      <BodyTableCell align="left" colSpan={2}>
                        $
                        {product.price > 999
                          ? (product.price / 1000).toFixed(1) + "k"
                          : product.price}
                      </BodyTableCell>

                      <BodyTableCell calign="left" colSpan={3}>
                        {(() => {
                          if (!product.available) {
                            return <Chip color="error" size="small" label="Out of Stock" />;
                          }

                          return product.available < 20 ? (
                            <Chip
                              size="small"
                              color="warning"
                              label={`${product.available} available`}
                            />
                          ) : (
                            <Chip color="primary" size="small" label="In Stock" />
                          );
                        })()}
                      </BodyTableCell>

                      <BodyTableCell colSpan={2}>
                        <IconButton>
                          <Edit color="primary" />
                        </IconButton>
                      </BodyTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        <Grid item lg={4} md={4} sm={12} xs={12}>
          <Card elevation={6} sx={{ p: 3, height: "100%" }}>
            <H6 fontSize={16}>Traffic Sources</H6>
            <Paragraph color="text.secondary" mb={3}>
              Last 30 days
            </Paragraph>

            <DoughnutChart
              height="300px"
              color={[
                theme.palette.primary.dark,
                theme.palette.primary.main,
                theme.palette.primary.light,
              ]}
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Sales;
