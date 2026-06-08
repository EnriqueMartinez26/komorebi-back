export class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  find(filter = {}, options = {}) {
    return this.model.find(filter, null, options);
  }

  findOne(filter = {}, options = {}) {
    return this.model.findOne(filter, null, options);
  }

  findById(id) {
    return this.model.findById(id);
  }

  create(payload) {
    return this.model.create(payload);
  }

  updateById(id, payload, options = { new: true }) {
    return this.model.findByIdAndUpdate(id, payload, options);
  }

  deleteById(id) {
    return this.model.findByIdAndDelete(id);
  }
}

