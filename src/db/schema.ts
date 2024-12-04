import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("userRole", ["ADMIN", "BASIC"]);

export const usersTable = pgTable(
  "users",
  {
    // id: integer().primaryKey().generatedAlwaysAsIdentity(),
    id: uuid().primaryKey().defaultRandom(),
    name: varchar({ length: 255 }).notNull(),
    age: integer().notNull(),
    // age: integer().notNull().$type<12 | 24>(), // $type overwrites the type - allows only 12 and 24 values, cool for JSON data
    email: varchar({ length: 255 }).notNull(),
    role: userRole().default("BASIC").notNull(),
  },
  (table) => ({
    emailIndex: uniqueIndex().on(table.email), // speed up reads but slow down writes (inserts, updates, deletes)
    // compositeIndex().on(table.id, table.email) // will make several indexed columns
    // uniqueNameAndAge: unique().on(table.name, table.age), // will make specified columns combination unique
  })
);

export const userPreferencesTable = pgTable("userPreferences", {
  id: uuid().primaryKey().defaultRandom(),
  emailUpdates: boolean().notNull().default(false), // there is a $default, which takes a function to generate own default value
  userId: uuid()
    .references(() => usersTable.id)
    .notNull(), // sets foreign key (1-to-1)
});

export const postTable = pgTable("posts", {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar({ length: 255 }).notNull(),
  averageRating: real().notNull().default(0), // float value
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
  authorId: uuid()
    .references(() => usersTable.id)
    .notNull(), // sets foreign key (1-to-many)
});

export const categoryTable = pgTable("categories", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
});

// join table for many-to-many relation
export const postsToCategoriesTable = pgTable(
  "postsToCategories",
  {
    categoryId: uuid()
      .references(() => categoryTable.id)
      .notNull(),
    postId: uuid()
      .references(() => postTable.id)
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.categoryId, table.postId] }), // composite primary key
  })
);
