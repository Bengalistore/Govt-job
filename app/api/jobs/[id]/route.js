import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Job from "@/models/Job";
import slugify from "slugify";
import { verifyAdminToken } from "@/lib/auth";

function isAdmin(req) {
  const token = req.cookies.get("admin_token")?.value;
  return token && verifyAdminToken(token);
}

export async function GET(_req, { params }) {
  await connectDB();
  const job = await Job.findById(params.id).lean();
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ job });
}

export async function PUT(req, { params }) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const body = await req.json();

  if (body.title) {
    body.slug = slugify(body.title, { lower: true, strict: true });
  }

  try {
    const job = await Job.findByIdAndUpdate(params.id, body, { new: true });
    if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ job });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  await Job.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
