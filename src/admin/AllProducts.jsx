import React, { useRef, useState } from "react";
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import useGetData from "../custom-hooks/useGetData";
import { db, storage } from "../firebase.config";
import { doc, deleteDoc, updateDoc, collection } from "firebase/firestore";
import { toast } from "react-toastify";
import "../styles/all-products.css";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const AllProducts = () => {
  const [enterTitle, setEnterTitle] = useState("");
  const [enterShortDesc, setEnterShortDesc] = useState("");
  const [enterDescription, setEnterDescription] = useState("");
  const [enterCategory, setEnterCategory] = useState("");
  const [enterPrice, setEnterPrice] = useState("");
  const [enterProductImg, setEnterProductImg] = useState("");
  const [enterId, setEnterId] = useState("");
  const modalSection = useRef(null);

  const { data: productsData, loading } = useGetData("products");
  const { data: categoriesData } = useGetData("categories");

  const findCategory = (uid) => {
    const findValue = categoriesData.find((item) => item.uid === uid);
    return findValue.value;
  };

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, "products", id));
    toast.success("Product is Deleted!");
  };

  const updateProduct = async (e, id) => {
    e.preventDefault();
    try {
      const storageRef = ref(
        storage,
        `productImages/${Date.now() + enterProductImg.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, enterProductImg);
      uploadTask.on(
        () => {
          toast.error("Images not Uploaded!");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            if (!downloadURL.includes("NaN")) {
              await updateDoc(doc(db, "products", id), {
                productName: enterTitle,
                shortDesc: enterShortDesc,
                description: enterDescription,
                category: enterCategory,
                price: enterPrice,
                imgUrl: downloadURL,
              });
            } else {
              await updateDoc(doc(db, "products", id), {
                productName: enterTitle,
                shortDesc: enterShortDesc,
                description: enterDescription,
                category: enterCategory,
                price: enterPrice,
              });
            }
          });
        }
      );
      toast.success("Product is Updated!");
      hideModalProducts();
    } catch (error) {
      toast.error("Product not Updated!");
    }
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
              <h4 className="mb-5 fw-bold">All Products</h4>
              <table className="table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td className="py-5 fw-bold">Loading...</td>
                    </tr>
                  ) : (
                    productsData.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <img src={item.imgUrl} alt="" />
                        </td>
                        <td>{item.productName}</td>
                        <td>{findCategory(item.category)}</td>
                        <td>${item.price}</td>
                        <td>
                          <button
                            onClick={() => {
                              deleteProduct(item.id);
                            }}
                            className="btn btn-danger"
                          >
                            <span>
                              <i className="ri-delete-back-2-fill"></i>
                            </span>
                          </button>
                          <button
                            onClick={() => {
                              setEnterId(item.id);
                              setEnterTitle(item.productName);
                              setEnterShortDesc(item.shortDesc);
                              setEnterDescription(item.description);
                              setEnterCategory(item.category);
                              setEnterPrice(item.price);
                              setEnterProductImg(item.imgUrl);
                              showModalProducts();
                            }}
                            className="btn btn-primary mx-2"
                          >
                            <span>
                              <i className="ri-exchange-fill"></i>
                            </span>
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
              <Form onSubmit={(e) => updateProduct(e, enterId)}>
                <FormGroup className="form__group">
                  <span>Product title</span>
                  <input
                    type="text"
                    placeholder="Double sofa"
                    value={enterTitle}
                    onChange={(e) => setEnterTitle(e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup className="form__group">
                  <span>Short Description</span>
                  <input
                    type="text"
                    placeholder="Lorem..."
                    value={enterShortDesc}
                    onChange={(e) => setEnterShortDesc(e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup className="form__group">
                  <span>Description</span>
                  <input
                    type="text"
                    placeholder="Description..."
                    value={enterDescription}
                    onChange={(e) => setEnterDescription(e.target.value)}
                    required
                  />
                </FormGroup>
                <div className="d-flex align-items-center justify-content-between gap-5">
                  <FormGroup className="form__group w-50">
                    <span>Price</span>
                    <input
                      type="number"
                      placeholder="$100"
                      value={enterPrice}
                      onChange={(e) => setEnterPrice(e.target.value)}
                      required
                    />
                  </FormGroup>
                  <FormGroup className="form__group w-50">
                    <span>Category</span>
                    <select
                      className="w-100 p-2"
                      value={enterCategory}
                      onChange={(e) => setEnterCategory(e.target.value)}
                    >
                      <option>Select Category</option>
                      {categoriesData.map((item, index) => (
                        <option key={index} value={item.uid}>
                          {item.value}
                        </option>
                      ))}
                    </select>
                  </FormGroup>
                </div>
                <FormGroup className="form__group">
                  <span>Product Image</span>
                  <input
                    type="file"
                    onChange={(e) => setEnterProductImg(e.target.files[0])}
                  />
                </FormGroup>
                <div>
                  <button type="submit" className="buy__btn modal__btn">
                    Update Product
                  </button>
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default AllProducts;
