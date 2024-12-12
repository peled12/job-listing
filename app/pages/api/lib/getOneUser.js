import getConnection from "./api";

export default async function getOneUser(query, valueParams = []) {
  const dbConnection = await getConnection();
  try {
    // double square brackets, one for the data, and one for the first row (the user)
    const [[user]] = await dbConnection.execute(query, valueParams);
    dbConnection.end();

    if (!user) throw { cause: "wrong email", status: 404 };

    return user;
  } catch (err) {
    dbConnection.end();

    // decide which error should be thrown

    // the previous error (wrong email)
    if (err.cause) throw err;

    // else, its an internal server error
    throw { cause: "Internal server error.", status: 500 };
  }
}
