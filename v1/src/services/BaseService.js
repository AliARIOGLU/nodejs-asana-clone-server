BaseModel = null;

class BaseService {
  constructor(model) {
    this.BaseModel = model;
  }

  list(where) {
    return this.BaseModel?.find(where || {});
  }
  create(data) {
    return new this.BaseModel(data).save();
  }
  findOne(where) {
    return this.BaseModel?.findOne(where);
  }
  update(id, data) {
    return this.BaseModel.findByIdAndUpdate(id, data, { new: true });
  }
  updateWhere(where, data) {
    return this.BaseModel.findOneAndUpdate(where, data);
  }
  delete(id) {
    return this.BaseModel.findByIdAndDelete(id);
  }
}

module.exports = BaseService;
