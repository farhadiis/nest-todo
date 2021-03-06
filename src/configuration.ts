export default () => ({
  PORT: parseInt(process.env.PORT, 10) || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  EVENT_STORE_URI:
    process.env.EVENT_STORE_URI ||
    'esdb://localhost:2113?tls=false&keepAliveTimeout=10000&keepAliveInterval=10000',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost/todo',
});
