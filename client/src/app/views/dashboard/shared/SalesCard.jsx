import { Person } from "@mui/icons-material";
import { Card, Box, Button, Divider } from "@mui/material";
import { FlexBetween, FlexAlignCenter } from "app/components/FlexBox";
import { Paragraph } from "app/components/Typography";

const SalesCard = ({ bgColor }) => {
  const STYLE = {
    background: `url("/assets/images/circles.png"), linear-gradient(90deg, ${bgColor} -19.83%, ${bgColor} 189.85%)`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };

  return (
    <Card elevation={3} sx={STYLE}>
      <FlexBetween color="white">
        <FlexAlignCenter py={1} px={2}>
          <Person color="inherit" />
        </FlexAlignCenter>

        <Box p={1} borderLeft="1px solid white">
          <Button color="inherit">View Details</Button>
        </Box>
      </FlexBetween>

      <Divider sx={{ borderColor: "white" }} />

      <Box px={4} py={5} color="white">
        <Paragraph lineHeight={1}>Last week</Paragraph>

        <Paragraph py={1} fontSize={28} fontWeight={300}>
          New Users
        </Paragraph>

        <Paragraph lineHeight={1} fontSize={32} fontWeight={700}>
          200
        </Paragraph>
      </Box>
    </Card>
  );
};

export default SalesCard;
