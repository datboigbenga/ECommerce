const Products = require("../model/Product")
const {StatusCodes}= require("http-status-codes")
const customApiError =  require("../errors")


const createProduct = async(req, res)=>{
    req.body.user = req.user.userId;
    const product = await Products.create(req.body)
    res.status(StatusCodes.CREATED).json({product: product})
}

const getAllProduct = async(req, res)=>{
    const product = await Products.find({})
    res.status(StatusCodes.OK).json({product: product, count: product.length })
}

const getProduct = async(req, res)=>{
    const { id: productId } = req.params;
    const product = await Products.findOne({_id:productId}).populate("reviews")

    if (!product) {
        throw new customApiError.notFound(`No product with id : ${productId}`);
      }
    
    res.status(StatusCodes.OK).json({product: product})
}

const updateProduct = async(req, res)=>{
    const { id: productId } = req.params;
    const product = await Products.findOneAndUpdate({_id:productId}, req.body, {
        new:true,
        runValidators:true
    })
    if (!product) {
        throw new customApiError.notFound(`No product with id : ${productId}`);
      }
    
    res.status(StatusCodes.OK).json({product: product})
}

const deleteProduct = async(req, res)=>{
    const { id: productId } = req.params;
    const product = await Products.findOne({_id:productId})

    if (!product) {
        throw new customApiError.notFound(`No product with id : ${productId}`);
      }
    await product.remove()
    
    res.status(StatusCodes.OK).json({ msg: 'Success! Product removed.' })
}

const uploadImage= async(req, res)=>{
    if (!req.files) {
        throw new customApiError.BadRequestError('No File Uploaded');
      }
      const productImage = req.files.image;
    
      if (!productImage.mimetype.startsWith('image')) {
        throw new customApiError.BadRequestError('Please Upload Image');
      }
    
      const maxSize = 1024 * 1024;
    
      if (productImage.size > maxSize) {
        throw new customApiError.BadRequestError(
          'Please upload image smaller than 1MB'
        );
      }
    
      const imagePath = path.join(
        __dirname,
        '../public/uploads/' + `${productImage.name}`
      );
      await productImage.mv(imagePath);
    res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });

}

module.exports = {
    createProduct,
    getAllProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    uploadImage
}