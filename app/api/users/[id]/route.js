import { prisma } from "../../lib/prisma";

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

  try {
    // update user in the database using Prisma
    const updatedUser = await prisma.users.update({
      where: { id: Number(id) }, // make sure the id is a number
      data: changes, // this will update the fields passed in the body
    });

    // return the updated user data
    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (err) {
    console.error(err);

    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
