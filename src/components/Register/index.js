import { Button, Divider, Form, Input, message, Typography } from "antd";

import React, { useState } from "react";
import "./index.css";
import axios from "axios";

const Register = () => {
  const [logInShow, setlogInShow] = useState(true);
  const [signUpShow, setSignUpShow] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const [nameSignUp, setNameSignUp] = useState("");
  const [emailSignUp, setEmailSignUp] = useState("");
  const [phoneSignUp, setPhoneSignUp] = useState("");
  const [passSignUp, setPassSignUp] = useState("");
  const [passCfSignUp, setPassCfSignUp] = useState("");
  const [code, setCode] = useState("");

  const [nameLogIn, setNameLogIn] = useState("");
  const [passLogIn, setPassLogIn] = useState("");

  const [checked, setChecked] = useState(false);

  const handleSignUp = async () => {
    messageApi.open({
      type: "loading",
      content: "Creating a new account..",
    });
    await axios
      .post("https://tablenow.onrender.com/api/user/sign-up", {
        Username: nameSignUp,
        email: emailSignUp,
        password: passSignUp,
        confirmPassword: passCfSignUp,
        phone: phoneSignUp,
        code: code,
      })
      .then(async (res) => {
        if (res.data.status === "ERR") {
          return messageApi.open({
            type: "error",
            content: `${res.data.message}`,
          });
        }
        await axios
          .post("https://tablenow.onrender.com/api/profile/create", {
            restaurantID: res.data.data._id,
            restaurantName: "empty",
            restaurantAddress: "empty",
            restaurantTable: 0,
            shiftTime: [
              { shift: 1, timeStart: "empty", timeEnd: "empty" },
              { shift: 2, timeStart: "empty", timeEnd: "empty" },
              { shift: 3, timeStart: "empty", timeEnd: "empty" },
            ],
            restaurantDescribe: "empty",
          })
          .then(async (res) => {
            if (res.data.status === "ERR") {
              return messageApi.open({
                type: "error",
                content: `${res.data.message}`,
              });
            }
            await axios
              .post("https://tablenow.onrender.com/api/table/create/", {
                restaurantID: res.data.data.restaurantID,
              })
              .then((res) => {
                if (res.data.status === "ERR") {
                  return messageApi.open({
                    type: "error",
                    content: `${res.data.message}`,
                  });
                }
              });
            return messageApi.open({
              type: "success",
              content: `${res.data.message}`,
              duration: 1,
            });
          });

        messageApi.open({
          type: "info",
          content: `${res.data.message}`,
        });
        setSignUpShow(false);
        setlogInShow(true);
      })
      .catch((err) => {
        if (err.response.data.message.includes("duplicate")) {
          return message.error(
            "User name, email or phone number is already available",
            2.5
          );
        } else
          return messageApi.open({
            type: "error",
            content: `${err.message}`,
          });
      });
  };

  const handleLogIn = async () => {
    await axios
      .post("https://tablenow.onrender.com/api/user/sign-in", {
        Username: nameLogIn,
        password: passLogIn,
      })
      .then(async (res) => {
        if (res.data.status === "ERR") {
          return messageApi.open({
            type: "info",
            content: `${res.data.message}`,
          });
        } else {
          localStorage.setItem("resID", res.data.id);
          localStorage.setItem("access_token", res.data.access_token);
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${res.data.access_token}`;
          await axios
            .get(`https://tablenow.onrender.com/api/profile/get-details/${res.data.id}`)
            .then(() => {
              window.location.reload();
            });
        }
      })
      .catch((err) => {
        return messageApi.open({
          type: "error",
          content: `${err.message}`,
        });
      });
  };

  // const user = JSON.parse(localStorage.getItem("user"));
  // useEffect(() => {
  //   if (user && user.remember === true) {
  //     setNameLogIn(user.userName);
  //   } else console.log("nothing");
  // }, [checked, user]);

  return (
    <div className="appBg">
      {logInShow && (
        <>
          {contextHolder}
          <Form
            className="loginForm"
            labelCol={{
              span: 5,
            }}
            style={{
              maxWidth: 600,
            }}
            initialValues={{
              remember: true,
            }}
          >
            <Typography.Title>Log In</Typography.Title>
            <Form.Item label="User name">
              <Input
                value={nameLogIn}
                placeholder="Enter your user name"
                onChange={(e) => setNameLogIn(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Password">
              <Input.Password
                value={passLogIn}
                placeholder="Enter your password"
                onChange={(e) => setPassLogIn(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              {/* <Checkbox
                defaultChecked={false}
                checked={checked}
                onChange={() => setChecked(!checked)}
              >
                Remember me
              </Checkbox> */}
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              onClick={handleLogIn}
            >
              Log In
            </Button>
            <Divider style={{ justifyContent: "center", width: "400px" }}>
              <Divider>If you do not already have an account ?</Divider>
              <Button
                onClick={() => {
                  setlogInShow(false);
                  setSignUpShow(true);
                }}
              >
                Sign Up
              </Button>
            </Divider>
          </Form>
        </>
      )}
      {signUpShow && (
        <>
          {contextHolder}
          <Form
            className="loginForm"
            labelCol={{
              span: 6,
            }}
            style={{
              maxWidth: 600,
            }}
            initialValues={{
              remember: true,
            }}
          >
            <Typography.Title>Sign Up</Typography.Title>
            <Form.Item label="User name">
              <Input
                placeholder="Enter your user name"
                onChange={(e) => setNameSignUp(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Email">
              <Input
                placeholder="Enter your email"
                onChange={(e) => setEmailSignUp(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Phone">
              <Input
                placeholder="Enter your phone number"
                onChange={(e) => setPhoneSignUp(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Password">
              <Input.Password
                placeholder="Enter your password"
                onChange={(e) => setPassSignUp(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Confirm">
              <Input.Password
                placeholder="Enter your password again"
                onChange={(e) => setPassCfSignUp(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Security code">
              <Input.Password
                placeholder="Enter your security code"
                onChange={(e) => setCode(e.target.value)}
              />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              onClick={handleSignUp}
            >
              Sign Up
            </Button>
            <Divider style={{ justifyContent: "center", width: "400px" }}>
              <Divider>Already have an account ?</Divider>
              <Button
                onClick={() => {
                  setlogInShow(true);
                  setSignUpShow(false);
                }}
              >
                Log In
              </Button>
            </Divider>
          </Form>
        </>
      )}
    </div>
  );
};

export default Register;
