import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface UserDocument extends mongoose.Document {
	fullName: string;
	email: string;
	password: string;
}

interface UserModel extends mongoose.Model<UserDocument> {
	validateCredentials(email: string, password: string): UserDocument;
}

const userSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			trim: true,
			lowercase: true,
			required: [true, "Fullname is required."],
		},
		email: {
			type: String,
			trim: true,
			lowercase: true,
			unique: true,
			required: [true, "Email is required."],
		},
		password: {
			type: String,
			minLength: 7,
			trim: true,
			required: [true, "Password is required."],
			validate(password: string) {
				if (password.includes("password")) {
					throw new Error("your password can be better than that");
				}
			},
		},
	},
	{
		timestamps: true,
		toJSON: {
			transform(_doc, ret) {
				delete ret.password;
			},
		},
	}
);

userSchema.pre("save", async function (next) {
	const user: UserDocument = this;
	const salt = parseInt(process.env.SALT_ROUNDS!);

	if (user.isModified("password")) {
		user.password = await bcrypt.hash(user.password, salt);
	}

	next();
});

userSchema.statics.validateCredentials = async (email, password) => {
	const user = await User.findOne({ email });
	if (!user) throw new Error("Invalid Login Credentials");

	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) throw new Error("Invalid Login Credentials");

	return user;
};

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export default User;
