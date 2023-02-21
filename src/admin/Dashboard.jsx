import React from "react";
import { Container, Row, Col } from "reactstrap";
import "../styles/dashboard.css";
import useGetData from "../custom-hooks/useGetData";
import products from "../assets/data/products";

const Dashboard = () => {
  const { data: productsList } = useGetData("products");
  const { data: users } = useGetData("users");
  const { data: ordersData } = useGetData("myorders");
  const totalQuantity = productsList.reduce((total, item) => {
    return total + Number(item.price);
  }, 0);

  const totalOrders = ordersData.length;

  return (
    <>
      <section>
        <Container>
          <Row>
            <Col className="lg-3">
              <div className="revenue__box">
                <h5>Total Sales</h5>
                <span>${totalQuantity}</span>
              </div>
            </Col>
            <Col className="lg-3">
              <div className="order__box">
                <h5>Total Orders</h5>
                <span>{totalOrders}</span>
              </div>
            </Col>
            <Col className="lg-3">
              <div className="products__box">
                <h5>Total Products</h5>
                <span>{productsList.length + products.length}</span>
              </div>
            </Col>
            <Col className="lg-3">
              <div className="users__box">
                <h5>Total Users</h5>
                <span>{users.length}</span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Dashboard;
