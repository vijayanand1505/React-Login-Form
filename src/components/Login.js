import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { validate } from "./validate";
import { notify } from "./toast";
import styles from "./SignUp.module.css";

const Login = () => {
  const [data, setData] = useState({
    userName: "",
    password: "",
  });
 
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    setErrors(validate(data, "login"));
  }, [data, touched]);

  const changeHandler = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const focusHandler = (event) => {
    setTouched({ ...touched, [event.target.name]: true });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (!Object.keys(errors).length) {
      notify("You Logged in", "success");
    } else {
      notify("Invalid data", "error");
      setTouched({
        userName: true,
        password: true,
      });
    }
  };

  const handleSubmit = async () => {
    const { userName, password } = data;
    const item = { userName, password };

    try {
      const result = await fetch("http://49.207.183.18:2023/user/logIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(item),
      });

      const data = await result.json();

      if (data.token) {
        localStorage.setItem("user-info", JSON.stringify(result));
        navigate("/dashboard");
      } else {
        // notify("Invalid credentials", "error");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={submitHandler} className={styles.formContainer}>
        <h2 className={styles.header}>Login</h2>
        <div className={styles.formField}>
          <label>Email:</label>
          <input
            className={
              errors.email && touched.email
                ? styles.uncompleted
                : styles.formInput
            }
            type="text"
            name="userName"
            value={data.userName}
            onChange={changeHandler}
            onFocus={focusHandler}
          />
          {errors.userName && touched.userName && (
            <span>{errors.userName}</span>
          )}
        </div>
        <div className={styles.formField}>
          <label>Password:</label>
          <input
            className={
              errors.password && touched.password
                ? styles.uncompleted
                : styles.formInput
            }
            type="password"
            name="password"
            value={data.password}
            onChange={changeHandler}
            onFocus={focusHandler}
          />
          {errors.password && touched.password && (
            <span>{errors.password}</span>
          )}
        </div>
        <div className={styles.formButtons}>
          <Link to="/signup">Sign Up</Link>
          <button type="submit" onClick={handleSubmit}>
            Login
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
