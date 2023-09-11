const User = require("../models/Users");

const insert = (data) => {
  // const alreadyTaken = User.find({
  //   email: data.email,
  // });

  // if (alreadyTaken) {
  //   console.log("alınmiş...");
  // }

  const user = new User(data);

  return user.save();
};

const list = () => {
  return User.find({});
};

const loginUser = (loginData) => {
  return User.findOne(loginData);
};

const modify = (where, updatedData) => {
  //alttaki password kontrolü datayı filtrelemek için yapılmıştır ama Joi bunu zaten yapıyor
  // ögrenmek amaçlı yazılmıştır.

  // const updatedData = Object.keys(data).reduce((obj, key) => {
  //   if (key !== "password") obj[key] = data[key];

  //   return obj;
  // }, {});

  return User.findOneAndUpdate(where, updatedData, { new: true });
};

const remove = (id) => {
  return User.findByIdAndDelete(id);
};

module.exports = {
  insert,
  list,
  loginUser,
  modify,
  remove,
};
