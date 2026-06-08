export class ProductDTO {
  static fromModel(product) {
    return {
      id: product._id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice,
      images: product.images,
      categoryId: product.categoryId?._id || product.categoryId,
      categoryName: product.categoryId?.name,
      stock: product.stock,
      featured: product.featured,
      isActive: product.isActive,
      tags: product.tags
    };
  }
}

