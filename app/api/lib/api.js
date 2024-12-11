import mysql from "mysql2/promise";

export default async function getConnection() {
  return mysql.createConnection({
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
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
