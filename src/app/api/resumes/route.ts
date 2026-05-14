import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";
import type { CreateResumePayload, ResumeRow } from "@/types/db";

// 强制动态渲染，避免被静态化
export const dynamic = "force-dynamic";

/**
 * GET /api/resumes
 * 列出所有简历（按更新时间倒序）
 */
export async function GET() {
  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ data: data as ResumeRow[] });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "未知错误" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/resumes
 * 创建一份新简历
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateResumePayload;
    if (!body?.content) {
      return NextResponse.json(
        { error: "content 字段必填" },
        { status: 400 }
      );
    }

    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("resumes")
      .insert({
        title: body.title ?? "未命名简历",
        template_id: body.template_id ?? "classic",
        content: body.content,
        settings: body.settings ?? {},
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data: data as ResumeRow }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "未知错误" },
      { status: 500 }
    );
  }
}