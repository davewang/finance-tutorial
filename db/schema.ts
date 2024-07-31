import { text, pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema } from "drizzle-zod"
import { createId } from "@paralleldrive/cuid2"
// declaring enum in database
// export const popularityEnum = pgEnum('popularity', ['unknown', 'known', 'popular']);

// export const countries = pgTable('countries', {
//   id: serial('id').primaryKey(),
//   name: varchar('name', { length: 256 }),
// }, (countries) => {
//   return {
//     nameIndex: uniqueIndex('name_idx').on(countries.name),
//   }
// });

// export const cities = pgTable('cities', {
//   id: serial('id').primaryKey(),
//   name: varchar('name', { length: 256 }),
//   countryId: integer('country_id').references(() => countries.id),
//   popularity: popularityEnum('popularity'),
// });

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey().$defaultFn(()=>createId()),
  plaidId: text("plaid_id"),
  name: text('name').notNull(),
  userId: text('user_id').notNull(),
});
export const insertAccountSchema = createInsertSchema(accounts);