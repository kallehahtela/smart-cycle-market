import { RequestHandler } from "express";
import UserModel from "src/models/user";
import crypto from 'crypto';
import AuthVerificationTokenModal from "src/models/authVerificationToken";

export const createNewUser: RequestHandler = async (req, res) => {
    /* 
    8. Send message back to check email inbox.
    */

    // Read incoming data like: name, email, password
    const { email, password, name } = req.body;

    // Validate if the data is ok or not
    // Send error if not
    if (!name) return res.status(422).json({ message: 'Name is missing!' });
    if (!email) return res.status(422).json({ message: 'Email is missing!' });
    if (!password) return res.status(422).json({ message: 'Password is missing!' });

    // Check if we already have account with same user.
    const existingUser = await UserModel.findOne({ email });
    // Send error if yes otherwise create new account and save user inside DB.
    if (existingUser) return res.status(401).json({ message: 'Unauthorized request, email is already in use!' });

    const user = await UserModel.create({ name, email, password });
    //user.comparePassword(password);

    // Generate and Store verification token.
    const token = crypto.randomBytes(36).toString('hex');
    await AuthVerificationTokenModal.create({ owner: user._id, token });

    // Send verification link with token to register email.
    const link = `http://localhost:8000/verify?id=${user._id}&${token}`;

    res.send(link);
};