import React, { useState } from "react";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import { Link } from "react-router-dom";
import "../styles/login.css";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { setDoc, doc, collection } from "firebase/firestore";
import { auth } from "../firebase.config";
import { storage } from "../firebase.config";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const signup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (
        file.name.includes(".jpg") ||
        file.name.includes(".png") ||
        file.name.includes(".jpeg")
      ) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        const docRef = doc(db, "users", user.uid);
        const storageRef = ref(storage, `userImages/${Date.now() + file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          (error) => {
            toast.error(error.message);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                await updateProfile(user, {
                  displayName: username,
                  photoURL: downloadURL,
                });
                await setDoc(docRef, {
                  uid: user.uid,
                  displayName: username,
                  email,
                  photoURL: downloadURL,
                });
              }
            );
          }
        );
        setLoading(false);
        toast.success("Account created");
        navigate("/login");
      } else {
        setLoading(false);
        toast.error("Image Upload Failed!");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <Helmet title="Signup">
      <section style={{ marginTop: 80 }}>
        <Container>
          <Row>
            {loading ? (
              <Col lg="12" className="text-center">
                <h5 className="fw-bold">Loading...</h5>
              </Col>
            ) : (
              <Col lg="6" className="m-auto text-center">
                <h3 className="fw-bold mb-4">Signup</h3>
                <Form className="auth__form" onSubmit={signup}>
                  <FormGroup className="form__group">
                    <input
                      required
                      type="text"
                      placeholder="Username..."
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup className="form__group">
                    <input
                      required
                      type="email"
                      placeholder="Enter your Email..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup className="form__group">
                    <input
                      required
                      type="password"
                      placeholder="Enter your Password..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup className="form__group">
                    <input
                      required
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </FormGroup>

                  <button type="submit" className="buy__btn auth__btn">
                    Create an Account
                  </button>
                  <p>
                    Already have an Account?
                    <Link to="/login"> Login</Link>
                  </p>
                </Form>
              </Col>
            )}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Signup;
