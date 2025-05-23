import express from 'express';
import getUpload from '../config/aws.upload.js'
import productCategoryController from '../controllers/product.category.controller.js';
import authMiddleware from '../config/jwt.middleware.js'

const router = express.Router();

const uploadImage = getUpload('Product-Category');

router.post('/', authMiddleware,uploadImage.single('image'),productCategoryController.createProductCategory);

router.get('/', productCategoryController.getAllProductCategories);

router.get('/:productId',productCategoryController.getProductByProductId)

router.get('/:id', productCategoryController.getProductCategoryById);

router.patch('/:id', authMiddleware,uploadImage .single('image'), productCategoryController.updateProductCategory);

router.delete('/:id',authMiddleware,productCategoryController.deleteProductCategory);

export default router;
