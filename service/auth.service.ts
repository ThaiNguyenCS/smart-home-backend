import createHttpError from "http-errors";
import sequelize from "../model/database";
import User from "../model/User.model";
import createError from "http-errors";
import UserRepository from "../repository/UserRepository";
import { UserAndPassLoginForm } from "../types/loginForm";
import { generateToken } from "../utils/jwt";
import { comparePassword, hashPassword } from "../utils/validatePassword";
import { RegisterForm } from "../types/registerForm";
import { sendResetPasswordEmail } from "./email.service";
import * as jwt from "jsonwebtoken";
import { generateUUID } from "../utils/idGenerator";

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
        if (await comparePassword(password, user.password)) {
            return generateToken(user);
        }
        throw createError(401, "Invalid credentials");
    }

    // register new account
    async registerUser(data: RegisterForm) {
        const { username, password, displayName, email, phoneNumber } = data;
        if (!username || !password) {
            throw createError(400, "Missing fields");
        }
        const existingUser = await this.userRepo.findUserByUsername(username);
        if (existingUser) {
            throw createError(409, "Username already exists");
        }
        const hashedPassword = await hashPassword(password);
        const newUser = await User.create({
            id: generateUUID(),
            username,
            password: hashedPassword,
            displayName,
            email,
            phoneNumber,
        });
        return generateToken(newUser);
    }

    // forget password
    async handleForgotPassword(email: string) {
        const user = await this.userRepo.findUserByEmail(email);
        if (!user) {
            throw createError(404, "User not found");
        }
        console.log("User found:", user);

        const resetToken = generateToken(user);
        await sendResetPasswordEmail(user.email, resetToken);

        return { message: "Reset password email sent" };
    }

    //reset password
    async handleResetPassword(username: string, newPassword: string) {
        if (!newPassword) {
            throw createHttpError(400, "Missing new password");
        }

        const user = await this.userRepo.findUserByUsername(username);
        if (!user) {
            throw createHttpError(404, "User not found");
        }

        const hashedPassword = await hashPassword(newPassword);
        await user.update({ password: hashedPassword });

        return { message: "Password updated successfully" };
    }

    //change password
    async updateUserPassword(username: string, oldPassword: string, newPassword: string) {
        const user = await this.userRepo.findUserByUsername(username);

        if (!user) {
            throw new Error("User not found");
        }

        const checkPass = await comparePassword(oldPassword, user.password);
        if (!checkPass) {
            return { message: "Password is not correct" };
        }

        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        await user.save();

        return { message: "Change password successful" };
    }
}

export const authService = new AuthService();
