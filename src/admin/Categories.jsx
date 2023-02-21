import React, { useRef, useState } from "react";
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import useGetData from "../custom-hooks/useGetData";
import { db, storage } from "../firebase.config";
import {
  doc,
  deleteDoc,
  updateDoc,
  collection,
  addDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import "../styles/categories.css";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Categories = () => {
  const [id, setId] = useState("");
  const [uid, setUid] = useState("");
  const [value, setValue] = useState("");
  const [load, setLoad] = useState(false);
  const [isAddUpdate, setIsAddUpdate] = useState(false);
  const modalSection = useRef(null);
  const { data: categoriesData, loading } = useGetData("categories");

  const existingItemUid = (uid) =>
    categoriesData.find((item) => item.uid === uid);

  const existingItemValue = (value) =>
    categoriesData.find((item) => item.value === value);

  const addCategory = async (e) => {
    e.preventDefault();
    setLoad(true);
    try {
      if (!existingItemUid(uid) && !existingItemValue(value)) {
        const docRef = await collection(db, "categories");
        await addDoc(docRef, {
          uid,
          value,
        });

        setLoad(false);
        toast.success("Category Successfully Added!");
        hideModalProducts();
      } else {
        toast.error("Category is Existing!");
      }
    } catch (err) {
      setLoad(false);
      toast.error("Category not Added!");
    }
  };

  const deleteCategory = async (id) => {
    await deleteDoc(doc(db, "categories", id));
    toast.success("Category is Deleted!");
  };

  const updateCategory = async (e, id) => {
    e.preventDefault();
    try {
      if (!existingItemValue(value)) {
        await updateDoc(doc(db, "categories", id), {
          uid,
          value,
        });
        toast.success("Category is Updated!");
        hideModalProducts();
      } else {
        toast.error("Category is Existing!");
      }
    } catch (error) {
      toast.error("Category not Updated!");
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
          <Row className="justify-content-center">
            <Col lg="6">
              <div className="d-flex justify-content-between align-items-center mb-5">
                <h4 className="fw-bold">Categories</h4>
                <button
                  onClick={() => {
                    setId("");
                    setUid("");
                    setValue("");
                    setIsAddUpdate(false);
                    showModalProducts();
                  }}
                  className="btn btn-success"
                >
                  Add Category
                </button>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Value</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td className="py-5 fw-bold">Loading...</td>
                    </tr>
                  ) : (
                    categoriesData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.uid}</td>
                        <td>{item.value}</td>
                        <td>
                          <button
                            onClick={() => {
                              deleteCategory(item.id);
                            }}
                            className="btn btn-danger"
                          >
                            <span>
                              <i className="ri-delete-back-2-fill"></i>
                            </span>
                          </button>
                          <button
                            onClick={() => {
                              setId(item.id);
                              setUid(item.uid);
                              setValue(item.value);
                              setIsAddUpdate(true);
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
              <Form
                onSubmit={
                  isAddUpdate
                    ? (e) => updateCategory(e, id)
                    : (e) => addCategory(e)
                }
              >
                <FormGroup className="form__group">
                  <span>Uid</span>
                  <input
                    type="text"
                    placeholder="Uid..."
                    value={uid}
                    onChange={(e) => setUid(e.target.value)}
                    required
                    disabled={isAddUpdate ? true : false}
                  />
                </FormGroup>
                <FormGroup className="form__group">
                  <span>Value</span>
                  <input
                    type="text"
                    placeholder="Value..."
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    required
                  />
                </FormGroup>
                <div>
                  <button type="submit" className="buy__btn modal__btn">
                    {isAddUpdate ? "Update Category" : "Add Category"}
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

export default Categories;
