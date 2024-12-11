import mysql from "mysql2/promise";

export default async function getConnection() {
  return mysql.createConnection({
    host: "localhost",
    database: "job_listing",
    user: "Philip",
    password: "PeRen213422_180408",
  });
}

export async function executeQuery(query, valueParams = []) {
  const dbConnection = await getConnection();
  try {
    const [data] = await dbConnection.execute(query, valueParams);

    return data;
  } catch (err) {
    throw Error(err.message);
  }
}
