import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";
import type { ResumeRow, UpdateResumePayload } from "@/types/db";

export const dynamic = "force-dynamic";

interface Params {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/resumes/[id]
 */
export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "简历不存在" }, { status: 404 });
      }
      throw error;
    }
    return NextResponse.json({ data: data as ResumeRow });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "未知错误" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/resumes/[id]
 */
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = (await request.json()) as UpdateResumePayload;

    const updateData: Record<string, unknown> = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.template_id !== undefined) updateData.template_id = body.template_id;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.settings !== undefined) updateData.settings = body.settings;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "没有可更新的字段" }, { status: 400 });
    }

    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("resumes")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data: data as ResumeRow });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "未知错误" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/resumes/[id]
 */
export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = getServerSupabase();
    const { error } = await supabase.from("resumes").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "未知错误" },
      { status: 500 }
    );
  }
}