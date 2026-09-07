# Ceylon Spicera — Backend Build Spec

**Read this file first. It is self-contained.** It carries everything needed to build the backend without any prior conversation context. Work through Section 12 (Build Order) in sequence.

---

## 1. Project context

**Ceylon Spicera** is a premium Sri Lankan spice export brand selling to overseas buyers (chefs, retailers, wholesalers) and domestic Sri Lankan customers. Aesthetic benchmark: Apple × Aesop × TWG Tea × Fortnum & Mason.

**The front end is already built and working** as a Next.js 15 app (React 19, TypeScript, Tailwind v4) running locally on **port 3001**. It currently fakes all persistence in `localStorage`. This backend replaces that fakery with a real API.

### Existing front-end routes

| Route | What it does today |
|---|---|
| `/` | Landing page — hero, categories, Best Sellers (8 curated products), heritage newspaper section, D3 globe, reviews, gallery, newsletter |
| `/shop` | 16-product catalogue with sidebar filters (search, category, price), sort, grid/list toggle, quick-view modal |
| `/about-ceylon` | Editorial story page (static content) |
| `/contact` | Contact form + Leaflet map |
| `/account` | Ledger-styled sign-in / open-account page |
| `/checkout` | Three-view flow: billing details → payment → printable receipt |

### Existing front-end state modules (these are the swap points)

- **`components/store-context.tsx`** — cart, wishlist, drawer/modal open-state. Persists to `localStorage` keys `cs_cart` and `cs_wishlist`. Cart is an object keyed **`productId|sizeKey`** → quantity.
- **`components/auth-context.tsx`** — `register()`, `login()`, `logout()`, `user`, `ready`. Persists to `localStorage` keys `cs_accounts` and `cs_session`. A comment in the file already marks it as the seam to replace with real API calls.
- **`lib/shop-data.ts`** — the hard-coded 16-product catalogue, sizes, sort options, and pricing constants. **This becomes seed data, then gets replaced by API responses.**

**Goal: the UI should not change.** Only the bodies of those functions change from `localStorage` reads to `fetch` calls.

---

## 2. Locked decisions

These were decided deliberately. Do not change them without asking.

| Decision | Choice | Reasoning |
|---|---|---|
| **Environment** | Local first. No hosting/deployment work yet. | Hosting is a deferrable detail; get it working on the machine first. |
| **Guest cart** | Allowed. Merges into the user cart on login. | Browsing and adding to cart must never require an account. |
| **Checkout** | **Requires a logged-in account.** | Explicit product requirement. |
| **Base currency** | **USD**, stored as integer cents. | Export buyers are the core market. One source of truth for money. |
| **Settlement currency** | **LKR** via PayHere. | PayHere settles in LKR; convert at charge time only. |
| **Other currencies** | **Display-only estimates**, clearly marked indicative. Never charged. | Avoids FX drift, statement mismatches, and chargebacks. |
| **Auth** | Laravel Sanctum, cookie-based SPA sessions. | No JWT complexity; CSRF handled by the framework. |
| **Admin** | Filament v4. | Full CRUD admin in days. |

### Money rule (non-negotiable)

**All monetary values are stored as integer cents in USD.** Never use floats for money. Never trust a price sent by the browser — the server recomputes every total from the database on every order.

---

## 3. Stack

| Layer | Tool |
|---|---|
| Framework | Laravel 12 (PHP 8.3+) |
| Database | MySQL 8 |
| Auth | Laravel Sanctum (SPA cookie mode) |
| Payments | PayHere (Checkout redirect + server notify webhook) |
| Admin | Filament v4 |
| Images | `spatie/laravel-medialibrary` |
| Mail | Laravel Mail (Mailpit locally) |
| Queue | `database` driver |
| Testing | Pest |

### Local environment (Windows 11 + IntelliJ)

Recommended: **Laravel Herd** (bundles PHP 8.3 + nginx, easiest on Windows). Alternatives: XAMPP/Laragon, or Docker via Laravel Sail.

MySQL: Herd Pro includes it, otherwise install MySQL 8 or use Laragon's bundled server.

Ports: **Laravel on 8000**, Next.js stays on **3001**. (Port 3000 is occupied by an unrelated project.)

