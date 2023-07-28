// import bcryptjs from "bcryptjs";
import bcryptjs from "bcryptjs";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     next();
//   }
//   const salt = await bcryptjs.genSalt(10);
//   this.password = await bcryptjs.hash(this.password, salt);
// });
// userSchema.methods.matchPassword = async function (unhashedPwd) {
//   return await bcryptjs.compare(unhashedPwd, this.password);
// };
export default mongoose.model("User", userSchema);
