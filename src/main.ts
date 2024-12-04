import { db } from "./db";
import { usersTable } from "./db/schema";

async function test() {
  const user = await db
    .insert(usersTable)
    .values({
      name: "Oleg",
      age: 20,
      email: "oleg-test@gmail.com",
      role: "ADMIN"
    })
    .returning(); // returns array with inserted objects

  console.log({ user });
}

test();
