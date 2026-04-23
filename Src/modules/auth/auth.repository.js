import prisma from "../../config/prisma.js";

export const AuthRepository = {
  findUserByEmail: async (email) => {
    return await prisma.user.findUnique({ 
      where: { email } 
    });
  },

  createUser: async (userData) => {
    return await prisma.user.create({ 
      data: userData 
    });
  }
};