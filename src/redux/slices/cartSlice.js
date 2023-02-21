import { createSlice } from "@reduxjs/toolkit";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import useGetData from "../../custom-hooks/useGetData";
import { db } from "../../firebase.config";

const initialState = {
  cartItems: [],
  totalAmount: 0,
  totalQuantity: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.id === newItem.id
      );

      state.totalQuantity++;

      if (!existingItem) {
        // const addCarts = async () => {
        //   try {
        //     const docRef = await collection(db, "carts", id);

        //     await addDoc(docRef, {
        //       productName: newItem.productName,
        //       quantity: 1,
        //       price: newItem.price,
        //     });

        //     toast.success("Carts Successfully Saved!");
        //   } catch (err) {
        //     toast.error("Carts not Saved!");
        //   }
        // };
        // addCarts();

        state.cartItems.push({
          id: newItem.id,
          productName: newItem.productName,
          imgUrl: newItem.imgUrl,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
        });
      } else {
        // const updateCarts = async () => {
        //   try {
        //     await updateDoc(doc(db, "carts", id), {
        //       productName: newItem.productName,
        //       quantity: existingItem.quantity++,
        //       price: Number(existingItem.totalPrice) + Number(newItem.price),
        //     });

        //     toast.success("Carts Successfully Saved!");
        //   } catch (err) {
        //     toast.error("Carts not Saved!");
        //   }
        // };
        // updateCarts();
        existingItem.quantity++;
        existingItem.totalPrice =
          Number(existingItem.totalPrice) + Number(newItem.price);
      }

      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0
      );
    },

    deleteItem: (state, action) => {
      const id = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);
      if (existingItem) {
        state.cartItems = state.cartItems.filter((item) => item.id !== id);
        state.totalQuantity = state.totalQuantity - existingItem.quantity;
      }

      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0
      );
    },

    updateAddItem: (state, action) => {
      const id = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity++;
      }

      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0
      );
    },

    updateSubtractItem: (state, action) => {
      const id = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);

      if (existingItem.quantity !== 1) {
        existingItem.quantity--;
      } else {
        state.cartItems = state.cartItems.filter((item) => item.id !== id);
        state.totalQuantity = state.totalQuantity - existingItem.quantity;
      }

      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0
      );
    },
  },
});

export const cartActions = cartSlice.actions;

export default cartSlice.reducer;
