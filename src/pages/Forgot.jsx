import React, { useRef, useState } from "react";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase.config";
import { toast } from "react-toastify";
import "../styles/login.css";
import useGetData from "../custom-hooks/useGetData";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { data: productsData } = useGetData("users");

  const handleCheckMail = (e) => {
    e.preventDefault();
    const findMail = productsData.find((item) => item.email === email);
    findMail
      ? sendPasswordResetEmail(auth, email).then(
          toast.success("Confirm Check Mail!"),
          navigate("./login")
        )
      : toast.error("Can Not Find Mail!");
  };

  return (
    <Helmet title="Forgot Password">
      <section style={{ marginTop: 80 }}>
        <Container>
          <Row>
            {loading ? (
              <Col lg="12" className="text-center">
                <h5 className="fw-bold">Loading...</h5>
              </Col>
            ) : (
              <Col lg="6" className="m-auto text-center">
                <h3 className="fw-bold mb-4">Forgot Password</h3>
                <Form onSubmit={handleCheckMail} className="auth__form">
                  <FormGroup className="form__group">
                    <input
                      required
                      type="email"
                      placeholder="Enter your Email..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormGroup>
                  <button type="submit" className="buy__btn auth__btn">
                    Send Mail
                  </button>
                </Form>
              </Col>
            )}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Forgot;
