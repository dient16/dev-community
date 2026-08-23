const { default: mongoose } = require('mongoose');

mongoose.set('strictQuery', false);

const RETRY_DELAY_MS = 5000;

const dbConnect = async () => {
    if (!process.env.MONGODB_URI) {
        console.error('DB connection failed: missing MONGODB_URI environment variable');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log('DB connection is successfully!');
    } catch (error) {
        console.error('DB connection failed:', error.message);
        console.log(`Retrying DB connection in ${RETRY_DELAY_MS / 1000}s...`);
        setTimeout(dbConnect, RETRY_DELAY_MS);
    }
};

mongoose.connection.on('disconnected', () => console.log('DB disconnected'));
mongoose.connection.on('reconnected', () => console.log('DB reconnected'));

module.exports = dbConnect;
