import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_SERVICE_URL || "http://localhost:5000";

const USERNAME_MIN = 2;
const USERNAME_MAX = 50;
const USERNAME_REGEX = /^[a-zA-Z0-9_\-\s]+$/;
const PASSWORD_MIN = 8;
const PASSWORD_HAS_LETTER = /[a-zA-Z]/;
const PASSWORD_HAS_NUMBER = /\d/;

const validationSchema = yup.object({
  username: yup
    .string()
    .trim()
    .required("Username is required")
    .min(USERNAME_MIN, `Username must be at least ${USERNAME_MIN} characters`)
    .max(USERNAME_MAX, `Username must be at most ${USERNAME_MAX} characters`)
    .matches(USERNAME_REGEX, "Username can only contain letters, numbers, spaces, hyphens, and underscores"),
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Please enter a valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(PASSWORD_MIN, `Password must be at least ${PASSWORD_MIN} characters`)
    .test("has-letter", "Password must include at least one letter", (value) => value && PASSWORD_HAS_LETTER.test(value))
    .test("has-number", "Password must include at least one number", (value) => value && PASSWORD_HAS_NUMBER.test(value)),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setErrorMsg("");
      setSuccessMsg("");
      setLoading(true);
      try {
        const response = await axios.post(
          `${backendURL}/api/auth/signup`,
          {
            username: values.username.trim(),
            email: values.email.trim().toLowerCase(),
            password: values.password,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response.status === 201 || response.status === 200) {
          setSuccessMsg(response.data?.message || "Account created successfully. You can now sign in.");
          setTimeout(() => navigate("/log-in"), 1500);
        }
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "Something went wrong. Please try again.";
        setErrorMsg(message);
      } finally {
        setLoading(false);
      }
    },
  });

  const showError = (field) =>
    formik.touched[field] && formik.errors[field];

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-primaryGray px-4 py-8">
      <div className="w-full max-w-md">
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col space-y-4 bg-secondaryGray p-6 sm:p-8 rounded-xl shadow-lg"
        >
          <h1 className="text-white text-2xl sm:text-3xl font-bold text-center mb-2">
            Create account
          </h1>
          <p className="text-lightGray2 text-sm text-center mb-4">
            Sign up to save favorites and watchlist
          </p>

          <div>
            <label htmlFor="username" className="block text-lightGray2 text-sm font-medium mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="e.g. MovieFan"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              autoComplete="username"
              className={`w-full px-4 py-2.5 bg-gray-700 text-white rounded-lg border outline-none transition-colors placeholder-gray-500 ${
                showError("username")
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-600 focus:border-mainorange"
              }`}
            />
            {showError("username") && (
              <p className="text-red-500 text-sm mt-1" role="alert">
                {formik.errors.username}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-lightGray2 text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              autoComplete="email"
              className={`w-full px-4 py-2.5 bg-gray-700 text-white rounded-lg border outline-none transition-colors placeholder-gray-500 ${
                showError("email")
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-600 focus:border-mainorange"
              }`}
            />
            {showError("email") && (
              <p className="text-red-500 text-sm mt-1" role="alert">
                {formik.errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-lightGray2 text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="At least 8 characters, letters and numbers"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              autoComplete="new-password"
              className={`w-full px-4 py-2.5 bg-gray-700 text-white rounded-lg border outline-none transition-colors placeholder-gray-500 ${
                showError("password")
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-600 focus:border-mainorange"
              }`}
            />
            {showError("password") && (
              <p className="text-red-500 text-sm mt-1" role="alert">
                {formik.errors.password}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-lightGray2 text-sm font-medium mb-1">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              autoComplete="new-password"
              className={`w-full px-4 py-2.5 bg-gray-700 text-white rounded-lg border outline-none transition-colors placeholder-gray-500 ${
                showError("confirmPassword")
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-600 focus:border-mainorange"
              }`}
            />
            {showError("confirmPassword") && (
              <p className="text-red-500 text-sm mt-1" role="alert">
                {formik.errors.confirmPassword}
              </p>
            )}
          </div>

          {successMsg && (
            <p className="text-green-500 text-sm text-center font-medium" role="status">
              {successMsg}
            </p>
          )}
          {errorMsg && (
            <p className="text-red-500 text-sm text-center font-medium" role="alert">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              loading
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-mainorange text-black hover:opacity-90"
            }`}
          >
            {loading ? "Creating account…" : "Sign up"}
          </button>

          <p className="text-lightGray2 text-sm text-center pt-2">
            Already have an account?{" "}
            <Link to="/log-in" className="text-mainorange font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