---

## 4. Environment variables

```env
APP_NAME="Ceylon Spicera"
APP_URL=http://localhost:8000
APP_TIMEZONE=Asia/Colombo

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ceylon_spicera
DB_USERNAME=root
DB_PASSWORD=

# Sanctum / CORS — the Next dev server
FRONTEND_URL=http://localhost:3001
SANCTUM_STATEFUL_DOMAINS=localhost:3001
SESSION_DOMAIN=localhost
SESSION_DRIVER=database

QUEUE_CONNECTION=database

# Mail (Mailpit locally)
MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
MAIL_FROM_ADDRESS="orders@ceylonspicera.com"
MAIL_FROM_NAME="Ceylon Spicera"

# PayHere (sandbox first)
PAYHERE_MERCHANT_ID=
PAYHERE_MERCHANT_SECRET=
PAYHERE_SANDBOX=true
PAYHERE_NOTIFY_URL="${APP_URL}/api/payments/payhere/notify"

# FX (display-only conversion)
FX_PROVIDER_KEY=
FX_BASE=USD
```

---

## 5. Database schema

All tables use `id` bigint auto-increment PK and `created_at` / `updated_at` unless noted. Money columns are `unsigned integer` **cents (USD)**.

### 5.1 Users & addresses

**`users`**
| Column | Type | Notes |
|---|---|---|
| name | string | |
| email | string | unique |
| email_verified_at | timestamp | nullable |
| password | string | Argon2id hash |
| phone | string | nullable |
| shipping_region | string | nullable — country name from the account form |
| marketing_opt_in | boolean | default false — the "harvest notes" checkbox |
| is_admin | boolean | default false |
| remember_token, timestamps | | |

**`addresses`**
| Column | Type | Notes |
|---|---|---|
| user_id | FK → users | cascade delete |
| type | enum('shipping','billing') | |
| first_name, last_name | string | |
| company | string | nullable |
| country | string | |
| street | string | |
| apartment | string | nullable |
| city | string | |
| state | string | nullable |
| postcode | string | |
| phone | string | nullable |
| is_default | boolean | default false |

### 5.2 Catalogue

**`categories`**
| Column | Type | Notes |
|---|---|---|
| name | string | |
| slug | string | unique |
| description | text | nullable |
| sort_order | integer | default 0 |

Seed exactly these six, in this order: `Cinnamon`, `Pepper`, `Cardamom`, `Roots & Leaf`, `Blends`, `Gift Sets`.

**`products`**
| Column | Type | Notes |
|---|---|---|
| category_id | FK → categories | |
| name | string | |
| slug | string | unique |
| sku | string | unique |
| base_price_cents | unsigned int | price of the **100 g** reference size |
| short_description | string(255) | card copy |
| long_description | text | quick-view / list copy |
| badge | string | nullable — e.g. `Best Seller`, `Limited`, `New` |
| stock_status | enum('in','low','out') | default 'in' |
| stock_quantity | integer | default 0 |
| estate | string | nullable — e.g. `Matale` |
| harvest_month | string | nullable — e.g. `Mar 2026` |
| lot_number | string | nullable — e.g. `P1-26` |
| rating | decimal(2,1) | default 0 — denormalised average |
| review_count | unsigned int | default 0 |
| is_featured | boolean | default false — drives the landing page Best Sellers |
| is_active | boolean | default true |
| sort_order | integer | default 0 — "Featured" sort uses this |

**`product_sizes`**
| Column | Type | Notes |
|---|---|---|
| product_id | FK → products | cascade |
| size_key | string | `50g`, `100g`, `250g` |
| label | string | `50 g`, `100 g`, `250 g` |
| multiplier | decimal(4,2) | `0.60`, `1.00`, `2.20` |
| price_cents | unsigned int | **computed and stored** at seed/save time |
| stock_quantity | integer | nullable — per-size stock if needed |

> Store `price_cents` explicitly rather than multiplying on read. It lets you override an individual size's price later without breaking the multiplier convention.

**`product_images`** — or use medialibrary instead
| Column | Type | Notes |
|---|---|---|
| product_id | FK → products | cascade |
| path | string | |
| alt | string | nullable |
| position | tinyint | 0 = primary (the card image) |

