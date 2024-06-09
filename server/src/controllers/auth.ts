import { RequestHandler } from "express";
import UserModel from "src/models/user";
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import AuthVerificationTokenModal from "src/models/authVerificationToken";
import { sendErrorRes } from "src/utils/helper";

export const createNewUser: RequestHandler = async (req, res) => {

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

