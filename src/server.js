const app = require('./app');

/**
 * Starts the Express server
 * @param {number} [port=3000] - The port to listen on
 * @returns {Promise<void>}
 */
const startServer = async (port = 3000) => {
  try {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
