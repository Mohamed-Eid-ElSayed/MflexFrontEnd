import React, { useState, useRef } from "react";
import { useTmdbAPI } from "../Store/API";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { authClient } from "../utils/authClient";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
const MAX_IMAGE_SIZE_MB = 2;

function validateImageFile(file) {
  if (!file) return "No file selected";
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "Please choose an image file (JPEG, PNG, GIF, or WebP).";
  }
  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    return `Image must be smaller than ${MAX_IMAGE_SIZE_MB}MB.`;
  }
  return null;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
  });
}

const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

export default function Profile() {
  const { userData, setUserData, logout } = useTmdbAPI();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [pendingAvatar, setPendingAvatar] = useState(null);
  const [avatarError, setAvatarError] = useState("");
  const imageRef = useRef(null);
  const navigate = useNavigate();

  const validationSchema = yup.object({
    username: yup
      .string()
      .trim()
      .min(1, "Username cannot be empty")
      .max(50, "Username is too long")
      .required("Username is required"),
    email: yup
      .string()
      .trim()
      .email("Please enter a valid email address")
      .required("Email is required"),
    password: yup
      .string()
      .test(
        "password-strength",
        "Password must be at least 8 characters with one uppercase, one lowercase, one digit, and one special character (@$!%*?&)",
        (value) => !value || (value.length >= 8 && passwordRules.test(value))
      ),
  });

  const formik = useFormik({
    initialValues: {
      username: userData?.username ?? "",
      email: userData?.email ?? "",
      password: "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setErrorMsg("");
      setSuccessMsg("");
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setErrorMsg("You are not logged in. Please sign in again.");
          setLoading(false);
          return;
        }

        const payload = {};
        if (values.username !== (userData?.username ?? "")) payload.username = values.username.trim();
        if (values.email !== (userData?.email ?? "")) payload.email = values.email.trim();
        if (values.password && values.password.trim()) payload.password = values.password;
        if (pendingAvatar) payload.avatar = pendingAvatar;

        if (Object.keys(payload).length === 0) {
          setErrorMsg("No changes to save.");
          setLoading(false);
          return;
        }

        const response = await authClient.post(
          `/api/user/update/${userData._id}`,
          payload,
        );
        if (response.status === 200) {
          setSuccessMsg("Profile updated successfully.");
          setPendingAvatar(null);
          setAvatarError("");
          localStorage.setItem("UserData", JSON.stringify(response.data));
          setUserData(response.data);
          formik.setFieldValue("password", "");
        }
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "An unexpected error occurred. Please try again.";
        setErrorMsg(message);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    setAvatarError("");
    setPendingAvatar(null);
    if (!file) return;
    const err = validateImageFile(file);
    if (err) {
      setAvatarError(err);
      e.target.value = "";
      return;
    }
    try {
      const base64 = await fileToBase64(file);
      setPendingAvatar(base64);
    } catch {
      setAvatarError("Failed to read image.");
    }
    e.target.value = "";
  };

  const handleLogOut = () => {
    logout();
    navigate("/log-in");
  };

  const deleteUser = async () => {
    setErrorMsg("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMsg("You are not logged in. Please sign in again.");
        return;
      }
      await authClient.delete(`/api/user/delete/${userData._id}`);
      localStorage.clear();
      logout();
      navigate("/sign-up");
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "Failed to delete account. Please try again."
      );
    }
  };

  const displayAvatar = pendingAvatar || userData?.avatar;
  const hasChanges =
    formik.dirty ||
    formik.values.password !== "" ||
    !!pendingAvatar;

  return (
    <div className="w-full h-full flex justify-center items-center mt-10">
      <div className="w-10/12 space-y-4 md:w-2/5">
        <form onSubmit={formik.handleSubmit} className="w-full flex flex-col space-y-4">
          <div className="w-full flex flex-col items-center justify-center">
            <img
              src={displayAvatar || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
              alt="Profile"
              className="h-28 w-28 rounded-full object-cover mb-3 border-2 border-secondaryGray"
            />
            <p className="text-lightGray2 text-xl font-semibold uppercase">
              {userData?.username}
            </p>
            <div className="mt-2">
              <button
                type="button"
                className="rounded-full bg-mainorange text-black font-semibold text-sm px-3 py-1.5 hover:opacity-90"
                onClick={() => imageRef.current?.click()}
              >
                Change Photo
              </button>
              <input
                ref={imageRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            {avatarError && <p className="text-red-500 text-sm mt-1">{avatarError}</p>}
          </div>

          <div>
            <label className="block text-lightGray2 text-sm mb-1">Username</label>
            <input
              type="text"
              placeholder="Your username"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="px-3 py-2 w-full bg-secondaryGray text-white outline-none rounded-lg border border-gray-600 focus:border-mainorange"
            />
            {formik.touched.username && formik.errors.username && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-lightGray2 text-sm mb-1">Email</label>
            <input
              type="email"
              placeholder="Your email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="px-3 py-2 w-full bg-secondaryGray text-white outline-none rounded-lg border border-gray-600 focus:border-mainorange"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-lightGray2 text-sm mb-1">
              New password <span className="text-gray-500">(leave blank to keep current)</span>
            </label>
            <input
              type="password"
              placeholder="New password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="px-3 py-2 w-full bg-secondaryGray text-white outline-none rounded-lg border border-gray-600 focus:border-mainorange"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !hasChanges}
            className={`py-2.5 w-full rounded-lg font-medium ${
              loading || !hasChanges
                ? "bg-gray-600 cursor-not-allowed text-gray-400"
                : "bg-mainorange text-black hover:opacity-90"
            }`}
          >
            {loading ? "Updating…" : "Update Profile"}
          </button>
        </form>

        <div className="w-full flex gap-2 flex-wrap">
          <button
            type="button"
            className="flex-1 py-3 rounded-lg bg-black text-mainorange font-medium hover:opacity-90"
            onClick={handleLogOut}
          >
            Log Out
          </button>
          <button
            type="button"
            className="flex-1 py-3 rounded-lg bg-transparent text-red-500 border border-red-500 font-medium hover:bg-red-500 hover:text-black transition-colors"
            onClick={deleteUser}
          >
            Delete Account
          </button>
        </div>

        {successMsg && (
          <p className="text-green-500 text-center font-medium" role="status">
            {successMsg}
          </p>
        )}
        {errorMsg && (
          <p className="text-red-500 text-center font-medium" role="alert">
            {errorMsg}
          </p>
        )}
      </div>
    </div>
  );
}
