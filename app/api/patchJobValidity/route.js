import { executeQuery } from "../lib/api";

const USERS_TABLE = "users";
const JOBS_TABLE = "jobs";

export async function PATCH(req) {
  const { new_time, id, user_id } = await req.json();

  console.log(new_time);
  console.log(id);
  console.log(user_id);

  const updateUserQuery = `UPDATE ${USERS_TABLE}
                  SET jobs_draft = JSON_SET(
                      jobs_draft,
                      REPLACE(
                          JSON_UNQUOTE(
                              JSON_SEARCH(jobs_draft, 'one', ?, NULL, '$[*].id')
                          ),
                          '.id',
                          '.valid_through'
                      ),
                      ?
                  )
                  WHERE id = ?
                  `;

  const updateJobQuery = `UPDATE ${JOBS_TABLE}
                            SET valid_through = ?
                            WHERE id = ?`;

  try {
    const userResult = await executeQuery(updateUserQuery, [
      id,
      new_time,
      user_id,
    ]);
    const jobResult = await executeQuery(updateJobQuery, [new_time, id]);

    return new Response(
      JSON.stringify({ user_result: userResult, job_result: jobResult })
    );
  } catch (err) {
    console.error(err);

    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
