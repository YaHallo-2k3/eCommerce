import React, { useState } from "react";
import CommonSection from "../components/UI/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col } from "reactstrap";
import "../styles/shop.css";
import products from "../assets/data/products";
import ProductsList from "../components/UI/ProductsList";
import useGetData from "../custom-hooks/useGetData";

const Shop = () => {
  const { data: categoriesData } = useGetData("categories");
  const [productsData, setProductsData] = useState(products);

  const handleFilterByCategory = (e) => {
    const filteredValue = e.target.value;
    const filteredProducts = products.filter(
      (item) => item.category === filteredValue
    );
    setProductsData(filteredProducts);
  };

  const handleFilterByPrice = (e) => {
    const filterValue = e.target.value;
    if (filterValue === "ascending") {
      const filteredProducts = products.sort((a, b) => a.price - b.price);
      setProductsData(filteredProducts);
    }

    if (filterValue === "descending") {
      const filteredProducts = products.sort((a, b) => b.price - a.price);
      setProductsData(filteredProducts);
    }
  };

  const handleSearch = (e) => {
    const searchItem = e.target.value;
    const searchedProducts = products.filter((item) =>
      item.productName.toLowerCase().includes(searchItem.toLowerCase())
    );
    setProductsData(searchedProducts);
  };

  return (
    <Helmet title="Shop">
      <CommonSection title="Products" />
      <section>
        <Container>
          <Row>
            <Col lg="3" md="6">
              <div className="filter__widget">
                <select onChange={handleFilterByCategory}>
                  <option>Filter By Category</option>
                  {categoriesData.map((item, index) => (
                    <option key={index} value={item.uid}>
                      {item.value}
                    </option>
                  ))}
                </select>
              </div>
            </Col>
            <Col lg="3" md="6" className="text-end">
              <div className="filter__widget">
                <select onChange={handleFilterByPrice}>
                  <option>Sort By</option>
                  <option value="ascending">Ascending</option>
                  <option value="descending">Descending</option>
                </select>
              </div>
            </Col>
            <Col lg="6" md="12">
              <div className="search__box">
                <input
                  type="text"
                  placeholder="Search..."
                  onChange={handleSearch}
                />
                <span>
                  <i className="ri-search-line"></i>
                </span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="pt-0">
        <Container>
          <Row>
            {productsData.length === 0 ? (
              <h1 className="text-center fs-4">No Products are found!</h1>
            ) : (
              <ProductsList data={productsData} />
            )}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Shop;
