import type {
  CreateResumePayload,
  ResumeRow,
  UpdateResumePayload,
} from "@/types/db";

interface ApiResult<T> {
  data?: T;
  error?: string;
}

async function request<T>(
  url: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  let body: ApiResult<T> | null = null;
  try {
    body = (await res.json()) as ApiResult<T>;
  } catch {
    // ignore parse error
  }

  if (!res.ok) {
    throw new Error(body?.error ?? `请求失败：${res.status}`);
  }
  if (!body || body.data === undefined) {
    throw new Error("响应数据为空");
  }
  return body.data;
}

export const resumeApi = {
  list: () => request<ResumeRow[]>("/api/resumes"),

  get: (id: string) => request<ResumeRow>(`/api/resumes/${id}`),

  create: (payload: CreateResumePayload) =>
    request<ResumeRow>("/api/resumes", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id: string, payload: UpdateResumePayload) =>
    request<ResumeRow>(`/api/resumes/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  remove: async (id: string) => {
    const res = await fetch(`/api/resumes/${id}`, {
      method: "DELETE",
      cache: "no-store",
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      throw new Error(body?.error ?? `删除失败：${res.status}`);
    }
  },
};