const BaseService = require("./BaseService");
const BaseModel = require("../models/Users");

class UsersService extends BaseService {
  constructor() {
    super(BaseModel);
  }
}

module.exports = new UsersService();
