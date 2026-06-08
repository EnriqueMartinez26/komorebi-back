import { BaseRepository } from "../classes/BaseRepository.js";
import { PasswordResetTokenModel } from "../models/PasswordResetToken.js";

export class PasswordResetTokenRepository extends BaseRepository {
  constructor() {
    super(PasswordResetTokenModel);
  }
}

