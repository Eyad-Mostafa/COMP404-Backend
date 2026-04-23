import { asyncHandler } from "../../../../utils/errorHandling.js";
import { AuthService } from "./auth.service.js";
import { ResponseFactory } from "../../../../utils/ResponseFactory.js";

export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return next(new Error("Password and Confirm Password must match", { cause: 400 }));
  }

  const user = await AuthService.registerUser(name, email, password);
  

  return ResponseFactory.success(
    res, 
    "User Registered Successfully", 
    { userId: user.id }, 
    201
  );
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  
  const user = await AuthService.loginUser(email, password);

  return ResponseFactory.success(
    res, 
    "User Login Successfully", 
    { id: user.id, name: user.name }, 
    200
  );
});