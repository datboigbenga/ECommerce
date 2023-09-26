const Product =require("../model/Product")
const Order = require("../model/Orders")

const {checkPermission}= require("../utils")
const {StatusCodes}= require("http-status-codes")
const customApiError =  require("../errors")

const fakeStripeAPI = async(amount, currency)=>{
  const client_secret = "payment recieved"
  return {amount, client_secret}

}

const createOrder = async(req, res)=>{
  const{items:cartItems, tax, shippingFee} = req.body
  
  if(!cartItems || cartItems < 1){
    throw new customApiError.notFound("No cart item selected")
  }

  if(!tax || !shippingFee ){
    throw new customApiError.BadRequestError("Please fill in the Tax field and Shipping Fee")
  }
  
  let orderItems = [];
  let subtotal = 0;

  for(item of cartItems){
    const result = await Product.findOne({_id:item.product})
    if(!result){
      throw new customApiError.notFound(`no order with id: ${item.product}`)
    }
    const{_id, name, price,  image} = result

    const singleOrderItem ={
      amount: item.amount,
      name,
      price,
      product: _id,
      image
    }

    orderItems.push(singleOrderItem)
    // = [...orderItems, singleOrderItem];
    // calculate subtotal
    subtotal += item.amount * price;
  }

  const total = subtotal + tax + shippingFee;

  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency:"usd"
  })

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,

  })
console.log(orderItems)
res.status(StatusCodes.CREATED).json({order, clientSecret: order.clientSecret })
}

const getAllOrders = async(req, res)=>{
  const orders = await Order.find({})
  res.status(StatusCodes.OK).json({orders, count:orders.length})
     
}

const getSingleOrder = async(req, res)=>{
  const{id:orderId} = req.params;
  const order = await Order.findOne({_id:orderId})
  if(!order){
    throw new customApiError.notFound(`No order with id: ${orderId}`)
  }
  checkPermission(req.user, order.user);
  res.status(StatusCodes.OK).json({order})
}

const getCurrentUserOrders = async(req, res)=>{
  const order = await Order.find({user: req.user.userId})
  res.status(StatusCodes.OK).json({order, count:order.length})
}

const updateOrder = async(req, res)=>{
  const{id:orderId} = req.params;
  const { paymentIntentId } = req.body;
  const order = await Order.findOne({_id:orderId})
  if(!order){
    throw new customApiError.notFound(`No order with id: ${orderId}`)
  }
  checkPermission(req.user, order.user);

  order.paymentIntentId = paymentIntentId;
  order.status = "paid"

 await  order.save()
 res.status(StatusCodes.OK).json({order})
}









module.exports = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  updateOrder
}