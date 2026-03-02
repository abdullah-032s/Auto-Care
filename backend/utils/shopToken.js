// create token and saving that in cookies
const sendShopToken = (user, statusCode, res) => {
  const token = user.getJwtToken();

  // Options for cookies
  const isProd = process.env.NODE_ENV === "PRODUCTION";
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
  };

  res.status(statusCode).cookie("seller_token", token, options).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendShopToken;
