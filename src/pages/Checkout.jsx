import React, { useState } from "react";
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import "../styles/checkout.css";
import { useSelector } from "react-redux";
import useGetData from "../custom-hooks/useGetData";
import useAuth from "../custom-hooks/useAuth";
import { toast } from "react-toastify";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";
import { Link } from "react-router-dom";

const Checkout = () => {
  const [checkout, setCheckout] = useState(false);
  const [enterName, setEnterName] = useState("");
  const [enterMail, setEnterMail] = useState("");
  const [enterPhone, setEnterPhone] = useState("");
  const [enterAddress, setEnterAddress] = useState("");
  const { currentUser } = useAuth();
  const email = currentUser.email;
  const { data: cartsData } = useGetData("carts");
  const cartItems = cartsData.filter((item) => item.email === email);
  // const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const totalQuantity = cartItems.reduce(
    (accmulator, item) => accmulator + item.quantity,
    0
  );
  // const totalAmount = useSelector((state) => state.cart.totalAmount);
  const totalAmount = cartItems.reduce(
    (accumulator, item) => accumulator + item.price * item.quantity,
    0
  );

  const deleteCart = async (id) => {
    await deleteDoc(doc(db, "carts", id));
  };

  const isCheckout = async (e) => {
    e.preventDefault();
    try {
      const docRef = await collection(db, "myorders");
      await addDoc(docRef, {
        name: enterName,
        mail: enterMail,
        phone: enterPhone,
        address: enterAddress,
        date: new Date().toLocaleString(),
        totalAmount: totalAmount,
        status: "Order Placed",
        email,
        cartItems,
      });
      cartItems.map((item) => deleteCart(item.id));
      toast.success("Checkout Successfully!");
      setCheckout(true);
    } catch (err) {
      toast.error("Checkout Failed!");
      setCheckout(false);
    }
  };

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, "carts", id));
  };

  return (
    <Helmet title="Checkout">
      <CommonSection title="Checkout" />
      <section>
        {!checkout ? (
          <Container>
            <Row>
              <Col lg="8">
                <h6 className="mb-4 fw-bold">Billing Information</h6>
                <Form onSubmit={(e) => isCheckout(e)} className="billing__form">
                  <FormGroup className="form__group">
                    <input
                      value={enterName}
                      onChange={(e) => setEnterName(e.target.value)}
                      required
                      type="text"
                      placeholder="Enter your Name..."
                    />
                  </FormGroup>

                  <FormGroup className="form__group">
                    <input
                      value={enterMail}
                      onChange={(e) => setEnterMail(e.target.value)}
                      required
                      type="email"
                      placeholder="Enter your Mail..."
                    />
                  </FormGroup>

                  <FormGroup className="form__group">
                    <input
                      value={enterPhone}
                      onChange={(e) => setEnterPhone(e.target.value)}
                      required
                      type="number"
                      placeholder="Phone Number..."
                    />
                  </FormGroup>

                  <FormGroup className="form__group">
                    <input
                      value={enterAddress}
                      onChange={(e) => setEnterAddress(e.target.value)}
                      required
                      type="text"
                      placeholder="Address..."
                    />
                  </FormGroup>
                  <button type="submit" className="buy__btn fw-bold">
                    Place an Order
                  </button>
                </Form>
              </Col>

              <Col lg="4">
                <div className="checkout__cart">
                  <h6>
                    Total Quantity: <span>{totalQuantity}</span>
                  </h6>
                  <h6>
                    SubTotal: <span>${totalAmount}</span>
                  </h6>
                  <h6>
                    <span>
                      Shipping: <br />
                      Free shipping
                    </span>
                    <span>$0</span>
                  </h6>
                  <h4>
                    Total Cost: <span>${totalAmount}</span>
                  </h4>
                </div>
                {cartItems.map((item, index) => (
                  <div key={index} className="checkout__cartItems">
                    <h6 className="fw-bold">Product: {item.productName}</h6>
                    <div className="d-flex justify-content-between mt-3">
                      <h6>Quantity: {item.quantity}</h6>
                      <h6>Price: ${item.price * item.quantity}</h6>
                    </div>
                  </div>
                ))}
              </Col>
            </Row>
          </Container>
        ) : (
          <Container>
            <Row className="justify-content-center">
              <Col className="text-center" lg="6">
                <h3 className="fw-bold">Checkout Successfully</h3>
                <h6 className="my-4">Thank you for your purchase</h6>
                <Link to="/myorders" className="btn btn-primary">
                  View Order Status
                </Link>
              </Col>
            </Row>
          </Container>
        )}
      </section>
    </Helmet>
  );
};

export default Checkout;
