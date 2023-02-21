import React, { useRef, useState } from "react";
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import useGetData from "../custom-hooks/useGetData";
import { db, storage } from "../firebase.config";
import { doc, deleteDoc, updateDoc, collection } from "firebase/firestore";
import { toast } from "react-toastify";
import "../styles/all-products.css";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Link } from "react-router-dom";

const status = [
  { uid: "orderplaced", value: "Order Placed" },
  { uid: "cancel", value: "Cancel" },
  { uid: "successfuldelivery", value: "Successful Delivery" },
  { uid: "confirmordercompleted ", value: "Confirm Order Completed " },
];

const Orders = () => {
  const [enterStatus, setEnterStatus] = useState("");
  const [enterId, setEnterId] = useState("");
  const modalSection = useRef(null);
  const { data: productsData, loading } = useGetData("products");
  const { data: cartsData } = useGetData("myorders");
  const cartItems = cartsData.filter(
    (item) => item.status !== "Successful Delivery"
  );

  const updateOrder = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, "myorders", enterId), {
      status: enterStatus,
    });
    toast.success("Update Completed!");
    hideModalProducts();
  };

  const showModalProducts = () => {
    modalSection.current.classList.add("modal__open");
  };

  const hideModalProducts = () => {
    modalSection.current.classList.remove("modal__open");
  };

  const stopModalProducts = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      <section>
        <Container>
          <Row>
            <Col lg="12">
              <h4 className="mb-5 fw-bold">All Orders</h4>
              <table className="table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Date</th>
                    <th>Order ID</th>
                    <th>Order Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td className="py-5 fw-bold">Loading...</td>
                    </tr>
                  ) : (
                    cartItems.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.date}</td>
                        <td>
                          <Link to={`/orders/orderdetails/${item.id}`}>
                            {item.id}
                          </Link>
                        </td>
                        <td>${item.totalAmount}</td>
                        <td>{item.status}</td>
                        <td>
                          <button
                            onClick={() => {
                              setEnterId(item.id);
                              setEnterStatus(item.status);
                              showModalProducts();
                            }}
                            className="btn btn-success"
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </Col>
          </Row>
        </Container>
      </section>

      <section
        ref={modalSection}
        className="modal__section"
        onClick={() => hideModalProducts()}
      >
        <Container
          className="modal__container"
          onClick={(e) => stopModalProducts(e)}
        >
          <Row>
            <Col>
              <Form onSubmit={(e) => updateOrder(e)}>
                <FormGroup className="form__group">
                  <span>Status</span>
                  <select
                    className="w-100 p-2 mt-3"
                    value={enterStatus}
                    onChange={(e) => setEnterStatus(e.target.value)}
                  >
                    <option>Select Status</option>
                    {status.map((item, index) => (
                      <option key={index} value={item.value}>
                        {item.value}
                      </option>
                    ))}
                  </select>
                </FormGroup>
                <button type="submit" className="buy__btn modal__btn">
                  Update Product
                </button>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Orders;
