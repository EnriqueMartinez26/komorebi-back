import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export function hashValue(value) {
  return bcrypt.hash(value, SALT_ROUNDS);
}

export function compareHash(value, digest) {
  return bcrypt.compare(value, digest);
}

