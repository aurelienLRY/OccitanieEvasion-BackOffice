import * as yup from "yup";

/**
 * User Schema
 * @returns User Schema
 */
export const userSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
  username: yup.string().required("Username is required"),
});
