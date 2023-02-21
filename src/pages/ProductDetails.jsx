import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { useLocation, useParams } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import "../styles/product-details.css";
import { motion } from "framer-motion";
import ProductsList from "../components/UI/ProductsList";
import { useDispatch } from "react-redux";
import { cartActions } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";
import { db, storage } from "../firebase.config";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import useGetData from "../custom-hooks/useGetData";
import products from "../assets/data/products";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import useAuth from "../custom-hooks/useAuth";
import { useNavigate } from "react-router-dom";

const ProductDetails = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [tab, setTab] = useState("desc");
  const reviewUser = useRef("");
  const reviewMsg = useRef("");
  const dispatch = useDispatch();
  const [rating, setRating] = useState(null);
  const { id } = useParams();
  const { data: cartsData } = useGetData("carts");
  const docRef = doc(db, "products", id);
  const location = useLocation();
  const { currentUser } = useAuth();

  useEffect(() => {
    const productDetail = products.find((item) => item.id === id);
    const getProduct = async () => {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct(docSnap.data());
      } else {
        setProduct(productDetail);
      }
    };
    getProduct();
  }, [location]);

  const relatedProducts = products.filter(
    (item) => item.category === product.category
  );
  const submitHandler = (e) => {
    e.preventDefault();

    // const reviewUserName = reviewUser.current.value;
    // const reviewUserMsg = reviewMsg.current.value;
    // const reviewObj = {
    //   author: reviewUserName,
    //   text: reviewMsg,
    //   rating,
    // };

    // toast.success("Review Submitted");
  };

  const addToCart = async (e, item) => {
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
  };
  // dispatch(
  //   cartActions.addItem({
  //     id,
  //     imgUrl,
  //     productName,
  //     price,
  //   })
  // );
  // toast.success("Product Added Successfully!");

  // products.map((i) => {
  //   if (i.id == item.id) {
  //   }
  // });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product]);

  return (
    <Helmet title={product.productName}>
      <CommonSection title="Product Details" />
      <section className="pt-0">
        <Container>
          <Row>
            <Col lg="6">
              <img src={product.imgUrl} alt="" />
            </Col>
            <Col lg="6">
              <div className="product__details">
                <h2>{product.productName}</h2>
                <div className="product__rating d-flex align-items-center gap-5 mb-3">
                  <span>
                    <i className="ri-star-s-fill"></i>
                  </span>
                  <span>
                    <i className="ri-star-s-fill"></i>
                  </span>
                  <span>
                    <i className="ri-star-s-fill"></i>
                  </span>
                  <span>
                    <i className="ri-star-s-fill"></i>
                  </span>
                  <span>
                    <i className="ri-star-half-s-line"></i>
                  </span>
                </div>
                <div className="d-flex align-items-center gap-5">
                  <span className="product__price">${product.price}</span>
                  <span>Category: {product.category}</span>
                </div>
                <p className="mt-3">{product.shortDesc}</p>
                <motion.button
                  whileTap={{ scale: 1.2 }}
                  className="buy__btn"
                  onClick={(e) => addToCart(e, product)}
                >
                  Add to Cart
                </motion.button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <Row>
            <Col lg="12">
              <div className="tab__wrapper d-flex align-items-center gap-5">
                <h6
                  className={`${tab === "desc" ? "active__tab" : ""}`}
                  onClick={() => setTab("desc")}
                >
                  Description
                </h6>
                <h6
                  className={`${tab === "rev" ? "active__tab" : ""}`}
                  onClick={() => setTab("rev")}
                >
                  Reviews
                </h6>
              </div>
              {tab === "desc" ? (
                <div className="tab__content mt-5">
                  <p>{product.description}</p>
                </div>
              ) : (
                <div className="product__review mt-5">
                  <div className="review__wrapper">
                    <div className="review__form">
                      <h4>Leave your Experience</h4>
                      <form action="" onSubmit={submitHandler}>
                        <div className="form__group">
                          <input
                            type="text"
                            placeholder="Enter Name..."
                            ref={reviewUser}
                            required
                          />
                        </div>
                        <div className="form__group d-flex align-items-center gap-5 rating__group">
                          <motion.span
                            whileTap={{ scale: 1.2 }}
                            onClick={() => setRating(1)}
                          >
                            1<i className="ri-star-s-fill"></i>
                          </motion.span>
                          <motion.span
                            whileTap={{ scale: 1.2 }}
                            onClick={() => setRating(2)}
                          >
                            2<i className="ri-star-s-fill"></i>
                          </motion.span>
                          <motion.span
                            whileTap={{ scale: 1.2 }}
                            onClick={() => setRating(3)}
                          >
                            3<i className="ri-star-s-fill"></i>
                          </motion.span>
                          <motion.span
                            whileTap={{ scale: 1.2 }}
                            onClick={() => setRating(4)}
                          >
                            4<i className="ri-star-s-fill"></i>
                          </motion.span>
                          <motion.span
                            whileTap={{ scale: 1.2 }}
                            onClick={() => setRating(5)}
                          >
                            5<i className="ri-star-s-fill"></i>
                          </motion.span>
                        </div>
                        <div className="form__group">
                          <textarea
                            ref={reviewMsg}
                            rows={4}
                            type="text"
                            placeholder="Review Message..."
                            required
                          />
                        </div>

                        <motion.button
                          whileTap={{ scale: 1.2 }}
                          type="submit"
                          className="buy__btn"
                        >
                          Submit
                        </motion.button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </Col>

            <Col lg="12" className="mt-5">
              <h2 className="related__title">You might also like</h2>
            </Col>
            <ProductsList data={relatedProducts} />
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default ProductDetails;
