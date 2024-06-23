import { RequestHandler } from "express";
import { sendErrorRes } from "src/utils/helper";
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import UserModel from "src/models/user";
import PasswordResetTokenModal from "src/models/passwordResetToken";

interface UserProfile {
    id: string,
    name: string;
    email: string;
    verified: boolean;
    avatar?: string;
};

declare global {
    namespace Express {
        interface Request {
            user: UserProfile
        }
    }
};

const JWT_SECRET = process.env.JWT_SECRET!;

export const isAuth: RequestHandler = async (req, res, next) => {
    try {
        // Read authorized header
        const authToken = req.headers.authorization;
        // See if we have the token.
        // Send error if there is no token
        if (!authToken) return sendErrorRes(res, 'Unauthorized request', 403);

        // Take out the user id from token (we will have it as payload).
        const token = authToken.split('Bearer ')[1];
        const payload = jwt.verify(token, JWT_SECRET) as { id: string };

        // Check if we have the user with this id.
        const user = await UserModel.findById(payload.id);
        // Send error if not
        if (!user) return sendErrorRes(res, 'Unauthorized request', 403);

        // Attach user profile inside req object.
        req.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            verified: user.verified,
            avatar: user.avatar?.url,
        };

        next()
        // Handle error for expired tokens.
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return sendErrorRes(res, 'Session expired!', 401);
        }

        if (error instanceof JsonWebTokenError) {
            return sendErrorRes(res, 'Unauthorized access!', 401);
        }

        next(error);
    }
};


export const isValidPassResetToken: RequestHandler = async (req, res, next) => {
    // Read token and id
    const { id, token } = req.body;

    // Find token inside database with owner id.
    const resetPassToken = await PasswordResetTokenModal.findOne({ owner: id });
    // If there is no token send error
    if (!resetPassToken) return sendErrorRes(res, 'Unauthorized request, invalid token!', 403);

    // Else compare token with encrypted value.
    const matched = await resetPassToken.compareToken(token);
    // If not matched send error.
    if (!matched) return sendErrorRes(res, 'Unauthorized request, invalid token!', 403);

    // Else call next function.
    next();
};