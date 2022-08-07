import mongoose from 'mongoose';

const connect = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI!);
    console.log(`MongoDB Connected: ${db.connection.host}`);
  } catch (err) {
    console.log(err.message);
  }
};

export {
  connect
}
