import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import config from "../config.js";
import { Admin } from "../models/admin.model.js";

export const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const adminSchema = z.object({
    firstName: z
      .string()
      .min(3, { message: "Password must be atleast 3 characters long" }),
    lastName: z
      .string()
      .min(3, { message: "Password must be atleast 3 characters long" }),
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "Password must be atleast 8 characters long" }),
  });
  const validatedData = adminSchema.safeParse(req.body);
  if (!validatedData.success) {
    res
      .status(400)
      .json({ errors: validatedData.error.issues.map((err) => err.message) });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const existingAdmin = await Admin.findOne({ email: email });
    if (existingAdmin) {
      return res.status(400).json({ errors: "Admin already exists" });
    }
    const newAdmin = new Admin({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await newAdmin.save();
    res.status(201).json({ message: "Signup Successful", newAdmin });
  } catch (error) {
    res.status(500).json({ errors: "Error in signup" });
    console.log("Error in signup", error);
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email: email });
    const isPassword = await bcrypt.compare(password, admin.password);
    if (!admin || !isPassword) {
      res.status(404).json({ errors: "Invalid credentials" });
    }

    //! JWT Code
    const token = jwt.sign(
      {
        id: admin.id,
      },
      config.JWT_ADMIN_PASSWORD,
      { expiresIn: "1d" }
    );
    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), //1day
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    };
    res.cookie("jwt", token, cookieOptions);
    res.status(200).json({ message: "Login Successful", admin, token });
  } catch (error) {
    res.status(500).json({ errors: "Error in login" });
    console.log("Error in login", error);
  }
};
export const logout = (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logout Successful" });
  } catch (error) {
    res.status(500).json({ errors: "Error in logout" });
    console.log("Error in logout", error);
  }
};
