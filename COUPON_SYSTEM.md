# 🎟️ ShopEase Coupon System

## Available Coupon Codes

| Code | Discount | Description |
|------|----------|-------------|
| **SAVE10** | 10% off | General discount |
| **SAVE20** | 20% off | Higher value discount |
| **WELCOME** | 15% off | Welcome offer for new users |
| **FLAT50** | 50% off | Premium discount (limited time) |
| **SUMMER25** | 25% off | Summer season special |
| **HOLIDAY30** | 30% off | Holiday offer |
| **FESTIVE40** | 40% off | Festive season sale |
| **NEWUSER** | 18% off | New user signup bonus |
| **FLASH** | 35% off | Flash sale code |

## How It Works

### Customer Side (Frontend)
1. Add products to cart
2. During checkout, in the **Coupon Code** field, enter one of the valid codes above
3. Click **Apply** button
4. Discount will be calculated and displayed
5. Proceed to payment with the discounted amount

### Admin/Backend
- Coupon validation happens on the frontend
- Orders store: `base_amount`, `discount %`, and `coupon_code`
- Discount is applied before payment processing
- Invoice shows both original and discounted amounts

## Order Fields
When an order is saved, it includes:
- `amount`: Final amount after discount
- `base_amount`: Original product price × quantity
- `discount`: Discount percentage (0-100)
- `coupon_code`: Applied coupon code or null

## Coupon Rules
- Only one coupon per order
- Cannot be stacked or combined
- Applied at checkout time only
- Visible in order history and invoices

## Example Calculation
```
Product Price: ₹1000
Quantity: 2
Base Amount: ₹2000
Coupon: SAVE20 (20% off)
Discount Amount: ₹400
Final Amount: ₹1600
```

## Admin Notes - How to Add Your Own Coupon Codes

### Step 1: Open Cart.jsx
Navigate to: `/Frontend/src/Pages/Cart.jsx`

### Step 2: Find the Coupon Section (Line ~122)
Look for the `applyCoupon` function and the `validCoupons` object:

```javascript
const validCoupons = {
  "SAVE10": 10,
  "SAVE20": 20,
  "WELCOME": 15,
  "FLAT50": 50
};
```

### Step 3: Add Your Custom Code
Add a new line with your coupon code and discount percentage:

```javascript
const validCoupons = {
  "SAVE10": 10,
  "SAVE20": 20,
  "WELCOME": 15,
  "FLAT50": 50,
  "YOUR_CODE": 25,      // ← Add like this
  "DISCOUNT50": 50,     // ← Any code name
  "PROMO100": 15        // ← Any discount %
};
```

### Step 4: Format Guidelines
- **Code Name**: Use uppercase (CAPITAL LETTERS)
- **Discount Value**: Use numbers 0-100 (representing percentage)
- **Example**: `"SAVE30": 30` = 30% discount

### Step 5: Rebuild Frontend
After adding codes, rebuild the frontend:
```bash
cd Frontend
npm run build
```

## Common Examples

```javascript
// Seasonal Campaigns
"SUMMER_SALE": 25,
"WINTER_SPECIAL": 20,
"NEWYER2024": 30,

// User Categories
"VIP_MEMBER": 40,
"LOYALTY_PLUS": 35,
"REFERRAL": 15,

// Time-Based
"MIDNIGHT": 45,
"WEEKEND": 25,
"WEEKDAY": 10,

// Product-Based (apply to all products)
"FREE_SHIPPING": 5,
"BUNDLE_DEAL": 50,
"CLEARANCE": 70
```

### Notes
- All validations are client-side (frontend only)
- For production, add server-side coupon database
- To disable a coupon, delete the line or rename it
- Coupon codes are **case-insensitive** (SAVE10, save10, Save10 all work)

## Future Enhancements
- [ ] Database-driven coupon management
- [ ] Coupon expiration dates
- [ ] Coupon usage tracking
- [ ] Admin coupon creation interface
- [ ] Server-side coupon validation
