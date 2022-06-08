export default () => ({
  PORT: parseInt(process.env.PORT, 10) || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  ES_DB_URI:
    process.env.ES_DB_URI ||
    'esdb://localhost:2113?tls=false&keepAliveTimeout=10000&keepAliveInterval=10000',
});
