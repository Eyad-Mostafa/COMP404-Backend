import { AuthRepository } from "./auth.repository.js";
import { hash, compare } from "../../utils/HashAndCompare.js";

export const AuthService = {
  registerUser: async (name, email, password) => {
    const lowerEmail = email.toLowerCase();

    const existingUser = await AuthRepository.findUserByEmail(lowerEmail);
    if (existingUser) {
      const error = new Error("Email is Already Exist");
      error.cause = 409;
      throw error;
    }

    const hashedPassword = hash({ plaintext: password });

    const newUser = await AuthRepository.createUser({
      name,
      email: lowerEmail,
      password: hashedPassword,
    });

    return newUser;
  },

  loginUser: async (email, password) => {
    const lowerEmail = email.toLowerCase();

    const user = await AuthRepository.findUserByEmail(lowerEmail);

    if (!user || !compare({ plaintext: password, hashValue: user.password })) {
      const error = new Error("Invalid Login Data");
      error.cause = 401;
      throw error;
    }

    return user;
  }
};