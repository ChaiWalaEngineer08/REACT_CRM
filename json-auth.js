
export default (req, res, next) => {
  if (req.headers.authorization === 'Bearer demo-token') {
    next();                       // ✔ authorised
  } else {
    res.sendStatus(401);          // ✖ unauthorised
  }
};
