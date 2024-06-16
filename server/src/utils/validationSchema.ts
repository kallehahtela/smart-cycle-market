import { isValidObjectId } from 'mongoose';
import * as yup from 'yup';
import categories from './categories';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

yup.addMethod(yup.string, 'email', function validateEmail(message) {
    return this.matches(emailRegex, {
        message,
        name: 'email',
        excludeEmptyString: true,
    });
});

const password = {
    password: yup
        .string()
        .required('Password is missing')
        .min(8, 'Password should be atleast 8 characters long!')
        .matches(passwordRegex, 'Password is too simple!'),
};

export const newUserSchema = yup.object({
    name: yup.string().required('Name is missing'),
    email: yup.string().email('Invalid email!').required('Email is missing'),
    ...password,
});

const tokenAndId = {
    id: yup.string().test({
        name: 'valid-id',
        message: 'Invalid user id',
        test: (value) => {
            return isValidObjectId(value)
        }
    }),
    token: yup.string().required('Token is missing'),
};

export const verifyTokenSchema = yup.object({
    ...tokenAndId,
});



export const resetPassSchema = yup.object({
    ...tokenAndId,
    ...password,
});

export const newProductSchema = yup.object({
    name: yup.string().required('Name is missing!'),
    description: yup.string().required('Description is missing!'),
    category: yup.string().oneOf(categories, 'Inavlid category!').required('Category is missing!'),
    //purchasingDate: yup.date().required('Purchasing date is missing!'),
    price: yup.string().transform((value) => {
        if (isNaN(+value)) return '';

        return +value;
    }).required('Price is missing')
});