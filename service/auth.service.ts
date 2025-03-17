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
import { randomBytes } from "crypto";
import { Request } from "express";
import Redis from "ioredis";

const redis = new Redis();

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
        const newUser = await User.create({ username, password: hashedPassword, displayName, email, phoneNumber });
        return generateToken(newUser);
    }

    // forget password
    async handleForgotPassword(email: string, req: Request) {
        const user = await this.userRepo.findUserByEmail(email);
        if (!user) {
            throw createError(404, "User not found");
        }
    
        const resetToken = randomBytes(32).toString("hex");
        const userAgent = req.get("user-agent") || "unknown";
        const ip = req.ip;
    
        // Lưu token kèm theo User-Agent và IP
        await redis.set(
            `resetToken:${resetToken}`,
            JSON.stringify({ userId: user.id, userAgent, ip }),
            "EX",
            900
        );
    
        await sendResetPasswordEmail(user.email, resetToken);
        return { message: "Reset password email sent" };
    }
    

    //reset password
    async handleResetPassword(resetToken: string, newPassword: string, req: Request) {
        const storedData = await redis.get(`resetToken:${resetToken}`);
        if (!storedData) {
            throw createHttpError(400, "Invalid or expired token");
        }
    
        const { userId, userAgent, ip } = JSON.parse(storedData);
    
        // Kiểm tra IP và User-Agent
        if (req.headers["user-agent"] !== userAgent || req.ip !== ip) {
            throw createHttpError(403, "Invalid request source");
        }
    
        const user = await this.userRepo.findUserById(parseInt(userId));
        if (!user) {
            throw createHttpError(404, "User not found");
        }
    
        const hashedPassword = await hashPassword(newPassword);
        await user.update({ password: hashedPassword });
    
        await redis.del(`resetToken:${resetToken}`);
    
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
            return { message: "Password is not correct"}; 
        }
    
        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        await user.save();
    
        return { message: "Change password successful"};
    }
    
}

export const authService = new AuthService();
