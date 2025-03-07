import createError from "http-errors";
import UserRepository from "../repository/UserRepository";
import { UserAndPassLoginForm } from "../types/loginForm";
import { generateToken } from "../utils/jwt";
import { comparePassword } from "../utils/validatePassword";

class AuthService {
    userRepo = UserRepository;
}

export const authService = new AuthService();
