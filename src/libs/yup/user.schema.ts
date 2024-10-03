import * as yup from "yup";

/*
 * User schema
 */
export const userSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
  username: yup.string().required("Username is required"),
});
