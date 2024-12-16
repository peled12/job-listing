import { prisma } from "../lib/prisma";

export async function GET() {
  const currentTime = new Date().getTime();

  try {
    // fetch all active jobs
    const data = await prisma.jobs.findMany({
      where: { valid_through: { gt: currentTime } },
    });

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

  try {
    // Create a new job entry
    const jobResult = await prisma.jobs.create({
      data: {
        id: params.id,
        salary: params.salary,
        experience: params.experience,
        location: params.location,
        job_type: params.job_type,
        title: params.title,
        contact: params.contact,
        description: params.description,
        company: params.company,
        more_description: params.more_description,
        user_id: params.user_id,
        valid_through: null, // initialize valid_through as null to be marked in draft
      },
    });

    return new Response(JSON.stringify({ job_result: jobResult }), {
      status: 200,
    });
  } catch (err) {
    console.error(err);

    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

export async function DELETE(req) {
  const id = await req.text();

  console.log(id);

  try {
    const result = await prisma.jobs.delete({
      where: {
        id: id,
      },
    });

    return new Response(JSON.stringify(result));
  } catch (err) {
    console.error(err);

    return new Response(JSON.stringify({ error: err.message }));
  }
}
