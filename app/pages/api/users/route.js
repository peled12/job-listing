import { prisma } from "../lib/prisma";

// create user
export async function POST(req) {
  const params = await req.json();

  // make sure the necessary fields are provided
  if (!params.email || !params.username || !params.password) {
    return new Response("Missing required fields.", { status: 400 });
  }

  try {
    // create a new user in the database using Prisma
    const newUser = await prisma.users.create({
      data: {
        email: params.email,
        username: params.username,
        pw: params.password,
        jobs_filter: params.jobs_filter || [], // assuming empty array if not provided
      },
    });

    // successful request
    return new Response(JSON.stringify({ inserted_id: newUser.id }), {
      status: 201,
    });
  } catch (err) {
    console.error(err);

    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
