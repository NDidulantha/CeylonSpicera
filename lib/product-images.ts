/*
  Maps a product's slug to its photo(s) in public/shop.
  To add a photo for a product: drop the file in public/shop and add a line here.
  Not every product has a photo yet — ones missing an entry fall back to the
  placeholder in ImageSlot.
*/
export const PRODUCT_IMAGES: Record<string, { image: string; gallery?: string[] }> = {
    "ceylon-cinnamon-quills": { image: "/shop/ceylon-cinnamon-quills.jpg" },
    "malabar-black-pepper": { image: "/shop/malabar-black-pepper.jpg" },
    "green-cardamom-pods": { image: "/shop/green-cardamom-pods.jpg" },
    "whole-cloves": {
        image: "/shop/whole-cloves.jpg",
        gallery: ["/shop/whole-cloves.jpg", "/shop/whole-cloves-2.jpg"],
    },
    "nutmeg-mace": { image: "/shop/nutmeg-mace.jpg" },
    "ceylon-turmeric": { image: "/shop/ceylon-turmeric.jpg" },
    "curry-leaf-estate-dried": { image: "/shop/curry-leaf-estate-dried.jpg" },
    "ceylon-ginger": { image: "/shop/ceylon-ginger.jpg" },
};
