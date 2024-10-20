const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI; // Make sure this is correct
        if (!uri) {
            throw new Error("MongoDB URI is undefined. Check your .env file.");
        }
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};
module.exports = connectDB;
