import { Router } from "express";
import {
    createNewUser,
    signIn,
    verifyEmail,
    sendProfile,
    grantAccessToken,
    signOut,
    generateForgetPassLink,
    grantValid,
    updatePassword,
    updateProfile,
    updateAvatar,
    sendPublicProfile
} from "src/controllers/auth";
import validate from "src/middleware/validator";
import { newUserSchema, verifyTokenSchema } from "src/utils/validationSchema";
import { isAuth, isValidPassResetToken } from "src/middleware/auth";
import { generateVerificationLink } from "src/controllers/auth";
import fileParser from "src/middleware/fileParser";

const authRouter = Router();

authRouter.post('/sign-up', validate(newUserSchema), createNewUser);
authRouter.post('/verify', validate(verifyTokenSchema), verifyEmail);
authRouter.get('/verify-token', isAuth, generateVerificationLink);
authRouter.post('/sign-in', signIn);
authRouter.get('/profile', isAuth, sendProfile);
authRouter.post('/refresh-token', grantAccessToken);
authRouter.post('/sign-out', isAuth, signOut);
authRouter.post('/forget-pass', generateForgetPassLink);
authRouter.post('/verify-pass-reset-token', validate(verifyTokenSchema), isValidPassResetToken, grantValid);
authRouter.post('/reset-pass', validate(verifyTokenSchema), isValidPassResetToken, updatePassword);
authRouter.patch('/update-profile', isAuth, updateProfile);
authRouter.patch('/update-avatar', isAuth, fileParser, updateAvatar);
authRouter.get('/profile/:id', isAuth, sendPublicProfile);

export default authRouter;