import React, { useEffect, useState } from "react";
import { Button, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import { useUpdateMutation } from "../slices/UserApiSlice";
import { setCredentials } from "../slices/authSlice";

const ProfileScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [update, { isLoading }] = useUpdateMutation();
  const dispatch = useDispatch();

  const updateHandler = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      try {
        console.log(name, email, password);
        const res = await update({ name, email, password }).unwrap();
        if (res.message === "Nothing to Update") {
          toast.success(res.message);
        } else {
          toast.success("Updated Successfully!");
        }
        dispatch(setCredentials({ ...res }));
      } catch (err) {
        toast.error(err?.data?.["error Message"] || err?.data?.["error"]);
      }
    } else {
      toast.error("Passwords do not match!");
    }
  };
  return (
    <FormContainer>
      <h1>Update Profile</h1>
      <Form onSubmit={updateHandler}>
        <Form.Group className="my-2" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="my-2" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="my-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="my-2" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        {isLoading && <Loader />}
        <Button className="mt-3" variant="primary" type="submit">
          Update
        </Button>
      </Form>
      <Row className="py-2"></Row>
    </FormContainer>
  );
};

export default ProfileScreen;
