import getOneUser from "../lib/getOneUser";

const TABLE = "users";

// login check
export async function POST(req) {
  const { email, password } = await req.json();

  try {
    const query = `SELECT * FROM ${TABLE} WHERE email = ?`;

    // get the user
    const user = await getOneUser(query, [email]);

    // correct password, send the data to the client
    if (user.pw === password) {
      console.log("GOOD");

      return new Response(JSON.stringify(user), {
        status: 200,
      });
    }

    // else, wrong password. throw an error
    throw { cause: "wrong password", status: 401 };
  } catch (err) {
    console.error(err.status);

    // send the corresponding message to the client
    return new Response(err.cause, {
      status: err.status,
    });
  }
}
