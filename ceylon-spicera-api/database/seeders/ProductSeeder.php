<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Sizes applied to every product: key, label, multiplier.
     *
     * @var array<int, array{key: string, label: string, multiplier: float}>
     */
    private const SIZES = [
        ['key' => '50g', 'label' => '50 g', 'multiplier' => 0.60],
        ['key' => '100g', 'label' => '100 g', 'multiplier' => 1.00],
        ['key' => '250g', 'label' => '250 g', 'multiplier' => 2.20],
    ];

    /**
     * Curated Best Sellers subset, ported from the front end's FEATURED list.
     *
     * @var array<int, string>
     */
    private const FEATURED = ['p1', 'p5', 'p8', 'p3', 'p9', 'p11', 'p14', 'p15'];

    /**
     * Ported from the front end's lib/shop-data.ts CATALOG. Placeholder
     * content — names, prices, ratings, review counts and estates are
     * invented and must be replaced before launch.
     *
     * @var array<int, array{id: string, name: string, cat: string, price: float, rating: float, reviews: int, badge: string, stock: string, estate: string, harvest: string, desc: string, long: string}>
     */
    private const CATALOG = [
        ['id' => 'p1', 'name' => 'Ceylon Cinnamon Quills', 'cat' => 'Cinnamon', 'price' => 18, 'rating' => 4.9, 'reviews' => 312, 'badge' => 'Best Seller', 'stock' => 'in', 'estate' => 'Matale', 'harvest' => 'Mar 2026', 'desc' => 'Grade C5 · hand-rolled true cinnamon', 'long' => 'Hand-peeled on the third day after rain and quilled by eye. Sweet enough to eat plain, thin enough to roll between the fingers.'],
        ['id' => 'p2', 'name' => 'Estate Ground Cinnamon', 'cat' => 'Cinnamon', 'price' => 14, 'rating' => 4.7, 'reviews' => 186, 'badge' => '', 'stock' => 'in', 'estate' => 'Matale', 'harvest' => 'Mar 2026', 'desc' => 'Milled to order from C5 quills', 'long' => 'Milled the week it ships, never held in bulk. The oil is still in the powder when it reaches you.'],
        ['id' => 'p3', 'name' => 'Alba Grade Cinnamon', 'cat' => 'Cinnamon', 'price' => 32, 'rating' => 5.0, 'reviews' => 74, 'badge' => 'Limited', 'stock' => 'low', 'estate' => 'Matale', 'harvest' => 'Feb 2026', 'desc' => 'The finest grade the island produces', 'long' => 'Under six millimetres across, cut from the youngest shoots. One row on one estate yields what we sell in a season.'],
        ['id' => 'p4', 'name' => 'Cinnamon Bark Oil', 'cat' => 'Cinnamon', 'price' => 46, 'rating' => 4.8, 'reviews' => 58, 'badge' => '', 'stock' => 'in', 'estate' => 'Matale', 'harvest' => 'Jan 2026', 'desc' => 'Steam-distilled, 10 ml amber vial', 'long' => 'Distilled on-estate from bark trimmings the peelers set aside. Two hundred kilos of bark to the litre.'],
        ['id' => 'p5', 'name' => 'Malabar Black Pepper', 'cat' => 'Pepper', 'price' => 14.5, 'rating' => 4.8, 'reviews' => 241, 'badge' => '', 'stock' => 'in', 'estate' => 'Kegalle', 'harvest' => 'Apr 2026', 'desc' => 'Bold, high-piperine single origin', 'long' => 'Vine-ripened and sun-dried on mats. Sharp at the front, resinous underneath, with none of the dust of commodity pepper.'],
        ['id' => 'p6', 'name' => 'Kegalle White Pepper', 'cat' => 'Pepper', 'price' => 16.5, 'rating' => 4.7, 'reviews' => 96, 'badge' => '', 'stock' => 'in', 'estate' => 'Kegalle', 'harvest' => 'Apr 2026', 'desc' => 'Stream-retted, clean and hot', 'long' => 'Retted in running water for nine days, then rubbed and dried. Cleaner heat than black, and no fermented note.'],
        ['id' => 'p7', 'name' => 'Ceylon Long Pepper', 'cat' => 'Pepper', 'price' => 21, 'rating' => 4.6, 'reviews' => 41, 'badge' => 'New', 'stock' => 'in', 'estate' => 'Kegalle', 'harvest' => 'Mar 2026', 'desc' => 'Sweet, floral, slow-building heat', 'long' => 'The pepper Rome bought before it found the round kind. Sweeter, more floral, and the heat arrives late.'],
        ['id' => 'p8', 'name' => 'Green Cardamom Pods', 'cat' => 'Cardamom', 'price' => 22, 'rating' => 4.9, 'reviews' => 203, 'badge' => '', 'stock' => 'in', 'estate' => 'Kandenuwara', 'harvest' => 'Feb 2026', 'desc' => 'Highland-grown, intensely aromatic', 'long' => 'Picked green at eleven hundred metres and cured slowly so the pods stay closed and the seeds stay black.'],
        ['id' => 'p9', 'name' => 'Whole Cloves', 'cat' => 'Cardamom', 'price' => 16, 'rating' => 4.8, 'reviews' => 154, 'badge' => '', 'stock' => 'in', 'estate' => 'Kandy', 'harvest' => 'Jan 2026', 'desc' => 'Sun-dried, richly aromatic buds', 'long' => 'Picked at the blush, before the bud opens. Heavy with oil — they sink rather than float.'],
        ['id' => 'p10', 'name' => 'Nutmeg & Mace', 'cat' => 'Cardamom', 'price' => 19.5, 'rating' => 4.9, 'reviews' => 88, 'badge' => '', 'stock' => 'low', 'estate' => 'Kandy', 'harvest' => 'Dec 2025', 'desc' => 'Twin spice, warm and sweet', 'long' => 'Sold as a pair because they grow as one. The mace is dried in shade to hold its colour.'],
        ['id' => 'p11', 'name' => 'Ceylon Turmeric', 'cat' => 'Roots & Leaf', 'price' => 12, 'rating' => 4.7, 'reviews' => 167, 'badge' => '', 'stock' => 'in', 'estate' => 'Kegalle', 'harvest' => 'Mar 2026', 'desc' => 'High-curcumin golden root', 'long' => 'Boiled, sun-dried and stone-milled. Tested above four per cent curcumin on the current lot.'],
        ['id' => 'p12', 'name' => 'Curry Leaf, Estate Dried', 'cat' => 'Roots & Leaf', 'price' => 15.5, 'rating' => 4.8, 'reviews' => 73, 'badge' => '', 'stock' => 'in', 'estate' => 'Matale', 'harvest' => 'Apr 2026', 'desc' => 'Shade-dried on the branch', 'long' => 'Dried on the stem in shade so the leaf keeps its green and its oil. Snaps rather than crumbles.'],
        ['id' => 'p13', 'name' => 'Ceylon Vanilla Beans', 'cat' => 'Roots & Leaf', 'price' => 34, 'rating' => 5.0, 'reviews' => 112, 'badge' => 'Limited', 'stock' => 'low', 'estate' => 'Kandenuwara', 'harvest' => 'Nov 2025', 'desc' => 'Plump Grade A gourmet pods', 'long' => 'Hand-pollinated, cured over five months. Sixteen centimetres and pliable enough to knot.'],
        ['id' => 'p14', 'name' => 'Roasted Curry Powder', 'cat' => 'Blends', 'price' => 13.5, 'rating' => 4.8, 'reviews' => 229, 'badge' => '', 'stock' => 'in', 'estate' => 'Four estates', 'harvest' => 'Apr 2026', 'desc' => 'The dark Sri Lankan roast', 'long' => 'Nine spices roasted separately to their own colour, then ground together. Dark, smoky, unlike any yellow curry powder.'],
        ['id' => 'p15', 'name' => 'The Four Estates Box', 'cat' => 'Gift Sets', 'price' => 68, 'rating' => 4.9, 'reviews' => 134, 'badge' => 'Best Seller', 'stock' => 'in', 'estate' => 'All four', 'harvest' => 'Mixed', 'desc' => 'One tin from every ridge', 'long' => 'Cinnamon from Matale, clove from Kandy, pepper from Kegalle, cardamom from Kandenuwara. Four tins in a rough linen case.'],
        ['id' => 'p16', 'name' => "Founder's Reserve Tin", 'cat' => 'Gift Sets', 'price' => 95, 'rating' => 5.0, 'reviews' => 29, 'badge' => 'Limited', 'stock' => 'out', 'estate' => 'Matale', 'harvest' => 'Feb 2026', 'desc' => 'Alba cinnamon, numbered lot', 'long' => 'Alba quills, vanilla and long pepper in a numbered tin, signed off by hand. Two hundred made each season.'],
    ];

    /**
     * Approximate stock quantity implied by the front end's stock status.
     *
     * @var array<string, int>
     */
    private const STOCK_QUANTITY = [
        'in' => 150,
        'low' => 20,
        'out' => 0,
    ];

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $categories = Category::all()->keyBy('name');

        foreach (self::CATALOG as $index => $item) {
            $basePriceCents = (int) round($item['price'] * 100);

            $product = Product::create([
                'category_id' => $categories[$item['cat']]->id,
                'name' => $item['name'],
                'slug' => Str::slug($item['name']),
                'sku' => 'CS-'.strtoupper($item['id']),
                'base_price_cents' => $basePriceCents,
                'short_description' => $item['desc'],
                'long_description' => $item['long'],
                'badge' => $item['badge'] !== '' ? $item['badge'] : null,
                'stock_status' => $item['stock'],
                'stock_quantity' => self::STOCK_QUANTITY[$item['stock']],
                'estate' => $item['estate'],
                'harvest_month' => $item['harvest'],
                'lot_number' => strtoupper($item['id']).'-26',
                'rating' => $item['rating'],
                'review_count' => $item['reviews'],
                'is_featured' => in_array($item['id'], self::FEATURED, true),
                'is_active' => true,
                'sort_order' => $index,
            ]);

            foreach (self::SIZES as $size) {
                $product->sizes()->create([
                    'size_key' => $size['key'],
                    'label' => $size['label'],
                    'multiplier' => $size['multiplier'],
                    'price_cents' => (int) round($basePriceCents * $size['multiplier']),
                    'stock_quantity' => self::STOCK_QUANTITY[$item['stock']],
                ]);
            }
        }
    }
}
