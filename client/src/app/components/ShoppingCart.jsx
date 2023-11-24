import { Clear, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { Badge, Box, Button, Drawer, Icon, IconButton, styled, ThemeProvider } from "@mui/material";
import useSettings from "app/hooks/useSettings";
import { addToCart, removeFromCart, removeQtyFromCart } from "app/redux/slices/cartSlice";
import { sideNavWidth, topBarHeight } from "app/utils/constant";
import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { themeShadows } from "./MatxTheme/themeColors";
import { H6, Small } from "./Typography";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  "& span": { color: theme.palette.text.primary },
  "& #disable": { color: theme.palette.text.disabled },
}));

const MiniCart = styled(Box)({
  height: "100%",
  display: "flex",
  width: sideNavWidth,
  flexDirection: "column",
});

const CartBox = styled(Box)({
  padding: "4px",
  display: "flex",
  paddingLeft: "16px",
  alignItems: "center",
  height: topBarHeight,
  boxShadow: themeShadows[6],
  "& h5": {
    marginTop: 0,
    marginBottom: 0,
    fontWeight: "500",
    marginLeft: "16px",
  },
});

const ProductBox = styled(Box)({
  gap: 5,
  display: "flex",
  padding: "8px 8px",
  alignItems: "center",
  transition: "background 300ms ease",
  "&:hover": { background: "rgba(0,0,0,0.01)" },
});

const ProductDetails = styled(Box)({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  "& h6": {
    width: 120,
    display: "block",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
});

function ShoppingCart({ container }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { settings } = useSettings();

  const [panelOpen, setPanelOpen] = useState(false);
  const cart = useSelector((state) => state.cart);

  const handleDrawerToggle = () => setPanelOpen(!panelOpen);

  const handleCheckoutClick = () => {
    setPanelOpen(false);
    navigate("/ecommerce/checkout");
  };

  // total cartlist items amount
  const totalAmount = cart.reduce((prev, curr) => prev + curr.price * curr.qty, 0);

  // remove product from cart handler
  const handleRemoveItem = (productId) => () => {
    dispatch(removeFromCart(productId));
  };

  // remove quantity from a product
  const handleQuantityDecrement = (productId) => () => {
    dispatch(removeQtyFromCart(productId));
  };

  // add quantity from a product
  const handleQuantityIncrement = (product) => () => {
    dispatch(addToCart(product));
  };

  return (
    <Fragment>
      <IconButton onClick={handleDrawerToggle}>
        <Badge color="secondary" badgeContent={cart.length}>
          <Icon sx={{ color: "text.primary" }}>shopping_cart</Icon>
        </Badge>
      </IconButton>

      <ThemeProvider theme={settings.themes[settings.activeTheme]}>
        <Drawer
          anchor={"right"}
          open={panelOpen}
          variant="temporary"
          container={container}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
        >
          <MiniCart>
            <CartBox>
              <Icon color="primary">shopping_cart</Icon>
              <h5>Cart</h5>
            </CartBox>

            <Box flexGrow={1} overflow="auto">
              {cart.map((product) => (
                <ProductBox key={product.id}>
                  <Box display="flex" flexDirection="column">
                    <StyledIconButton size="small" onClick={handleQuantityIncrement(product)}>
                      <KeyboardArrowUp sx={{ fontSize: 18 }} />
                    </StyledIconButton>

                    <StyledIconButton
                      size="small"
                      disabled={product.amount < 2}
                      onClick={handleQuantityDecrement(product.id)}
                    >
                      <KeyboardArrowDown sx={{ fontSize: 18 }} />
                    </StyledIconButton>
                  </Box>

                  <img src={product.imgUrl} alt={product.title} width="50" />

                  <ProductDetails>
                    <H6>{product.title}</H6>

                    <Small color="text.secondary">
                      ${product.price} x {product.qty}
                    </Small>
                  </ProductDetails>

                  <StyledIconButton size="small" onClick={handleRemoveItem(product.id)}>
                    <Clear sx={{ fontSize: 16 }} />
                  </StyledIconButton>
                </ProductBox>
              ))}
            </Box>

            <Button
              color="primary"
              variant="contained"
              onClick={handleCheckoutClick}
              disabled={cart.length === 0}
              sx={{ width: "100%", borderRadius: 0 }}
            >
              Checkout (${totalAmount.toFixed(2)})
            </Button>
          </MiniCart>
        </Drawer>
      </ThemeProvider>
    </Fragment>
  );
}

export default ShoppingCart;
