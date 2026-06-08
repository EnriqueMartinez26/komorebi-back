export class UserDTO {
  static fromModel(user) {
    return {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      role: user.role,
      cartId: user.cartId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}

