import React, { useRef, useEffect, useState } from "react";
import { Container, Row } from "reactstrap";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import "./header.css";
import { motion } from "framer-motion";
import logo from "../../assets/images/eco-logo.png";
import userIcon from "../../assets/images/user-icon.png";
import { useSelector } from "react-redux";
import useAuth from "../../custom-hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase.config";
import { toast } from "react-toastify";
import useGetData from "../../custom-hooks/useGetData";

const nav__links = [
  {
    path: "home",
    display: "Home",
  },
  {
    path: "shop",
    display: "Shop",
  },
  {
    path: "cart",
    display: "Cart",
  },
];

const Header = () => {
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [userItems, setUserItems] = useState({});
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const profileActionRef = useRef(null);
  const { data: cartsData } = useGetData("carts");
  const { data: usersData } = useGetData("users");
  const location = useLocation();

  useEffect(() => {
    if (currentUser) {
      const email = currentUser.email;
      const cartItems = cartsData.filter((item) => item.email === email);
      setTotalQuantity(
        cartItems.reduce((accmulator, item) => accmulator + item.quantity, 0)
      );
    }
  }, [cartsData]);

  useEffect(() => {
    if (currentUser) {
      setUserItems(usersData.find((item) => item.id === currentUser.uid));
    }
  });

  const logout = () => {
    signOut(auth)
      .then(() => {
        toast.success("Logged Out");
        navigate("/login");
      })
      .catch((err) => {
        toast.error(err.messase);
      });
  };

  const menuToggle = () => menuRef.current.classList.toggle("active__menu");
  const navigateToCart = () => {
    navigate("/cart");
  };

  const toggleProfileActions = () => {
    profileActionRef.current.classList.toggle("show__profileActions");
  };

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <Row>
          <div className="nav__wrapper">
            <div className="logo">
              <img src={logo} alt="logo" />
              <div className="">
                <Link to="/home">
                  <h1>eCommerce</h1>
                </Link>
              </div>
            </div>

            <div className="navigation" ref={menuRef} onClick={menuToggle}>
              <ul className="menu">
                {nav__links.map((item, index) => {
                  return (
                    <li className="nav__item" key={index}>
                      <NavLink
                        to={item.path}
                        className={(navClass) =>
                          navClass.isActive ? "nav__active" : ""
                        }
                      >
                        {item.display}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="nav__icons">
              <span className="fav__icon">
                <i className="ri-heart-line"></i>
                <span className="badge">9+</span>
              </span>
              <span className="cart__icon" onClick={navigateToCart}>
                <i className="ri-shopping-bag-line"></i>
                <span className="badge">{currentUser ? totalQuantity : 0}</span>
              </span>
              <div className="profile">
                <motion.img
                  whileTap={{ scale: 1.2 }}
                  src={currentUser ? currentUser.photoURL : userIcon}
                  alt=""
                  onClick={toggleProfileActions}
                />
                <div
                  className="profile__actions"
                  ref={profileActionRef}
                  onClick={toggleProfileActions}
                >
                  {currentUser ? (
                    userItems && userItems.authen === "admin" ? (
                      <div>
                        <span onClick={logout}>Logout</span>
                        <span>
                          <Link to="/dashboard">Dashboard</Link>
                        </span>
                        <span>
                          <Link to="/myorders">My Orders</Link>
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span onClick={logout}>Logout</span>
                        <span>
                          <Link to="/myorders">My Orders</Link>
                        </span>
                      </div>
                    )
                  ) : (
                    <div className="d-flex align-items-center justify-content-center flex-column">
                      <Link to="/signup">Signup</Link>
                      <Link to="/login">Login</Link>
                    </div>
                  )}
                </div>
              </div>
              <div className="mobile__menu">
                <span onClick={menuToggle}>
                  <i className="ri-menu-line"></i>
                </span>
              </div>
            </div>
          </div>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
