import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../../styles/product-card.css";
import { Col } from "reactstrap";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { cartActions } from "../../redux/slices/cartSlice";
import { toast } from "react-toastify";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase.config";
import useGetData from "../../custom-hooks/useGetData";
import useAuth from "../../custom-hooks/useAuth";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ item }) => {
  const { data: cartsData } = useGetData("carts");
  const { currentUser } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addToCart = async (e) => {
    e.preventDefault();
    if (currentUser) {
      try {
        const cartItems = cartsData.filter(
          (item) => item.email === currentUser.email
        );
        const isAdded = cartItems.find((product) => product.uid === item.id);
        if (isAdded) {
          const docRef = await doc(db, "carts", isAdded.id);
          await updateDoc(docRef, {
            quantity: ++isAdded.quantity,
          });
        } else {
          const docRef = await collection(db, "carts");
          await addDoc(docRef, {
            uid: item.id,
            productName: item.productName,
            category: item.category,
            quantity: 1,
            price: item.price,
            description: item.description,
            shortDesc: item.shortDesc,
            imgUrl: item.imgUrl,
            email: currentUser.email,
          });
        }
        toast.success("Product Successfully Added!");
      } catch (err) {
        toast.error("Product not Added!");
      }
    } else {
      navigate("/login");
      toast.warn("Please Login!");
    }

    // dispatch(
    //   cartActions.addItem({
    //     id: item.id,
    //     productName: item.productName,
    //     price: item.price,
    //     imgUrl: item.imgUrl,
    //   })
    // );
    // toast.success("Product Added Successfully");
  };

  return (
    <Col lg="3" md="4" className="mb-3">
      <div className="product__item">
        <div className="product__img">
          <motion.img whileHover={{ scale: 0.9 }} src={item.imgUrl} alt="" />
        </div>
        <div className="p-2 product__info">
          <h3 className="product__name">
            <Link to={`/shop/${item.id}`}>{item.productName}</Link>
          </h3>
          <span>{item.category}</span>
        </div>
        <div className="product__card-bottom d-flex align-items-center justify-content-between p-2">
          <span className="price">${item.price}</span>
          <motion.span whileTap={{ scale: 1.2 }} onClick={(e) => addToCart(e)}>
            <i className="ri-add-line"></i>
          </motion.span>
        </div>
      </div>
    </Col>
  );
};

export default ProductCard;