### 5.3 Cart & wishlist

**`carts`**
| Column | Type | Notes |
|---|---|---|
| user_id | FK → users | **nullable** — null means guest |
| guest_token | uuid | nullable, indexed — identifies a guest cart |
| expires_at | timestamp | nullable — prune guest carts after 30 days |

**`cart_items`**
| Column | Type | Notes |
|---|---|---|
| cart_id | FK → carts | cascade |
| product_id | FK → products | |
| product_size_id | FK → product_sizes | |
| quantity | unsigned int | clamp 1–99 |

Unique index on `(cart_id, product_id, product_size_id)` — this mirrors the front end's `productId|sizeKey` key.

**`wishlists`**
| Column | Type | Notes |
|---|---|---|
| user_id | FK → users | cascade |
| product_id | FK → products | cascade |

Unique index on `(user_id, product_id)`.

### 5.4 Orders

**`orders`**
| Column | Type | Notes |
|---|---|---|
| user_id | FK → users | |
| reference | string | unique — format `CS-2026-0001` |
| status | enum('pending','paid','processing','shipped','delivered','cancelled','refunded') | default 'pending' |
| **Money — all cents, all server-computed** | | |
| subtotal_cents | unsigned int | |
| discount_cents | unsigned int | default 0 |
| shipping_cents | unsigned int | default 0 |
| gift_wrap_cents | unsigned int | default 0 |
| duty_cents | unsigned int | default 0 |
| total_cents | unsigned int | |
| currency | char(3) | `USD` |
| **Settlement** | | |
| settlement_currency | char(3) | `LKR` |
| settlement_amount | unsigned bigint | nullable — LKR cents charged |
| fx_rate | decimal(12,6) | nullable — USD→LKR rate used |
| **Details** | | |
| promo_code_id | FK → promo_codes | nullable |
| shipping_rate_key | string | `standard` / `express` |
| gift_wrap | boolean | default false |
| gift_message | text | nullable |
| customer_notes | text | nullable |
| shipping_address | json | **snapshot**, not a FK |
| billing_address | json | **snapshot**, not a FK |
| email, phone | string | snapshot |
| placed_at, paid_at, shipped_at | timestamp | nullable |

**`order_items`** — price snapshots, never re-derived
| Column | Type | Notes |
|---|---|---|
| order_id | FK → orders | cascade |
| product_id | FK → products | nullOnDelete |
| product_name | string | **snapshot** |
| size_label | string | **snapshot** |
| lot_number | string | nullable, snapshot |
| unit_price_cents | unsigned int | **snapshot** |
| quantity | unsigned int | |
| line_total_cents | unsigned int | |

> Snapshotting is essential: a 2026 order must still show its 2026 price after the catalogue changes in 2027.

**`payments`**
| Column | Type | Notes |
|---|---|---|
| order_id | FK → orders | |
| gateway | string | `payhere` |
| gateway_payment_id | string | nullable, indexed |
| status | enum('pending','success','failed','chargeback','refunded') | |
| amount | unsigned bigint | in settlement currency |
| currency | char(3) | |
| method | string | nullable — card / wallet as reported |
| card_last4 | char(4) | nullable — **never store the full PAN** |
| raw_payload | json | the full webhook body, for audit |

### 5.5 Supporting tables

**`promo_codes`**
| Column | Type | Notes |
|---|---|---|
| code | string | unique, uppercase |
| type | enum('percent','fixed') | |
| value | unsigned int | percent (1–100) or cents |
| min_subtotal_cents | unsigned int | default 0 |
| usage_limit | unsigned int | nullable — total redemptions |
| used_count | unsigned int | default 0 |
| per_user_limit | unsigned int | nullable |
| starts_at, expires_at | timestamp | nullable |
| is_active | boolean | default true |

Seed: `HARVEST10` (percent, 10) and `MATALE15` (percent, 15).

**`shipping_rates`**
| Column | Type | Notes |
|---|---|---|
| key | string | unique — `standard` / `express` |
| name | string | `Standard export` / `Express air` |
| eta | string | `8–12 working days · tracked` |
| price_cents | unsigned int | 950 / 2400 |
| free_above_cents | unsigned int | nullable — 7500 on standard only |
| is_active | boolean | |

