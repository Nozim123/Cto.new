# MTC Platform - Data Structures Reference

This document outlines the data structures needed for the backend implementation of new features.

---

## 1. Gamification & Rewards

### missions.json
```json
{
  "id": "mission_001",
  "title": "Store Explorer",
  "description": "Visit 5 different stores today",
  "type": "daily|weekly|monthly",
  "progress": 0,
  "total": 5,
  "reward": {
    "points": 100,
    "coupons": ["coupon_001"]
  },
  "icon": "store",
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-12-31T23:59:59Z"
}
```

### achievements.json
```json
{
  "id": "achievement_001",
  "title": "First Steps",
  "description": "Complete your first mission",
  "icon": "🎯",
  "unlocked": false,
  "reward": {
    "points": 50,
    "badge": "first_steps"
  },
  "requirements": {
    "type": "missions_completed",
    "count": 1
  }
}
```

### user_missions.json
```json
{
  "userId": "user_001",
  "missionId": "mission_001",
  "progress": 3,
  "total": 5,
  "completed": false,
  "startDate": "2024-01-15T10:00:00Z",
  "completedDate": null
}
```

### user_achievements.json
```json
{
  "userId": "user_001",
  "achievementId": "achievement_001",
  "unlockedDate": "2024-01-15T12:30:00Z"
}
```

---

## 2. Gift Cards & Vouchers

### gift_cards.json
```json
{
  "id": "gc_001",
  "type": "mall|store",
  "title": "MTC Mall Gift Card",
  "description": "Use at any store in all MTC malls",
  "amount": 50.00,
  "currency": "USD",
  "validFor": 365, // days
  "delivery": "instant",
  "image": "https://...",
  "storeId": null, // if store-specific
  "active": true
}
```

### user_gift_cards.json
```json
{
  "id": "ugc_001",
  "userId": "user_001",
  "giftCardId": "gc_001",
  "code": "MTC-2024-X7K9P",
  "balance": 50.00,
  "status": "active|used|expired",
  "purchaseDate": "2024-01-15T10:00:00Z",
  "expiryDate": "2025-01-15T10:00:00Z",
  "barcode": "MTC2024X7K9P",
  "senderId": null, // if gifted
  "recipientEmail": null
}
```

### vouchers.json
```json
{
  "id": "voucher_001",
  "code": "SUMMER-20-OFF",
  "type": "percentage|fixed|shipping",
  "value": 20,
  "currency": "USD",
  "minPurchase": 100.00,
  "maxDiscount": null,
  "usageLimit": null,
  "usageCount": 0,
  "validFrom": "2024-01-01T00:00:00Z",
  "validTo": "2024-06-30T23:59:59Z",
  "applicableStores": ["all"], // or specific store IDs
  "active": true
}
```

### user_vouchers.json
```json
{
  "id": "uv_001",
  "userId": "user_001",
  "voucherId": "voucher_001",
  "status": "active|used|expired",
  "assignedDate": "2024-01-15T10:00:00Z",
  "usedDate": null,
  "usedOrderId": null
}
```

---

## 3. Influencer Zone

### influencers.json
```json
{
  "id": "influencer_001",
  "name": "Sofia Style",
  "avatar": "https://...",
  "followers": 125000,
  "verified": true,
  "specialty": "Fashion & Lifestyle",
  "socialLinks": {
    "instagram": "@sofiastyle",
    "youtube": "@sofiastyle",
    "tiktok": "@sofiastyle"
  },
  "active": true
}
```

### influencer_videos.json
```json
{
  "id": "video_001",
  "influencerId": "influencer_001",
  "title": "Best Sneakers Collection 2024",
  "thumbnail": "https://...",
  "videoUrl": "https://...",
  "duration": "12:34",
  "views": 45000,
  "likes": 2300,
  "shares": 500,
  "category": "fashion|tech|beauty|lifestyle",
  "products": ["prod_001", "prod_002"],
  "tags": ["sneakers", "2024", "fashion"],
  "publishedDate": "2024-01-13T10:00:00Z",
  "active": true
}
```

### influencer_collections.json
```json
{
  "id": "collection_001",
  "influencerId": "influencer_001",
  "name": "Summer Collection 2024",
  "description": "Curated picks for summer fashion",
  "image": "https://...",
  "products": ["prod_001", "prod_002", "prod_003"],
  "publishedDate": "2024-01-10T10:00:00Z",
  "active": true
}
```

---

## 4. Customer Support

### support_tickets.json
```json
{
  "id": "TKT-001",
  "userId": "user_001",
  "category": "Order Issue|Payment Problem|Product Question|Technical Issue|Other",
  "subject": "Order #12345 not received",
  "message": "I ordered 3 days ago but haven't received tracking...",
  "status": "open|in_progress|resolved|closed",
  "priority": "low|medium|high|urgent",
  "assignedTo": "support_agent_001",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T14:00:00Z",
  "resolvedAt": null
}
```

