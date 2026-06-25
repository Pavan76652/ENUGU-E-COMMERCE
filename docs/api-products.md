# ENUGU API — Product Management Module

**Base URL:** `http://localhost:5000/api/v1/admin/products`  
**Auth:** Bearer JWT (`admin` or `super_admin`)

---

## Product Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Product name |
| `sku` | string | Yes | Unique SKU |
| `description` | string | Yes | Full description (min 10 chars) |
| `categoryId` | ObjectId | Yes | Category reference |
| `mrp` | number | Yes | Maximum retail price (₹) |
| `sellingPrice` | number | Yes | Sale price (≤ MRP) |
| `discountPercentage` | number | Auto | Calculated: `((mrp - sellingPrice) / mrp) × 100` |
| `sizeStock` | array | Yes | Stock per size (S, M, L, XL, XXL) |
| `images` | array | Conditional | Min 2 for published products, max 10 |
| `status` | enum | Yes | `draft`, `published`, `sold_out`, `archived` |

### Product Status

| Status | Description |
|--------|-------------|
| `draft` | Not visible on storefront |
| `published` | Live on storefront |
| `sold_out` | Auto-set when all sizes have 0 stock |
| `archived` | Removed from catalog (soft) |

### Sizes & Inventory

Each product tracks stock separately for: **S, M, L, XL, XXL**

```json
"sizeStock": [
  { "size": "S",  "stock": 10, "lowStockThreshold": 5 },
  { "size": "M",  "stock": 15, "lowStockThreshold": 5 },
  { "size": "L",  "stock": 20, "lowStockThreshold": 5 },
  { "size": "XL", "stock": 8,  "lowStockThreshold": 5 },
  { "size": "XXL","stock": 5,  "lowStockThreshold": 5 }
]
```

**Storefront inventory response** (included in product payload as `inventory`):

| Condition | Behavior |
|-----------|----------|
| All sizes stock = 0 | `isSoldOut: true`, `soldOutLabel: "SOLD OUT"`, `isAddToCartDisabled: true` |
| Size stock ≤ threshold | `lowStockMessage: "Only X Left"` per size |

### Image Types

| Type | Label |
|------|-------|
| `front_view` | Front View |
| `back_view` | Back View |
| `model_front_view` | Model Front View |
| `model_back_view` | Model Back View |
| `lifestyle_1` | Lifestyle Image 1 |
| `lifestyle_2` | Lifestyle Image 2 |
| `additional` | Extra images |

**Limits:** Minimum 2 images, maximum 10 images per product.  
**Cover image** (`isCover: true`) always appears first on storefront.

---

## Cloudinary Setup

Add to `server/.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=enugu
```

Images stored at: `enugu/products/{productId}/`

---

## Endpoints

### List Products

```
GET /admin/products
```

**Query:** `page`, `limit`, `status`, `categoryId`, `search`, `sortBy`, `sortOrder`

---

### Get Product

```
GET /admin/products/:id
```

Returns enriched product with `discountPercentage`, sorted images, and `inventory` object.

---

### Create Product

```
POST /admin/products
```

**Permission:** `products.create`

**Body:**

```json
{
  "name": "ENUGU Monochrome Tee",
  "sku": "ENUGU-MC-001",
  "description": "Premium oversized tee with bold monochrome print.",
  "categoryId": "665f1a2b3c4d5e6f7a8b9c0d",
  "mrp": 1499,
  "sellingPrice": 999,
  "sizeStock": [
    { "size": "S", "stock": 10 },
    { "size": "M", "stock": 15 },
    { "size": "L", "stock": 20 },
    { "size": "XL", "stock": 8 },
    { "size": "XXL", "stock": 5 }
  ],
  "images": [
    {
      "url": "https://res.cloudinary.com/.../front.jpg",
      "publicId": "enugu/products/temp/front",
      "type": "front_view",
      "isCover": true
    },
    {
      "url": "https://res.cloudinary.com/.../back.jpg",
      "publicId": "enugu/products/temp/back",
      "type": "back_view"
    }
  ],
  "status": "draft"
}
```

**Response:** `201 Created`

---

### Update Product

```
PUT /admin/products/:id
```

**Permission:** `products.update`

Partial updates supported. Re-validates MRP/selling price and auto-syncs status from stock.

---

### Delete Product (Permanent)

```
DELETE /admin/products/:id
```

**Permission:** `products.delete`

Permanently deletes product and all Cloudinary images.

---

### Archive Product

```
PATCH /admin/products/:id/archive
```

**Permission:** `products.update`

Sets status to `archived` without deleting data.

---

### Update Status

```
PATCH /admin/products/:id/status
```

