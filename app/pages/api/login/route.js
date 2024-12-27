import { prisma } from "../lib/prisma";

// TODO: fix login

async function getUserPwAndId(email) {
  try {
    const user = await prisma.users.findUnique({
      where: { email }, // fetch user by email
      select: { pw: true, id: true },
    });

    if (!user) throw { cause: "wrong email", status: 404 };

    return user;
  } catch (err) {
    if (err && typeof err === "object") {
      console.error("Error in getUserPassword:", err);
    } else {
      console.error("Unexpected error:", err);
    }

    // decide which error to throw

    if (err.cause) throw err;

    throw { cause: "Internal server error.", status: 500 };
  }
}

// login check
export async function POST(req) {
  const { email, password } = await req.json();

  try {
    // get the user (only with password)
    const userPasswordAndId = await getUserPwAndId(email);

    console.log(userPasswordAndId);

    // if the password is correct
    if (userPasswordAndId.pw === password) {
      try {
        // get the user and return the data
        const user = await prisma.users.findUnique({
          where: { email }, // fetch user by email again
          include: {
            jobs_draft: true,
          },
        });

        return new Response(JSON.stringify(user), {
          status: 201,
        });
      } catch {
        return new Response("Internal server error.", { status: 500 });
      }
    }

    // else, wrong password. throw an error
    throw { cause: "wrong password", status: 401 };
  } catch (err) {
    // send the corresponding message to the client
    return new Response(err.cause, {
      status: err.status,
    });
  }
}