**`currencies`** — display-only estimates
| Column | Type | Notes |
|---|---|---|
| code | char(3) | unique |
| symbol | string | |
| rate_to_usd | decimal(12,6) | |
| updated_at | timestamp | staleness check |

**`newsletter_subscribers`** — email (unique), name (nullable), confirmed_at (nullable), unsubscribed_at (nullable), source.

**`contact_messages`** — name, email, phone, company (nullable), inquiry_type, subject (nullable), message, is_read, replied_at. Inquiry types: `General Inquiry`, `Wholesale & Bulk Order`, `Private Label`, `Returns & Refunds`, `Press & Partnerships`, `Other`.

**`reviews`** (optional, phase 2) — product_id, user_id, rating (1–5), title, body, is_approved. Recompute `products.rating` and `review_count` on approve.

---

## 6. Pricing engine

**One service class — `App\Services\PricingService` — is the only place money is calculated.** Controllers must not do arithmetic on prices.

### Order of operations (must not change)

```
1. subtotal   = Σ (product_size.price_cents × quantity)
2. discount   = promo applied to subtotal   (validate eligibility server-side)
3. afterDisc  = subtotal − discount
4. shipping   = rate.price_cents
                 → 0 if rate.free_above_cents is set AND afterDisc >= free_above_cents
5. giftWrap   = 600 if gift_wrap else 0
6. duty       = 0 if shipping country == 'Sri Lanka'
                 else round(afterDisc × 0.045)
7. total      = afterDisc + shipping + giftWrap + duty
```

Constants (seed as config, not hard-coded in logic): free-shipping threshold **$75**, standard **$9.50**, express **$24**, gift wrap **$6**, duty rate **4.5%**.

### Rules

- Recompute **from the database** on every quote and every order creation.
- The browser sends product IDs, size IDs, quantities, promo code, shipping key, gift flag, country — **never prices**.
- Reject the order if a submitted product is inactive, out of stock, or has insufficient quantity.
- `GET /api/cart/quote` returns the same computation so the front end can display live totals without inventing them.

---

## 7. API contracts

All routes prefixed `/api`. JSON only. Sanctum cookie auth. Guests pass `X-Guest-Token` (a UUID the front end generates and stores) so a guest cart can be found and later merged.

### Auth
| Method | Path | Body | Notes |
|---|---|---|---|
| GET | `/sanctum/csrf-cookie` | — | call before first POST |
| POST | `/api/auth/register` | name, email, password, password_confirmation, shipping_region?, marketing_opt_in? | **Does not log in** — matches the required flow |
| POST | `/api/auth/login` | email, password, remember? | Merges guest cart if `X-Guest-Token` present |
| POST | `/api/auth/logout` | — | auth required |
| GET | `/api/auth/me` | — | current user or 401 |
| POST | `/api/auth/forgot-password` | email | |
| POST | `/api/auth/reset-password` | token, email, password | |

> **Flow requirement:** register → redirect to sign-in → after login, return to the page the user came from. The front end handles the redirect via a `returnTo` query param; the API just must not auto-login on register.

### Catalogue (public)
| Method | Path | Notes |
|---|---|---|
| GET | `/api/products` | Query: `search`, `category`, `min_price`, `max_price`, `sort` (`featured\|low\|high\|top\|az`), `page`, `per_page`. Returns paginated resources with sizes and images. |
| GET | `/api/products/{slug}` | Single product, all sizes, all images |
| GET | `/api/products/featured` | `is_featured = true` — landing page Best Sellers |
| GET | `/api/categories` | With product counts (the sidebar shows counts) |

### Cart
| Method | Path | Body |
|---|---|---|
| GET | `/api/cart` | — |
| POST | `/api/cart/items` | product_id, product_size_id, quantity |
| PATCH | `/api/cart/items/{id}` | quantity (0 removes) |
| DELETE | `/api/cart/items/{id}` | — |
| POST | `/api/cart/merge` | called on login; merges guest → user cart (sum quantities, clamp 99) |
| GET | `/api/cart/quote` | shipping_key, country, gift_wrap, promo_code → full PricingService breakdown |

