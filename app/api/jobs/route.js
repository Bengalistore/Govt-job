import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Job from "@/models/Job";
import slugify from "slugify";
import { verifyAdminToken } from "@/lib/auth";

function isAdmin(req) {
  const token = req.cookies.get("admin_token")?.value;
  return token && verifyAdminToken(token);
}

// GET /api/jobs?category=&state=&district=&jobType=&education=&q=&expiringSoon=true&limit=&page=
export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);

  const filter = { status: "published" };

  const category = searchParams.get("category");
  const state = searchParams.get("state");
  const district = searchParams.get("district");
  const jobType = searchParams.get("jobType");
  const education = searchParams.get("education");
  const q = searchParams.get("q");
  const expiringSoon = searchParams.get("expiringSoon");
  const limit = parseInt(searchParams.get("limit") || "24", 10);
  const page = parseInt(searchParams.get("page") || "1", 10);

  if (category) filter.category = category;
  if (state) filter.state = state;
  if (district) filter.district = district;
  if (jobType) filter.jobType = jobType;
  if (education) filter.educationRequired = { $regex: education, $options: "i" };

  if (expiringSoon === "true") {
    const now = new Date();
    const in7days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    filter.lastDate = { $gte: now, $lte: in7days };
  }

  if (q) {
    filter.$text = { $search: q };
  }

  const total = await Job.countDocuments(filter);
  const jobs = await Job.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return NextResponse.json({ jobs, total, page, limit });
}

// POST /api/jobs  (admin only)
export async function POST(req) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const body = await req.json();

  if (!body.slug && body.title) {
    body.slug = slugify(body.title, { lower: true, strict: true });
  }

  try {
    const job = await Job.create(body);
    return NextResponse.json({ job }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
