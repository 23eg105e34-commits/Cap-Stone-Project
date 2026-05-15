import exp from "express";
import { register, authenticate } from "../services/authService.js";
import { ArticleModel } from "../models/ArticleModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import upload from "../config/multer.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import cloudinary from "../config/cloudinary.js";

export const userRoute = exp.Router();


// REGISTER USER
userRoute.post(
  "/users",
  upload.single("profileImageUrl"),
  async (req, res, next) => {

    let cloudinaryResult;

    try {

      // get user object
      let userObj = req.body;

      // upload image to cloudinary
      if (req.file) {
        cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      }

      // register user
      const newUserObj = await register({
        ...userObj,
        role: "USER",
        profileImageUrl: cloudinaryResult?.secure_url,
      });

      res.status(201).json({
        message: "user created",
        payload: newUserObj,
      });

    } catch (err) {

      // rollback cloudinary upload if error
      if (cloudinaryResult?.public_id) {
        await cloudinary.uploader.destroy(cloudinaryResult.public_id);
      }

      next(err);

    }

  }
);


// READ ALL ARTICLES
userRoute.get(
  "/articles",
  verifyToken("USER", "AUTHOR", "ADMIN"),
  async (req, res) => {

    try {

      // get active articles
      const articles = await ArticleModel.find({
        isArticleActive: true,
      }).populate("comments.user", "email firstName");

      // send response
      res.status(200).json({
        message: "all articles",
        payload: articles,
      });

    } catch (err) {

      res.status(500).json({
        message: "Error occurred",
        error: err.message,
      });

    }

  }
);


// ADD COMMENT TO ARTICLE
userRoute.put(
  "/articles",
  verifyToken("USER", "AUTHOR", "ADMIN"),
  async (req, res) => {

    try {

      // get data from request body
      const { articleId, comment } = req.body;

      // get logged in user from token
      const user = req.user.userId;

      // update article with comment
      let articleWithComment = await ArticleModel.findOneAndUpdate(
        {
          _id: articleId,
          isArticleActive: true,
        },
        {
          $push: {
            comments: {
              user,
              comment,
            },
          },
        },
        {
          new: true,
          runValidators: true,
        }
      ).populate("comments.user", "email firstName");

      // if article not found
      if (!articleWithComment) {
        return res.status(404).json({
          message: "Article not found",
        });
      }

      // send response
      res.status(200).json({
        message: "comment added successfully",
        payload: articleWithComment,
      });

    } catch (err) {

      res.status(500).json({
        message: "Error occurred",
        error: err.message,
      });

    }

  }
);