### Wishlist (auth)
`GET /api/wishlist` · `POST /api/wishlist/{product}` · `DELETE /api/wishlist/{product}`

### Orders (auth)
| Method | Path | Notes |
|---|---|---|
| POST | `/api/orders` | Creates a `pending` order from the cart. Body: addresses, shipping_key, gift flags, notes, promo_code. **Server recomputes all money.** Returns order + PayHere payment payload. |
| GET | `/api/orders` | The user's orders |
| GET | `/api/orders/{reference}` | Single order — powers the receipt |

### Payments
| Method | Path | Notes |
|---|---|---|
| POST | `/api/payments/payhere/initiate` | Returns merchant_id, order_id, amount, currency, **hash** |
| POST | `/api/payments/payhere/notify` | **Webhook. Public, CSRF-exempt.** Verifies signature, marks paid. The ONLY thing that may set status to `paid`. |
| GET | `/api/payments/payhere/return` | Browser redirect — display only, never trusted |

### Misc (public)
`POST /api/newsletter/subscribe` · `POST /api/contact` (both rate-limited, both with honeypot support) · `GET /api/currencies` (display rates).

---

## 8. PayHere integration

### Initiate
Build the hash exactly as PayHere specifies:

```
hash = strtoupper(md5(
    merchant_id +
    order_id +
    amount_formatted +      // 2 decimals, no thousands separator
    currency +
    strtoupper(md5(merchant_secret))
))
```

Convert the USD total to LKR at charge time, store `fx_rate` and `settlement_amount` on the order, and send LKR to PayHere.

### Notify webhook (the critical path)
1. Verify `md5sig` against the recomputed local signature. Reject on mismatch.
2. Confirm `payhere_amount` and `payhere_currency` match the stored settlement values.
3. Map `status_code`: `2` = success, `0` = pending, `-1` = cancelled, `-2` = failed, `-3` = chargeback.
4. On success: set `orders.status = paid`, `paid_at = now()`, write the `payments` row, decrement stock, increment `promo_codes.used_count`, dispatch the confirmation email.
5. **Idempotency:** the webhook can fire more than once. Guard on `gateway_payment_id` so a repeat delivery does not double-decrement stock or resend email.

### Rules
- Never mark an order paid from the browser redirect.
- Never store a full card number. `card_last4` only.
- Log every raw payload to `payments.raw_payload`.
- Test against PayHere **sandbox** first. The webhook needs a public URL locally — use ngrok or Herd's share feature.

---

## 9. Admin (Filament v4)

Resources: Orders (status transitions, line items, payment record), Products (with sizes + images as relation managers), Categories, Promo codes, Shipping rates, Contact messages, Newsletter subscribers, Users, Reviews (approve).

Dashboard widgets: revenue this month, orders by status, low-stock products, latest orders.

Guard the panel with the `is_admin` flag.

---

## 10. Security requirements

- Argon2id password hashing (Laravel default is fine — set `PASSWORD_ARGON2ID`).
- Rate limit: login 5/min per IP+email, register 3/min, contact and newsletter 3/min.
- Validate **every** request through Form Request classes.
- CSRF on all stateful routes; exempt only the PayHere webhook.
- Cookies: `HttpOnly`, `Secure` (in production), `SameSite=Lax` for the SPA.
- Never trust client prices. Never trust the browser's payment status.
- Treat `localStorage`-sourced cart data as untrusted input on merge — validate IDs and clamp quantities 1–99.
- Email verification before checkout is optional but recommended.
- Log auth failures and webhook signature mismatches.

---

## 11. Testing (Pest)

Minimum coverage before calling it done:

- **PricingService** — the full order of operations; free-shipping threshold boundary ($74.99 vs $75.00); duty zero for Sri Lanka; percent and fixed promos; a promo that pushes the subtotal below the free-shipping threshold.
- **Auth** — register does not log in; login merges the guest cart; rate limiting fires.
- **Cart** — quantity clamping; the unique constraint on (cart, product, size); guest → user merge sums correctly.
- **Orders** — a tampered client price is ignored; an inactive/out-of-stock product is rejected; the total matches PricingService.
- **PayHere webhook** — valid signature marks paid; invalid signature rejected; duplicate delivery is idempotent.

