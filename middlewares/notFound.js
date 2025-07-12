const notFoundMiddleware = (req, res) => {
  res.send("Route does not exists ");
};

module.exports = notFoundMiddleware;
