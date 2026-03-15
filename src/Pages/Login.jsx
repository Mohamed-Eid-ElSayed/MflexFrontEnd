import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import { useTmdbAPI } from "../Store/API";

const backendURL = import.meta.env.VITE_BACKEND_SERVICE_URL || "http://localhost:5000";

const validationSchema = yup.object({
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Please enter a valid email address"),
  password: yup
    .string()
    .required("Password is required"),
});

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { setIsLogin } = useTmdbAPI();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setErrorMsg("");
      setLoading(true);
      try {
        const response = await axios.post(
          `${backendURL}/api/auth/login`,
          {
            email: values.email.trim().toLowerCase(),
            password: values.password,
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          localStorage.setItem("UserData", JSON.stringify(response.data));
          localStorage.setItem("noToken", "true");
          setIsLogin(true);
          navigate("/");
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
            Sign in
          </h1>
          <p className="text-lightGray2 text-sm text-center mb-4">
            Use the email and password you used to register
          </p>

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
              placeholder="Your password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              autoComplete="current-password"
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
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <p className="text-lightGray2 text-sm text-center pt-2">
            Don&apos;t have an account?{" "}
            <Link to="/sign-up" className="text-mainorange font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
