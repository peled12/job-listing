import mysql from "mysql2/promise";

export default async function getConnection() {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
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
