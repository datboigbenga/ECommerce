const mongoose = require("mongoose")


const ReviewSchema = new mongoose.Schema({
    rating:{
        type: Number,
        min:1,
        max:5,
        required:[true, "Please provide product rating"],
    },
    title:{
        type: String,
        trim:true,
        required:[true, "Please provide product review title"],
        maxlength:100
    },
    comment:{
        type: String,
        required:[true, "Please provide product review text"],
        maxlength:[1000, "Description can not be more than 1000 characters"]

    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required: true,
    },
    product:{
        type:mongoose.Schema.ObjectId,
        ref:"Products",
        required: true,
    }
},
{timestamps:true}

);

ReviewSchema.index({product:1, user:1}, {unique:true});

ReviewSchema.static.calculateAverageRating = async function(productId){
    const result =  [
        {
          $match: {
            'product': productId
          }
        }, {
          $group: {
            _id: null, 
            averageRating: {
              $avg: '$rating'
            }, 
            numOfReviews: {
              $sum: 1
            }
          }
        }
      ];

      try {
       await this.model("Products").findOneAndUpdate(
        {   _id: productId },
        {
            averageRating: Math.ceil(result[0]?.averageRating || 0),
            numOfReviews: result[0]?.numOfReviews || 0
        }
       )
      } catch (error) {
        console.log(error)
      }
}

ReviewSchema.post("save", async function(){
 await this.constructor.calculateAverageRating(this.product)
})


ReviewSchema.post("remove", async function(){
    await this.constructor.calculateAverageRating(this.product)
})



module.exports = mongoose.model("Reviews", ReviewSchema)