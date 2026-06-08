import { BaseRepository } from "../classes/BaseRepository.js";
import { UserModel } from "../models/User.js";

export class UserRepository extends BaseRepository {
  constructor() {
    super(UserModel);
  }

  findByEmail(email) {
    return this.findOne({ email: email.toLowerCase() });
  }

  findByUsername(username) {
    return this.findOne({ username: username.toLowerCase() });
  }

  findByEmailOrUsername(identifier) {
    return this.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { username: identifier.toLowerCase() }
      ]
    });
  }
}

