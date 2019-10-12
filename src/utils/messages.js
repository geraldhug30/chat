const generateMessage = (name, text) => {
  return {
    name,
    text,
    createdAt: new Date().getTime()
  };
};

const generateLocationMessage = (name, text) => {
  return {
    name,
    text,
    createdAt: new Date().getTime()
  };
};
module.exports = {
  generateMessage,
  generateLocationMessage
};
