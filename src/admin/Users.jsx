import React from "react";
import { Container, Row, Col } from "reactstrap";
import useGetData from "../custom-hooks/useGetData";
import { deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase.config";
import { toast } from "react-toastify";

const Users = () => {
  const { data: usersData, loading } = useGetData("users");
  const deleteUser = async (id) => {
    await deleteDoc(doc(db, "users", id));
    toast.success("User Deleted!");
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12">
            <h4 className="fw-bold">Users</h4>
          </Col>
          <Col lg="12" className="pt-5">
            <table className="table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Username</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="pt-5 fw-bold">Loading...</td>
                  </tr>
                ) : (
                  usersData.map((user, index) => (
                    <tr key={index}>
                      <td>
                        <img src={user.photoURL} alt="" />
                      </td>
                      <td>{user.displayName}</td>
                      <td>{user.email}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Users;
