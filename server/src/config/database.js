const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DATABASE_URL);
        console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Atlas Connection Error: ${error.message}`);
        console.log('🔄 Falling back to local MongoDB...');
        try {
            const localConn = await mongoose.connect('mongodb://localhost:27017/sakhi_agri');
            console.log(`🏠 Local MongoDB Connected: ${localConn.connection.host}`);
        } catch (localError) {
            console.error(`❌ Local MongoDB Connection Error: ${localError.message}`);
            process.exit(1);
        }
    }
};

module.exports = connectDB;