### ticket_messages.json
```json
{
  "id": "msg_001",
  "ticketId": "TKT-001",
  "senderId": "user_001|support_agent_001",
  "message": "My order hasn't arrived yet",
  "attachments": [],
  "createdAt": "2024-01-15T10:00:00Z",
  "isInternal": false
}
```

### faq_items.json
```json
{
  "id": "faq_001",
  "category": "Order & Delivery|Returns & Refunds|Loyalty Program|Payments",
  "question": "How can I track my order?",
  "answer": "Go to Orders page in your profile, find your order and click Track to see real-time status.",
  "order": 1,
  "active": true
}
```

---

## 5. Business Partnership

### partnership_applications.json
```json
{
  "id": "app_001",
  "type": "retail|franchise|strategic|vendor",
  "applicantName": "John Doe",
  "email": "john@company.com",
  "phone": "+998901234567",
  "companyName": "Fashion Trends LLC",
  "website": "https://fashiontrends.uz",
  "description": "Premium fashion brand looking to expand...",
  "preferredMall": "family-park",
  "spaceRequired": 150, // sqm
  "investmentBudget": 50000,
  "status": "pending|under_review|approved|rejected",
  "submittedAt": "2024-01-15T10:00:00Z",
  "reviewedAt": null,
  "reviewedBy": null,
  "notes": "Great concept, needs more details"
}
```

### lease_agreements.json
```json
{
  "id": "lease_001",
  "applicationId": "app_001",
  "storeId": "store_001",
  "mallId": "family-park",
  "floor": 2,
  "unit": "A-12",
  "area": 150, // sqm
  "startDate": "2024-03-01T00:00:00Z",
  "endDate": "2027-03-01T00:00:00Z",
  "monthlyRate": 12000,
  "currency": "USD",
  "terms": "premium_flagship",
  "status": "active|expired|terminated",
  "signedAt": "2024-02-01T10:00:00Z"
}
```

---

## 6. Live Mall Status

### mall_live_status.json
```json
{
  "mallId": "family-park",
  "timestamp": "2024-01-15T14:30:00Z",
  "openStores": 89,
  "totalStores": 120,
  "occupancyRate": 67.5,
  "estimatedVisitors": 2340,
  "parking": {
    "level_b1": {
      "total": 500,
      "available": 156
    },
    "level_b2": {
      "total": 500,
      "available": 234
    },
    "level_b3": {
      "total": 500,
      "available": 89
    },
    "roof": {
      "total": 1000,
      "available": 456
    }
  },
  "foodCourt": {
    "level_1": {
      "current": 156,
      "capacity": 300
    },
    "level_2": {
      "current": 78,
      "capacity": 200
    },
    "outdoor": {
      "current": 134,
      "capacity": 150
    }
  },
  "events": {
    "active": 3,
    "upcoming": 5
  },
  "queueTimes": {
    "restaurants": "5-10 min",
    "cinema": "15 min",
    "information": "2 min",
    "restrooms": "No wait"
  }
}
```

### mall_alerts.json
```json
{
  "id": "alert_001",
  "mallId": "family-park",
  "type": "info|warning|success|error",
  "message": "New store opening on Level 2 next week",
  "severity": "low|medium|high",
  "affectedAreas": ["level_2"],
  "startTime": "2024-01-15T10:00:00Z",
  "endTime": null,
  "active": true
}
```

---

## 7. Sustainability

### eco_challenges.json
```json
{
  "id": "eco_challenge_001",
  "title": "Plastic Free Week",
  "description": "Use reusable bags for all purchases",
  "type": "daily|weekly|monthly",
  "duration": 7, // days
  "requirements": {
    "type": "reusable_bag_usage",
    "count": 7
  },
  "reward": {
    "points": 200,
    "badge": "plastic_free_hero"
  },
  "active": true
}
```

### recycling_stations.json
```json
{
  "id": "rs_001",
  "mallId": "family-park",
  "location": "Level 1 - Near Entrance A",
  "items": ["Paper", "Plastic", "Glass", "Metal", "Batteries"],
  "coordinates": {
    "floor": 1,
    "x": 10.5,
    "y": 20.3
  },
  "active": true
}
```

### ev_charging_stations.json
```json
{
  "id": "ev_001",
  "mallId": "family-park",
  "location": "Parking B1 - Zone A",
  "type": "fast|standard",
  "spots": 8,
  "power": "50kW", // for fast
  "connectors": ["Type 2", "CCS"],
  "pricing": {
    "perKwh": 0.50,
    "perMinute": null
  },
  "status": "active|maintenance|offline"
}
```

