// schema/products.js
const { pgTable, serial, text, numeric, timestamp } = require("drizzle-orm/pg-core");

const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  price: numeric("price").notNull(),
  image_url: text("image_url"),
  owner_email: text("owner_email").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

module.exports = { products };
