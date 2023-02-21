import React, { useState } from "react";
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import { toast } from "react-toastify";
import { db, storage } from "../firebase.config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import useGetData from "../custom-hooks/useGetData";

const AddProducts = () => {
  const [enterTitle, setEnterTitle] = useState("");
  const [enterShortDesc, setEnterShortDesc] = useState("");
  const [enterDescription, setEnterDescription] = useState("");
  const [enterCategory, setEnterCategory] = useState("");
  const [enterPrice, setEnterPrice] = useState("");
  const [enterProductImg, setEnterProductImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { data: categoriesData } = useGetData("categories");

  const addProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (
        enterProductImg.name.includes("jpg") ||
        enterProductImg.name.includes("png") ||
        enterProductImg.name.includes("jpeg")
      ) {
        const docRef = await collection(db, "products");
        const storageRef = ref(
          storage,
          `productImages/${Date.now() + enterProductImg.name}`
        );
        const uploadTask = uploadBytesResumable(storageRef, enterProductImg);
        uploadTask.on(
          (error) => {
            toast.error(error.message);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                await addDoc(docRef, {
                  productName: enterTitle,
                  shortDesc: enterShortDesc,
                  description: enterDescription,
                  category: enterCategory,
                  price: enterPrice,
                  imgUrl: downloadURL,
                });
              }
            );
          }
        );
        setLoading(false);
        toast.success("Product Successfully Added!");
        navigate("/dashboard/all-products");
      } else {
        toast.error("Image Upload Failed!");
      }
    } catch (err) {
      setLoading(false);
      toast.error("Product not Added!");
    }
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12">
            {loading ? (
              <h4 className="py-5">Loading...</h4>
            ) : (
              <>
                <h4 className="mb-5 fw-bold">Add Product</h4>
                <Form onSubmit={(e) => addProduct(e)}>
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
                      required
                    />
                  </FormGroup>
                  <div>
                    <button type="submit" className="buy__btn">
                      Add Product
                    </button>
                  </div>
                </Form>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AddProducts;