### eco_stats.json
```json
{
  "userId": "user_001",
  "ecoScore": "A+",
  "points": 1250,
  "itemsRecycled": 47,
  "energySaved": 234, // kWh
  "waterSaved": 156, // L
  "treesPlanted": 3,
  "co2Offset": 45, // kg
  "lastUpdated": "2024-01-15T14:30:00Z"
}
```

---

## 8. User Enhancements

### user_extended.json
```json
{
  "userId": "user_001",
  "loyalty": {
    "tier": "Silver",
    "points": 2450,
    "level": 12,
    "dailyStreak": 7,
    "joinedDate": "2023-06-15T10:00:00Z"
  },
  "notifications": {
    "mallUpdates": true,
    "storeChanges": true,
    "mallEvents": false,
    "priceDrops": true,
    "backInStock": true,
    "flashSales": false,
    "newArrivals": true,
    "pointsEarned": true,
    "rewardAlerts": true,
    "tierUpgrade": true,
    "birthdayRewards": true
  },
  "preferences": {
    "language": "en",
    "currency": "USD",
    "theme": "dark"
  }
}
```

### user_activity.json
```json
{
  "id": "activity_001",
  "userId": "user_001",
  "type": "store_visit|product_view|purchase|review|share",
  "entityId": "store_001|prod_001",
  "entityType": "store|product",
  "metadata": {},
  "timestamp": "2024-01-15T14:30:00Z"
}
```

---

## 9. Enhanced Product Data

### products_extended.json
```json
{
  "id": "prod_001",
  "storeId": "store_001",
  "name": "Pro Running Shoes",
  "price": 89.99,
  "originalPrice": 119.99,
  "image": "https://...",
  "category": "Footwear",
  "brand": "Terra Athletics",
  "rating": 4.8,
  "reviews": 234,
  "availability": "In Stock|Low Stock|Out of Stock",
  "tags": ["Best Seller", "New", "Sale"],
  "description": "...",
  "specifications": {},
  "gallery": [],
  "sizes": [],
  "colors": [],
  "influencerRecommended": true,
  "influencerIds": ["influencer_001", "influencer_002"],
  "ecoFriendly": false,
  "sustainable": false
}
```

---

## API Endpoints Reference

### Gamification
- `GET /api/missions` - Get available missions
- `POST /api/missions/:id/complete` - Complete mission
- `GET /api/achievements` - Get achievements
- `GET /api/achievements/user/:id` - Get user achievements

### Gift Cards
- `GET /api/gift-cards` - List gift cards
- `POST /api/gift-cards/purchase` - Purchase gift card
- `GET /api/vouchers/user/:id` - Get user vouchers
- `POST /api/vouchers/:code/redeem` - Redeem voucher

### Influencers
- `GET /api/influencers` - List influencers
- `GET /api/influencers/:id/videos` - Get influencer videos
- `GET /api/influencers/:id/collections` - Get influencer collections

### Support
- `POST /api/tickets` - Create support ticket
- `GET /api/tickets/user/:id` - Get user tickets
- `POST /api/tickets/:id/messages` - Add message
- `GET /api/faq` - Get FAQ items

### Partnership
- `POST /api/partnership/apply` - Submit application
- `GET /api/partnership/applications` - Get applications (admin)

### Live Status
- `GET /api/malls/:id/status` - Get live mall status
- `GET /api/malls/:id/alerts` - Get mall alerts

### Sustainability
- `GET /api/eco/challenges` - Get eco challenges
- `GET /api/malls/:id/recycling` - Get recycling stations
- `GET /api/malls/:id/charging` - Get EV stations
- `GET /api/eco/stats/:userId` - Get user eco stats

---

## Database Indexes

Recommended indexes for performance:

```sql
-- Gamification
CREATE INDEX idx_user_missions_user_id ON user_missions(userId);
CREATE INDEX idx_user_missions_mission_id ON user_missions(missionId);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(userId);

-- Gift Cards
CREATE INDEX idx_user_gift_cards_user_id ON user_gift_cards(userId);
CREATE INDEX idx_user_gift_cards_code ON user_gift_cards(code);
CREATE INDEX idx_user_vouchers_user_id ON user_vouchers(userId);

-- Influencers
CREATE INDEX idx_influencer_videos_influencer_id ON influencer_videos(influencerId);
CREATE INDEX idx_influencer_collections_influencer_id ON influencer_collections(influencerId);

-- Support
CREATE INDEX idx_support_tickets_user_id ON support_tickets(userId);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);

-- Partnership
CREATE INDEX idx_partnership_applications_status ON partnership_applications(status);

-- Live Status
CREATE INDEX idx_mall_alerts_mall_id ON mall_alerts(mallId);
CREATE INDEX idx_mall_alerts_active ON mall_alerts(active);

-- Sustainability
CREATE INDEX idx_user_activity_user_id ON user_activity(userId);
CREATE INDEX idx_user_activity_timestamp ON user_activity(timestamp);
```

---

This data structure reference provides a complete blueprint for backend implementation of all new features.
