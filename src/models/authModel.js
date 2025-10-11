import mongoose from "mongoose"
const userSchema = new mongoose.Schema({
 email: { type: String, unique: true, required: true },
 password: { type: String, required: true },
 verified : {type:String, default:false}
 },
 {
    timestamps:true
 }
);
module.exports = mongoose.model('User', userSchema);