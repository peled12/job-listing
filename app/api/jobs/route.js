import { executeQuery } from "../lib/api";

const TABLE = "jobs";

export async function GET() {
  try {
    const query = `SELECT * FROM ${TABLE}`;

    const data = await executeQuery(query);

    return new Response(JSON.stringify(data), {
      status: 200,
    });
  } catch (err) {
    console.error(err);

    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  const params = await req.json();

  console.log(params);

  try {
    const createJobQuery = `INSERT INTO ${TABLE} (
      id,
      salary, 
      experience, 
      location, 
      job_type, 
      title,
      contact, 
      description, 
      company, 
      more_description,
      valid_through
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const updateUserQuery = `UPDATE users
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

    const jobResult = await executeQuery(createJobQuery, [
      params.id,
      params.salary,
      params.experience,
      params.location,
      params.job_type,
      params.title,
      params.contact,
      params.description,
      params.company,
      params.more_description,
      params.new_time,
    ]);

    const userResult = await executeQuery(updateUserQuery, [
      params.id,
      params.new_time,
      params.user_id,
    ]);

    return new Response(
      JSON.stringify({ job_result: jobResult, user_result: userResult }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);

    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
