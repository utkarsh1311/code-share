import "dotenv/config";

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || "";
const JWT_SECRET = process.env.JWT_SECRET || "";

export default { PORT, MONGODB_URI, JWT_SECRET };
