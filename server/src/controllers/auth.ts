import { RequestHandler } from "express";
import UserModel from "src/models/user";
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import AuthVerificationTokenModal from "src/models/authVerificationToken";
import { sendErrorRes } from "src/utils/helper";
import jwt from "jsonwebtoken";

export const createNewUser: RequestHandler = async (req, res) => {
    // ok
    // Read incoming data like: name, email, password
    const { email, password, name } = req.body;

    // Validate if the data is ok or not
    // Send error if not
    if (!name) return sendErrorRes(res, 'Name is missing!', 422);
    if (!email) return sendErrorRes(res, 'Email is missing!', 422);
    if (!password) return sendErrorRes(res, 'Password is missing!', 422);

    // Check if we already have account with same user.
    const existingUser = await UserModel.findOne({ email });
    // Send error if yes otherwise create new account and save user inside DB.
    if (existingUser) return sendErrorRes(res, 'Unauthorized request, email is already in use!', 401);

    const user = await UserModel.create({ name, email, password });

    // Generate and Store verification token.
    const token = crypto.randomBytes(36).toString('hex');
    await AuthVerificationTokenModal.create({ owner: user._id, token });

    // Send verification link with token to register email.
    const link = `http://localhost:8000/verify?id=${user._id}&${token}`;

    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "15d2fae554ee2d",
            pass: "58b97f9c8ddfa9"
        }
    });

    // Send message back to check email inbox.
    await transport.sendMail({
        from: 'verification@myapp.com',
        to: user.email,
        html: `<h1>Please click on <a href='${link}'>this link</a> to verify your account</h1>`
    })

    res.json({ message: 'Please check your inbox.' });
};

export const verifyEmail: RequestHandler = async (req, res) => {
    // Read incoming data like: id and token
    const { id, token } = req.body;

    // Find the token inside DB(using owner id).
    const authToken = await AuthVerificationTokenModal.findOne({ owner: id });
    // Send error if token not found.
    if (!authToken) return sendErrorRes(res, 'Unauthorized request!', 403);

    // Check if the token is valid or not(because we have the encrypted value).
    const isMatched = await authToken.compareToken(token);

    // If not valid send error otherwise update user is verified.
    if (!isMatched) return sendErrorRes(res, 'Unauthorized request, invalid token!', 403);
    await UserModel.findByIdAndUpdate(id, { verified: true });

    // Remove token from database.
    await AuthVerificationTokenModal.findByIdAndDelete(authToken._id);

    // Send success message
    res.json({ message: 'Thanks for joining us, your email is now verified.' });
};

export const signIn: RequestHandler = async (req, res) => {
    /* 1. Read incoming data like: email and password
    2. Find the user the provided email.
    3. Send error if user not found.
    4. Check if the password is valid or not (because pass is in encrypted form).
    5. If not valid send error otherwise generate access & refresh token.
    6. Store refresh token inside DB.
    7. Send both tokens to user. */

    // Read incoming data like: email and password
    const { email, password } = req.body;

    // Find the user the provided email.
    const user = await UserModel.findOne({ email });
    // Send error if user not found.
    if (!user) return sendErrorRes(res, 'Email/Password is incorrect.', 403);

    // Check if the password is valid or not (because pass is in encrypted form).
    const isMatched = await user.comparePassword(password);
    // If not valid send error otherwise generate access & refresh token.
    if (!isMatched) return sendErrorRes(res, 'Email/Password is incorrect.', 403);

    const payload = { id: user._id };

    const accessToken = jwt.sign(payload, 'secret', {
        expiresIn: '15m'
    });
    const refreshToken = jwt.sign(payload, 'secret');

    if (!user.tokens) user.tokens = [refreshToken];
    else user.tokens.push(refreshToken);

    // Store refresh token inside DB.
    await user.save();

    // Send both tokens to user.
    res.json({
        profile: {
            id: user._id,
            email: user.email,
            name: user.name,
            verified: user.verified,
        },
        tokens: { refresh: refreshToken, access: accessToken }
    })
};

