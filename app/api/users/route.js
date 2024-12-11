import { executeQuery } from "../lib/api";

const TABLE = "users";

// create user
export async function POST(req) {
  const params = await req.json();

  const query = `
  INSERT INTO ${TABLE} (email, username, pw, jobs_filter, jobs_draft)
  VALUES (?, ?, ?, ?)`;

  try {
    const result = await executeQuery(query, [
      params.email,
      params.username,
      params.password,
      params.jobs_filter,
      params.jobs_draft,
    ]);

    // successful request
    return new Response(JSON.stringify({ inserted_id: result.insertId }), {
      status: 201,
    });
  } catch (err) {
    console.error(err);

    return new Response({ error: err.message }, { status: 500 });
  }
}
