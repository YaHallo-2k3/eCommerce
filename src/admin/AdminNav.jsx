import React, { useRef, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import useAuth from "../custom-hooks/useAuth";
import "../styles/admin-nav.css";
import { NavLink, Link, useNavigate } from "react-router-dom";
import userIcon from "../assets/images/user-icon.png";
import { signOut } from "firebase/auth";
import { auth } from "../firebase.config";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const admin__nav = [
  { display: "Dashboard", path: "/dashboard" },
  { display: "All-Products", path: "/dashboard/all-products" },
  { display: "Add-Product", path: "/dashboard/add-product" },
  { display: "Categories", path: "/dashboard/categories" },
  { display: "Orders", path: "/dashboard/orders" },
  { display: "Users", path: "/dashboard/users" },
];

const AdminNav = () => {
  const { currentUser } = useAuth();
  const profileActionRef = useRef(null);
  const navigate = useNavigate();
  const logout = () => {
    signOut(auth)
      .then(() => {
        toast.success("Logged Out");
        navigate("/home");
      })
      .catch((error) => {
        toast.error(error.messase);
      });
  };

  const toggleProfileActions = () => {
    profileActionRef.current.classList.toggle("show__profileActions");
  };

  return (
    <>
      <header className="admin__header">
        <div className="admin__nav-top">
          <Container>
            <div className="admin__nav-wrapper-top">
              <div className="logo">
                <Link to="/home">
                  <h2>eCommerce</h2>
                </Link>
              </div>
              <div className="search__box">
                <input type="text" placeholder="Search..." />
                <span>
                  <i className="ri-search-line"></i>
                </span>
              </div>
              <div className="admin__nav-top-right">
                <span>
                  <i className="ri-notification-3-line"></i>
                </span>
                <span>
                  <i className="ri-shopping-bag-line"></i>
                </span>
                <div className="profile">
                  <motion.img
                    whileTap={{ scale: 1.2 }}
                    src={currentUser ? currentUser.photoURL : userIcon}
                    alt="user-icon"
                    onClick={toggleProfileActions}
                  />
                  <div
                    className="profile__actions"
                    ref={profileActionRef}
                    onClick={toggleProfileActions}
                  >
                    <span onClick={logout}>Logout</span>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </header>

      <section className="admin__menu p-0">
        <Container>
          <Row>
            <div className="admin__navigation">
              <ul className="admin__menu-list">
                {admin__nav.map((item, index) => (
                  <li key={index} className="admin__menu-item">
                    <NavLink
                      to={item.path}
                      className={(navClass) =>
                        navClass.isActive ? "active__admin-menu" : ""
                      }
                    >
                      {item.display}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default AdminNav;
