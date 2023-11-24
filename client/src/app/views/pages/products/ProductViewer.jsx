import { Card, Divider, Grid, Icon, styled, useTheme } from "@mui/material";
import { AddToCartButton, Breadcrumb } from "app/components";
import { FlexAlignCenter } from "app/components/FlexBox";
import { H4, H5, Paragraph, Span } from "app/components/Typography";
import { useState } from "react";

// styled components
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
}));

const ProductCard = styled(Card)({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center",
});

const IMG = styled("img")({
  padding: 32,
  maxWidth: 550,
  width: "100%",
});

const CallBox = styled("div")({
  display: "flex",
  marginBottom: 16,
  alignItems: "center",
});

const ThumbImg = styled("img")({
  width: 80,
  marginLeft: 2,
  marginRight: 2,
  borderRadius: "4px",
});

const ProductViewer = () => {
  const [selectedImage, setSelectedImage] = useState("/assets/images/laptop-2.png");

  const theme = useTheme();

  const primary = theme.palette.primary.main;
  const secondary = theme.palette.text.secondary;

  return (
    <Container>
      <Container>
        <Breadcrumb routeSegments={[{ name: "Pages", path: "/pages" }, { name: "View Product" }]} />
      </Container>

      <Card sx={{ px: 4, py: 4 }} elevation={3}>
        <Grid container spacing={3}>
          <Grid item md={6} xs={12}>
            <ProductCard>
              <IMG src={selectedImage} alt="laptop" />

              <FlexAlignCenter gap={2} py={2}>
                {imageList.map((imgUrl) => (
                  <ThumbImg
                    src={imgUrl}
                    alt="laptop"
                    key={imgUrl}
                    url={imgUrl}
                    onClick={() => setSelectedImage(imgUrl)}
                  />
                ))}
              </FlexAlignCenter>
            </ProductCard>
          </Grid>

          <Grid item md={6} xs={12}>
            <H4 sx={{ mt: 0, mb: 2 }}>Asus VivoBook X512FL-EJ723T 10th Gen Intel Core i5</H4>
            <Paragraph sx={{ mt: 0, mb: 1, color: secondary }}>SKU: 0X50F0D</Paragraph>

            <Paragraph sx={{ mt: 0, mb: 2 }}>
              <Span sx={{ color: secondary }}>BRAND: </Span>
              <Span sx={{ color: primary }}>ASUS | More Laptop from ASUS</Span>
            </Paragraph>

            <Divider sx={{ mb: 2 }} />

            <AddToCartButton propStyle={{ mb: 2 }} amount={0} />

            <Divider sx={{ mb: 2 }} />

            <Paragraph sx={{ mt: 0, mb: 1, color: secondary, fontWeight: "500" }}>
              Have questions about this product (SKU: 0X2E615)
            </Paragraph>

            <CallBox>
              <Icon sx={{ mr: 1 }} fontSize="small" color="primary">
                call
              </Icon>
              <H5 sx={{ m: 0, color: primary }}>019638111777</H5>
            </CallBox>

            <Divider sx={{ mb: 2 }} />

            <H4 sx={{ mt: 0, mb: 2 }}>Specification</H4>

            <p>
              Brand ASUS Processor Intel Core i5-10210U 10th Gen CPU Cache 6MB Ram 4GB DDR4 Ram
              Details 1 x 4 GB Non-Removable Expansion Ram Slot 1 Storage 512GB PCIE G3 SSD Display
              15.6 FHD Antiglare LED Display Resolution 1920×1080 (WxH) FHD Optical Device No
              Graphics Chipset Nvidia MX250 Graphics Graphics Memory 2GB Networking WiFi, Bluetooth,
              Card Reader USB Port 1x USB 3.2 Gen 1 Type-A, 1x USB 3.2 Gen 1 Type-C Video Port HDMI
              Audio Port Combo Finger Print Yes Keyboard Back-lit Yes Operating System Win-10 Home
              Battery 2 Cell Li-Ion Power Adapter 65 W AC power adapter Specialty Finger Print
              Sensor, Backlit Keyboard, Voice control with Cortana support, BIOS Booting User
              Password Protection, Fingerprint sensor intergrated with Touchpad Others Backlit: LED
              Backlit, OLED: LCD, Brightness: 200nits, Aspect ratio: 16:9, Color gamut NTSC: 45%,
              Screen-to-body ratio: 88%, Output: 19V DC, 3.42A, 65W, Input: 100-240V AC 50/60Hz
              universal Warranty 2 years
            </p>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

const imageList = [
  "/assets/images/laptop-1.png",
  "/assets/images/laptop-2.png",
  "/assets/images/laptop-3.png",
];
export default ProductViewer;
