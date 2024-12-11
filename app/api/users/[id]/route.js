import { executeQuery } from "../../lib/api";

// patch user
export async function PATCH(req, context) {
  const params = await context.params;

  const { id } = params;

  // make sure the id is valid
  if (!id) return new Response("Id required.", { status: 400 });

  const changes = await req.json();

  // make sure the body is valid
  if (typeof changes !== "object" || Object.keys(changes).length === 0) {
    return new Response("No valid changes provided.", { status: 400 });
  }

  // create the set clause
  const setClause = Object.keys(changes)
    .map((column) => `${column} = ?`) // each column will have a placeholder
    .join(", ");

  // prepare values
  const valueParams = Object.values(changes);
  valueParams.push(id); // Add the id at the end for the WHERE clause

  const query = `
    UPDATE users
    SET ${setClause}
    WHERE id = ?
  `;

  try {
    const data = await executeQuery(query, valueParams);

    // success
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error(err);

    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
