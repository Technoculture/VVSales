const { turso_db } = require("./drizzle");
const { tasks } = require("./drizzle/schema");

const main = async () => {
  //insert a row into turso db
  const insertResult = await turso_db
    .insert(tasks)
    .values({
      name: "test",
      contactNumber: "1234567890",
      city: "test",
      state: "test",
      targetCallCount: 1,
    })
    .execute();
  console.log(insertResult);
};

main();
