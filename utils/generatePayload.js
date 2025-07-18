const generatePayload = (user) => {
  return {
    userId: user._id,
    name: user.name,
    role: user.role,
    email: user.email,
  };
};

module.exports = generatePayload;
