import { UploadApiResponse } from "cloudinary";
import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import cloudUploader, { cloudApi } from "src/cloud";
import ProductModel from "src/models/product";
import { sendErrorRes } from "src/utils/helper";

const uploadImage = (filePath: string): Promise<UploadApiResponse> => {
    return cloudUploader.upload(filePath, {
        width: 1280,
        height: 720,
        crop: 'fill',
    })
}

export const listNewProduct: RequestHandler = async (req, res) => {
    /* 
      1. User must be authenticated.
      2. User can upload images as well.
      3. Validate incoming data.
      4. Create Product.
      5. Validate and Upload File (or Files) - note (restrict image qty).
      6. And send the response back
    */
    // Create Product.
    const { name, price, category, description, purchasingDate } = req.body;
    const newProduct = new ProductModel({
        owner: req.user.id,
        name,
        price,
        category,
        description,
        purchasingDate
    });

    const { images } = req.files;

    const isMultipleImages = Array.isArray(images);

    if (isMultipleImages && images.length > 5) {
        return sendErrorRes(res, 'Images files can not be more than 5!', 422)
    }

    let invalidFileType = false;

    // if this is teh case we have multiple images
    if (isMultipleImages) {
        for (let img of images) {
            if (!img.mimetype?.startsWith('image')) {
                invalidFileType = true;
                break;
            }
        }
    } else {
        if (images) {
            if (!images.mimetype?.startsWith('image')) {
                invalidFileType = true;
            }
        }
    }

    if (invalidFileType) return sendErrorRes(res, 'Invalid file type, files must be image type!', 422);

    // File upload
    if (isMultipleImages) {
        const uploadPromise = images.map((file) => uploadImage(file.filepath));
        // Wait for all file uploads to complete
        const uploadResults = await Promise.all(uploadPromise);
        // Add the image URLs and public IDs to the product's image field
        newProduct.images = uploadResults.map(({ secure_url, public_id }) => {
            return { url: secure_url, id: public_id }
        });

        newProduct.thumbnail = newProduct.images[0].url;
    } else {
        if (images) {
            const { secure_url, public_id } = await uploadImage(images.filepath);
            newProduct.images = [{ url: secure_url, id: public_id }];
            newProduct.thumbnail = secure_url;
        }
    }

    await newProduct.save();

    res.status(201).json({ message: 'Added new product!' });
};

export const updateProduct: RequestHandler = async (req, res) => {
    /* 
1. User must be authenticated.
2. User can upload images as well.
3. Validate incoming data.
4. Update normal properties (if the product is made by same user).
5. Upload and update images (restrict image qty).
6. And send the response back.
    */
    const { name, price, category, description, purchasingDate, thumbnail } = req.body;
    const productId = req.params.id;
    if (!isValidObjectId(productId)) return sendErrorRes(res, 'Invalid product id', 422);

    const product = await ProductModel.findOneAndUpdate(
        { _id: productId, owner: req.user.id },
        {
            name,
            price,
            category,
            description,
            purchasingDate,
            thumbnail,
        },
        {
            new: true,
        }
    );
    if (!product) return sendErrorRes(res, 'Product not found!', 404);

    if (typeof thumbnail === 'string') product.thumbnail = thumbnail;

    const { images } = req.files;
    const isMultipleImages = Array.isArray(images);

    if (isMultipleImages) {
        if (product.images.length + images.length > 5) {
            return sendErrorRes(res, 'Image files can not be more than 5!', 422);
        }
    }

    let invalidFileType = false;

    // if this is teh case we have multiple images
    if (isMultipleImages) {
        for (let img of images) {
            if (!img.mimetype?.startsWith('image')) {
                invalidFileType = true;
                break;
            }
        }
    } else {
        if (images) {
            if (!images.mimetype?.startsWith('image')) {
                invalidFileType = true;
            }
        }
    }

    if (invalidFileType) return sendErrorRes(res, 'Invalid file type, files must be image type!', 422);

    // File upload
    if (isMultipleImages) {
        const uploadPromise = images.map((file) => uploadImage(file.filepath));
        // Wait for all file uploads to complete
        const uploadResults = await Promise.all(uploadPromise);
        // Add the image URLs and public IDs to the product's image field
        const newImages = uploadResults.map(({ secure_url, public_id }) => {
            return { url: secure_url, id: public_id }
        });

        product.images.push(...newImages);

    } else {
        if (images) {
            const { secure_url, public_id } = await uploadImage(images.filepath);
            product.images.push({ url: secure_url, id: public_id });
        }
    }

    await product.save();

    res.status(201).json({ message: 'Product updated successfully!' });
};

export const deleteProduct: RequestHandler = async (req, res) => {
    // User must be authenticated.
    // Validate the product id.
    const productId = req.params.id;
    if (!isValidObjectId(productId)) return sendErrorRes(res, 'Invalid product id', 422);

    // Remove if it is made by same user.
    const product = await ProductModel.findOneAndDelete({
        _id: productId,
        owner: req.user.id
    });

    if (!product) return sendErrorRes(res, 'Product not found!', 404);

    // Remove images as well.
    const images = product?.images
    if (images.length) {
        const ids = images.map(({ id }) => id)
        await cloudApi.delete_resources(ids);
    }

    // And send the response back.
    res.json({ message: 'Product removed successfully!' });
};