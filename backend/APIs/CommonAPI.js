import exp from "express";
import { authenticate } from "../services/authService.js";
import { UserTypeModel } from "../models/UserModel.js";
import bcrypt from "bcryptjs";

export const commonRouter = exp.Router();

import { verifyToken } from "../middlewares/verifyToken.js";


// LOGIN
commonRouter.post("/login", async (req, res) => {

  try {

    // get user credentials
    let userCred = req.body;

    // authenticate user
    let { token, user } = await authenticate(userCred);

    // save token as cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    // send response
    res.status(200).json({
      message: "login success",
      payload: user,
    });

  } catch (err) {

    res.status(err.status || 500).json({
      message: "Login failed",
      error: err.message || "Server error",
    });

  }

});


// LOGOUT
commonRouter.get("/logout", (req, res) => {

  // clear token cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.status(200).json({
    message: "Logged out successfully",
  });

});


// CHANGE PASSWORD
commonRouter.put("/change-password", async (req, res) => {

  try {

    // get data
    const { role, email, currentPassword, newPassword } = req.body;

    // prevent same password
    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: "newPassword must be different from currentPassword",
      });
    }

    // find account
    const account = await UserTypeModel.findOne({ email });

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    // compare current password
    const isMatch = await bcrypt.compare(currentPassword, account.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    // hash new password
    account.password = await bcrypt.hash(newPassword, 10);

    await account.save();

    res.status(200).json({
      message: "Password changed successfully",
    });

  } catch (err) {

    res.status(500).json({
      message: "Error occurred",
      error: err.message,
    });

  }

});


// CHECK AUTH
commonRouter.get(
  "/check-auth",
  verifyToken("USER", "AUTHOR", "ADMIN"),
  async (req, res, next) => {

    try {

      const account = await UserTypeModel.findById(req.user.userId).select("-password");

      if (!account) {
        return res.status(401).json({
          message: "Account not found. Please login again",
        });
      }

      res.status(200).json({
        message: "Authenticated",
        payload: account,
      });

    } catch (err) {
      next(err);
    }

  }
);