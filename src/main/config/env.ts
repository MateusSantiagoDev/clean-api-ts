export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/api-node-clean',
  port: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || '3er7@!gy587',
}