---

## 12. Build order

Work through these in sequence. Each step should end green (`php artisan test`).

**Phase 1 — Foundation**
1. `composer create-project laravel/laravel ceylon-spicera-api`
2. Configure `.env` (Section 4), create the `ceylon_spicera` database
3. Install Sanctum; configure SPA stateful domains and CORS for `http://localhost:3001`
4. Install Pest; confirm the suite runs

**Phase 2 — Schema**
5. Write every migration in Section 5
6. Write models with relationships, casts, and `$fillable`
7. Write factories for products, sizes, users, orders
8. Write seeders — **port the 16 products from the front end's `lib/shop-data.ts`**, the 6 categories, 3 sizes each, 2 promo codes, 2 shipping rates
9. `migrate:fresh --seed` and verify in the database

**Phase 3 — Catalogue API**
10. API Resources for Product, ProductSize, Category
11. `ProductController` with filtering, sorting, pagination
12. `CategoryController` with counts
13. Feature-test every filter and sort option

**Phase 4 — Auth**
14. Register / login / logout / me — **register must not log in**
15. Password reset with Mailpit
16. Rate limiting
17. Tests

**Phase 5 — Cart & wishlist**
18. Guest cart via `X-Guest-Token`; user cart via Sanctum
19. Cart CRUD with clamping
20. Merge-on-login
21. Wishlist CRUD
22. Tests

**Phase 6 — Pricing & orders**
23. `PricingService` (Section 6) — build this **test-first**
24. `/api/cart/quote`
25. Promo validation (eligibility, limits, dates)
26. `OrderController@store` — recompute, snapshot, transaction-wrap
27. Tests, including the tampered-price case

**Phase 7 — Payments**
28. PayHere initiate + hash
29. Notify webhook with signature verification and idempotency
30. Order confirmation mail
31. Sandbox end-to-end test via ngrok

**Phase 8 — Admin**
32. Filament install, `is_admin` guard
33. Resources and dashboard widgets

**Phase 9 — Front-end integration** *(do this in the Next project)*
34. Add `lib/api.ts` — a fetch wrapper handling the CSRF cookie, credentials, and the guest token
35. Rewrite `auth-context.tsx` bodies → real endpoints (the UI does not change)
36. Rewrite `store-context.tsx` bodies → cart/wishlist endpoints
37. Replace `lib/shop-data.ts` reads with `/api/products`
38. Checkout POSTs to `/api/orders`, then redirects to PayHere
39. Receipt reads `/api/orders/{reference}`

**Phase 10 — Hardening**
40. Full validation pass, security headers, queue worker for mail, backup strategy

---

## 13. Reference data to seed

**Sizes** (every product): `50g` ×0.60 · `100g` ×1.00 · `250g` ×2.20 — `100g` is the reference price.

**Shipping:** `standard` — Standard export, `8–12 working days · tracked`, $9.50, free above $75. `express` — Express air, `3–5 working days · tracked`, $24, no free threshold.

**Promos:** `HARVEST10` 10% · `MATALE15` 15%.

**Categories & counts** (16 products total): Cinnamon 4, Pepper 3, Cardamom 3, Roots & Leaf 3, Blends 1, Gift Sets 2.

**Estates** used across the catalogue: Matale, Kandy, Kegalle, Kandenuwara.

> The product catalogue in `lib/shop-data.ts` is **placeholder content** — names, prices, ratings, review counts, estates and lot numbers are invented. Seed it to get working data, but replace it with the real catalogue before launch.

---

## 14. Notes and known gaps

- **Hosting is deliberately out of scope** for now. When it comes: Laravel runs on shared hosting, but Next.js needs Node — so either Vercel (Next) + Hostinger (Laravel), or a single VPS for both.
- **Multi-currency is display-only.** Do not add per-currency pricing without revisiting the FX/settlement risk.
- The Account page spec described 2FA, honeypots, a password-strength meter, and policy modals. The strength meter is already built in the UI; **2FA, real rate limiting, and email verification belong to this backend phase.**
- Product images are not yet in the front end — cards render labelled placeholders. Wiring medialibrary lets real photos flow through the API.
