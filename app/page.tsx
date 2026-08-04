import { Hero } from "@/components/sections/Hero";
import { CategoriesGrid } from "@/components/sections/CategoriesGrid";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { DeltaAI } from "@/components/sections/DeltaAI";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { BrandsMarquee } from "@/components/sections/BrandsMarquee";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { BlogPreview } from "@/components/sections/BlogPreview";
import { CTASection } from "@/components/sections/CTASection";
import {
  getFeaturedProducts,
  getProducts,
  getCategories,
  getBlogPosts,
  getFavoriteIds,
  getSiteSettings,
  getServices,
  getBrands,
} from "@/lib/queries";

export default async function HomePage() {
  const [featured, allProducts, categories, posts, favoriteIds, settings, services, brands] =
    await Promise.all([
      getFeaturedProducts(),
      getProducts(),
      getCategories(),
      getBlogPosts(),
      getFavoriteIds(),
      getSiteSettings(),
      getServices(),
      getBrands(),
    ]);

  return (
    <>
      <Hero
        eyebrow={settings.hero_eyebrow || undefined}
        title={settings.hero_title || undefined}
        subtitle={settings.hero_subtitle || undefined}
        image={settings.hero_image || undefined}
      />
      <CategoriesGrid items={categories} />
      <FeaturedProducts items={featured} favoriteIds={favoriteIds} />
      <DeltaAI items={allProducts} />
      <WhyChooseUs />
      <BrandsMarquee items={brands} />
      <ServicesSection limit={6} items={services} />
      <BlogPreview items={posts} />
      <CTASection />
    </>
  );
}
