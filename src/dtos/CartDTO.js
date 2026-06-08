export class CartDTO {
  static fromModel(cart) {
    return {
      id: cart._id,
      userId: cart.userId,
      total: cart.total,
      updatedAt: cart.updatedAt,
      items: cart.items.map((item) => ({
        id: item._id,
        productId: item.productId?._id || item.productId,
        slug: item.productId?.slug,
        image: item.imageSnapshot,
        name: item.nameSnapshot,
        quantity: item.quantity,
        price: item.priceSnapshot,
        subtotal: item.quantity * item.priceSnapshot
      }))
    };
  }
}
