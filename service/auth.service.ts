import createHttpError from "http-errors";
import sequelize from "../model/database";
import User from "../model/User.model";
import createError from "http-errors";
import UserRepository from "../repository/UserRepository";
import { UserAndPassLoginForm } from "../types/loginForm";
import { generateToken } from "../utils/jwt";
import { comparePassword } from "../utils/validatePassword";

class AuthService {
    userRepo = UserRepository;

    async handleUserAndPassLogin(data: UserAndPassLoginForm) {
        const { username, password } = data;
        if (!username || !password) {
            throw createError(400, "Missing fields");
        }
        const user = await this.userRepo.findUserByUsername(username);
        if (!user) {
            console.log("here");
            throw createError(404, "User not found");
        }
        console.log("here");
        if (await comparePassword(password, user.password )) {
            return generateToken(user);
        }
        throw createError(401, "Invalid credentials");
    }
}

export const authService = new AuthService();