**Body:** `{ "status": "published" }`

Publishing requires minimum 2 images.

---

### Update Inventory

```
PATCH /admin/products/:id/inventory
```

**Body:**

```json
{
  "sizeStock": [
    { "size": "S", "stock": 0 },
    { "size": "M", "stock": 5 },
    { "size": "L", "stock": 12 },
    { "size": "XL", "stock": 3 },
    { "size": "XXL", "stock": 0 }
  ]
}
```

Auto-transitions to `sold_out` when all sizes reach 0.  
Auto-restores to `published` when stock is replenished from `sold_out`.

---

## Image Endpoints

### Upload Standalone Images (pre-create)

Upload to Cloudinary before creating a product. Use returned `url` + `publicId` in create body.

```
POST /admin/products/images/upload
Content-Type: multipart/form-data
```

| Field | Type | Description |
|-------|------|-------------|
| `images` | file[] | 1–10 image files |
| `type` | string | Image type (optional, default `additional`) |

**Response:** `201` with `{ images: [{ url, publicId, type }] }`

---

### Upload Images to Product

```
POST /admin/products/:id/images
Content-Type: multipart/form-data
```

| Field | Type | Description |
|-------|------|-------------|
| `images` | file[] | Image files |
| `type` | string | `front_view`, `back_view`, etc. |

Max 10 images total per product. First image becomes cover if none exists.

---

### Delete Image

```
DELETE /admin/products/:id/images
```

**Body:** `{ "publicId": "enugu/products/..." }`

Deletes from Cloudinary and product. Non-draft products must keep minimum 2 images.

---

### Reorder Images

```
PUT /admin/products/:id/images/reorder
```

**Body:**

```json
{
  "imageOrder": [
    "enugu/products/abc/cover",
    "enugu/products/abc/back",
    "enugu/products/abc/lifestyle"
  ]
}
```

Must include all image `publicId`s. Cover image should be first for storefront.

---

### Set Cover Image

```
PATCH /admin/products/:id/images/cover
```

**Body:** `{ "publicId": "enugu/products/abc/cover" }`

Sets cover and moves it to position 0 on storefront.

---

### List Categories

```
GET /admin/products/categories
```

---

## Example Response

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Product fetched",
  "data": {
    "product": {
      "name": "ENUGU Monochrome Tee",
      "mrp": 1499,
      "sellingPrice": 999,
      "discountPercentage": 33,
      "status": "published",
      "images": [
        { "url": "...", "type": "front_view", "isCover": true, "sortOrder": 0 }
      ],
      "inventory": {
        "totalStock": 58,
        "isSoldOut": false,
        "isAddToCartDisabled": false,
        "soldOutLabel": null,
        "lowStockSizes": [
          { "size": "XL", "message": "Only 3 Left" }
        ],
        "sizeStock": [
          { "size": "S", "stock": 10, "inStock": true, "lowStock": false },
          { "size": "XL", "stock": 3, "inStock": true, "lowStock": true, "lowStockMessage": "Only 3 Left" }
        ]
      }
    }
  }
}
```

---

## cURL Examples

```bash
# Upload images
curl -X POST http://localhost:5000/api/v1/admin/products/images/upload \
  -H "Authorization: Bearer <token>" \
  -F "images=@front.jpg" \
  -F "images=@back.jpg" \
  -F "type=front_view"

# Create product
curl -X POST http://localhost:5000/api/v1/admin/products \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d @product.json

# Upload more images to product
curl -X POST http://localhost:5000/api/v1/admin/products/<id>/images \
  -H "Authorization: Bearer <token>" \
  -F "images=@lifestyle.jpg" \
  -F "type=lifestyle_1"

# Set cover
curl -X PATCH http://localhost:5000/api/v1/admin/products/<id>/images/cover \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"publicId":"enugu/products/..."}'

# Archive
curl -X PATCH http://localhost:5000/api/v1/admin/products/<id>/archive \
  -H "Authorization: Bearer <token>"
```

---

## File Map

| File | Purpose |
|------|---------|
| `src/models/Product.js` | Product schema |
| `src/constants/productStatus.js` | Statuses, sizes, image types |
| `src/utils/productHelpers.js` | Discount, inventory, image sorting |
| `src/services/product.service.js` | Business logic |
| `src/services/cloudinary.service.js` | Cloudinary upload/delete |
| `src/config/cloudinary.js` | Cloudinary SDK config |
| `src/middleware/upload.middleware.js` | Multer file handling |
| `src/validators/product.validator.js` | Zod validation |
| `src/controllers/admin/product.controller.js` | HTTP handlers |
| `src/routes/v1/admin/products.routes.js` | Route definitions |
