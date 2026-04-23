// auth.controller.js
import { asyncHandler } from "../../../../utils/errorHandling.js";
import { AuthService } from "./auth.service.js";

export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return next(new Error("Password and Confirm Password must match", { cause: 400 }));
  }

  const user = await AuthService.registerUser(name, email, password);

  return res.status(201).json({
    message: "User Registered Successfully",
    userId: user.id,
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  
  const user = await AuthService.loginUser(email, password);

  return res.status(200).json({
    message: "User Login Successfully",
    id: user.id,
    name: user.name,
  });
});