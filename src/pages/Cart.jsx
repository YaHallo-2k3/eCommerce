import React, { useState } from "react";
import "../styles/cart.css";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import { Container, Row, Col } from "reactstrap";
import { motion } from "framer-motion";
import { cartActions } from "../redux/slices/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import useGetData from "../custom-hooks/useGetData";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase.config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { toast } from "react-toastify";
import useAuth from "../custom-hooks/useAuth";

const Cart = () => {
  const [enterTitle, setEnterTitle] = useState("");
  const [enterQuantity, setEnterQuantity] = useState("");
  const [enterPrice, setEnterPrice] = useState("");
  const [enterProductImg, setEnterProductImg] = useState(null);
  const [loading, setLoading] = useState(false);
  // const cartItems = useSelector((state) => state.cart.cartItems);
  const { currentUser } = useAuth();
  const email = currentUser.email;
  // const totalAmount = useSelector((state) => state.cart.totalAmount);
  const { data: cartsData } = useGetData("carts");
  const cartItems = cartsData.filter((item) => item.email === email);
  const totalAmount = cartItems.reduce(
    (accmulator, item) => accmulator + item.quantity * item.price,
    0
  );

  const findId = (email) => {
    const filteredEmail = cartsData.filter((item) => item.email === email);
    return filteredEmail.map((item) => item.id);
  };

  const saveCarts = async (e, productName, quantity, price) => {
    e.preventDefault();
    setLoading(true);
    try {
      const docRef = await collection(db, "carts");

      await addDoc(docRef, {
        productName,
        quantity,
        price,
        email,
      });
      setLoading(false);
      toast.success("Carts Successfully Saved!");
    } catch (err) {
      setLoading(false);
      toast.error("Carts not Saved!");
    }
  };

  const deleteCarts = async (id) => {
    await deleteDoc(doc(db, "carts", id));
  };

  return (
    <Helmet title="Cart">
      <CommonSection title="Shopping Cart" />
      <section>
        <Container>
          <Row>
            <Col lg="9">
              {cartItems.length === 0 ? (
                <h2 className="fs-4 text-center">No Item add to the Cart</h2>
              ) : (
                <table className="table bordered">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Delete</th>
                    </tr>
                  </thead>

                  <tbody>
                    {cartItems.map((item, index) => (
                      <Tr item={item} key={index} />
                    ))}
                  </tbody>
                </table>
              )}
            </Col>
            <Col lg="3">
              <div className="">
                <h6 className="d-flex align-items-center justify-content-between">
                  SubTotal
                  <span className="fs-4 fw-bold">${totalAmount}</span>
                </h6>
              </div>
              <p className="fs-6 mt-2">
                Taxes and Shipping will calculate in Checkout
              </p>
              <div className="">
                <button className="buy__btn w-100 mt-3">
                  <Link to="/checkout">Checkout</Link>
                </button>
                <button className="buy__btn w-100 mt-3">
                  <Link to="/shop">Continue Shopping</Link>
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

const Tr = ({ item }) => {
  const dispatch = useDispatch();
  const deleteProduct = async () => {
    await deleteDoc(doc(db, "carts", item.id));
    toast.success("Product is Deleted!");
    // dispatch(cartActions.deleteItem(item.id));
  };

  const increase = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "carts", item.id);
      await updateDoc(docRef, {
        quantity: ++item.quantity,
      });
    } catch (error) {
      toast.error("Product not Updated!");
    }
    // dispatch(cartActions.updateAddItem(item.id));
  };

  const decrease = async (e) => {
    e.preventDefault();
    try {
      if (item.quantity === 1) {
        await deleteDoc(doc(db, "carts", item.id));
      } else {
        const docRef = doc(db, "carts", item.id);
        await updateDoc(docRef, {
          quantity: --item.quantity,
        });
      }
    } catch (error) {
      toast.error("Product not Updated!");
    }
    // dispatch(cartActions.updateSubtractItem(item.id));
  };

  return (
    <tr>
      <td>
        <img src={item.imgUrl} alt="" />
      </td>
      <td>{item.productName}</td>
      <td>${item.price}</td>
      <td>
        <span onClick={(e) => decrease(e)} className="mx-2">
          <i className="ri-subtract-fill"></i>
        </span>
        {item.quantity}
        <span onClick={(e) => increase(e)} className="mx-2">
          <i className="ri-add-fill"></i>
        </span>
      </td>
      <td>
        <motion.i
          whileTap={{ scale: 1.2 }}
          onClick={deleteProduct}
          className="ri-delete-bin-line"
        ></motion.i>
      </td>
    </tr>
  );
};

export default Cart;
