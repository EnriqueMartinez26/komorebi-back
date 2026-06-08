import { CategoryRepository } from "../repositories/CategoryRepository.js";
import { ProductRepository } from "../repositories/ProductRepository.js";
import { BannerRepository } from "../repositories/BannerRepository.js";
import { bannerSeeds, categorySeeds, productSeeds } from "../data/seedData.js";

export async function seedDemoData() {
  const categoryRepository = new CategoryRepository();
  const productRepository = new ProductRepository();
  const bannerRepository = new BannerRepository();
  const existingCategories = await categoryRepository.count();

  if (existingCategories === 0) {
    await categoryRepository.model.insertMany(categorySeeds);
  }

  const categories = await categoryRepository.model.find({});
  const categoryMap = new Map(categories.map((item) => [item.slug, item._id]));

  for (const product of productSeeds) {
    await productRepository.model.updateOne(
      { slug: product.slug },
      {
        $set: {
          name: product.name,
          description: product.description,
          price: product.price,
          discountPrice: product.discountPrice || null,
          images: product.images,
          categoryId: categoryMap.get(product.categorySlug),
          stock: product.stock,
          featured: product.featured,
          isActive: true,
          tags: product.tags
        }
      },
      { upsert: true }
    );
  }

  for (const banner of bannerSeeds) {
    await bannerRepository.model.updateOne(
      { position: banner.position },
      { $set: banner },
      { upsert: true }
    );
  }
}
