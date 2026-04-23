import { asyncHandler } from "../../../../utils/errorHandling.js";
import { hash, compare } from "../../../../utils/HashAndCompare.js";
import userModel from "../../../DB/models/user.model.js";

export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return next(new Error("Password and Confirm Password must match", { cause: 400 }));
  }

  if (await userModel.findOne({ email: email.toLowerCase() })) {
    return next(new Error("Email is Already Exist", { cause: 409 }));
  }

  const createUser = await userModel.create({
    name,
    email: email.toLowerCase(),
    password: hash({ plaintext: password }),
  });

  return res.status(201).json({
    message: "User Registered Successfully",
    userId: createUser._id,
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email: email.toLowerCase() });

  if (!user || !compare({ plaintext: password, hashValue: user.password })) {
    return next(new Error("Invalid Login Data"));
  }

  return res.status(200).json({
    message: "User Login Successfully",
    id: user._id,
    name: user.name,
  });
});
