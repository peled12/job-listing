import { prisma } from "../lib/prisma";

export async function PATCH(req) {
  const { new_time, id } = await req.json();

  console.log(prisma);

  try {
    // update the job's valid_through
    const jobUpdateResult = await prisma.jobs.update({
      where: { id: id },
      data: { valid_through: new_time },
    });

    return new Response(JSON.stringify({ job_result: jobUpdateResult }), {
      status: 200,
    });
  } catch (err) {
    console.error(err);

    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
