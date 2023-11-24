import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  {
    qty: 1,
    price: 987.0,
    title: "Bit Bass Headphone",
    id: "333sa680bdf4976dfgga21rt4",
    imgUrl: "/assets/images/products/headphone-2.jpg",
  },
  {
    qty: 1,
    price: 454.0,
    title: "Bass Speaker 1",
    id: "323sa680b324976dfgga21rt47",
    imgUrl: "/assets/images/products/speaker-2.jpg",
  },
  {
    qty: 1,
    price: 134.0,
    title: "Bass Speaker 2",
    id: "323sa680bdf4976dfgga21rt4",
    imgUrl: "/assets/images/products/headphone-1.jpg",
  },
];

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, actions) {
      const { payload } = actions;
      const findIndex = state.findIndex((item) => item.id === payload.id);

      if (findIndex !== -1) state[findIndex].qty++;
      else state.push({ ...payload, qty: 1 });
    },

    addToCartByQty(state, actions) {
      const { payload } = actions;
      const findIndex = state.findIndex((item) => item.id === payload.id);

      if (findIndex !== -1) state[findIndex].qty = payload.qty;
      else state.push({ ...payload, qty: payload.qty });
    },

    removeFromCart(state, actions) {
      const findIndex = state.findIndex((item) => item.id === actions.payload);
      if (findIndex !== -1) state.splice(findIndex, 1);
    },

    removeQtyFromCart(state, actions) {
      const findIndex = state.findIndex((item) => item.id === actions.payload);

      if (state[findIndex].qty > 1) state[findIndex].qty--;
      else state.splice(findIndex, 1);
    },

    clearCart(state) {
      state.splice(0, state.length);
    },
  },
});

export const { addToCart, addToCartByQty, removeFromCart, removeQtyFromCart, clearCart } =
  cartSlice.actions;
export const cartReducer = cartSlice.reducer;
