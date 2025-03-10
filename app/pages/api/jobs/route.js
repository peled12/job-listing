import { prisma } from "../lib/prisma";

export async function GET() {
  try {
    console.log("fetching jobs....");

    // fetch all active jobs
    const data = await prisma.jobs.findMany({
      where: { valid_through: { gt: new Date() } },
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
        salary: Number(params.salary),
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

    const insertedId = jobResult.id;

    return new Response(
      JSON.stringify({
        message: "Job created succsessfully",
        inserted_id: insertedId,
      }),
      {
        status: 201,
      }
    );
  } catch (err) {
    console.error(err);

    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

export async function PUT(req) {
  const params = await req.json();

  try {
    const result = await prisma.jobs.update({
      where: { id: params.id },
      data: {
        salary: Number(params.salary),
        experience: params.experience,
        location: params.location,
        job_type: params.job_type,
        title: params.title,
        contact: params.contact,
        description: params.description,
        company: params.company,
        more_description: params.more_description,
        user_id: params.user_id,
        valid_through: params.valid_through,
      },
    });

    // successful put
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    console.log(err);

    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

export async function DELETE(req) {
  const { id } = await req.json();

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
