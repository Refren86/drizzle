// import { sql } from "drizzle-orm";
import { asc, count, desc, eq, gt } from "drizzle-orm";
import { db } from "./db";
import { userPreferencesTable, usersTable } from "./db/schema";

async function test() {
  // INSERTING DATA

  // await db.delete(usersTable);
  // const user = await db
  //   .insert(usersTable)
  //   .values([
  //     {
  //       name: "Den",
  //       age: 26,
  //       email: "test@test.com",
  //       role: "ADMIN",
  //     },
  //     {
  //       name: "Oleg",
  //       age: 20,
  //       email: "olko12@test.com",
  //       role: "BASIC",
  //     },
  //   ])
  //   // if error occurs, it will ignore it and change the name to 'Updated Name'
  //   // .onConflictDoUpdate({
  //   //   target: usersTable.email,
  //   //   set: { name: 'Updated Name' }
  //   // })
  //   .returning();

  // await db.insert(userPreferencesTable).values({
  //   userId: "f7bd53b1-f044-4d26-a27d-191807fbf218",
  //   emailUpdates: true
  // })

  // GETTING DATA
  // 1st way
  // const users = await db.query.usersTable.findMany({
  // columns: { role: false },
  // extras: {
  //   lowerCaseName: sql<string>`lower(${usersTable.name})`.as("lowerCaseName"), // allows custom SQL query
  // },
  // limit: 1,
  // offset: 1,
  // orderBy: desc(usersTable.age),
  // orderBy: (table, { asc }) => asc(table.age),
  // where: (table, { between }) => between(table.age, 20, 30),
  // with: { preferences: true, posts: true }, // join tables
  // with: {
  //   posts: {
  //     with: {
  //       author: true,
  //       postCategories: {
  //         columns: {
  //           postId: true,
  //           categoryId: true
  //         }
  //       },
  //     },
  //   },
  // },
  // });

  // 2nd way
  // const users = await db
  //   .select({
  //     id: usersTable.id,
  //     name: usersTable.name,
  //     age: usersTable.age,
  //     emailUpdates: userPreferencesTable.emailUpdates,
  //   })
  //   .from(usersTable)
  // .where(eq(usersTable.age, 26))
  // .leftJoin(
  //   userPreferencesTable,
  //   eq(userPreferencesTable.userId, usersTable.id)
  // );

  // count each age
  const users = await db
    .select({ age: usersTable.age, count: count(usersTable.age) })
    .from(usersTable)
    .groupBy(usersTable.age)
    .having((columns) => gt(columns.count, 0));
  // .having(gt(usersTable.age, 25))

  console.log(users);
}

test();
