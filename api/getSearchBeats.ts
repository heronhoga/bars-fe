"use server";
import { cookies } from "next/headers";
import { BeatSearch } from "@/types/beatType";

export async function getSearchBeats(
  query: string,
  pageNum: number
): Promise<BeatSearch> {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/beat?page=${pageNum}&title=${query}&artist=${query}`;

  console.log("query in function: ", query);
  const token = (await cookies()).get("token")?.value;
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "app-key": `${process.env.NEXT_PUBLIC_APP_KEY}`,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error(`Error response: ${res.status} - ${res.statusText}`);
      throw new Error("Failed to fetch beats");
    }

    const result = await res.json();

    if (!Array.isArray(result.data)) {
      throw new Error("Invalid response format");
    }

    return result;
  } catch (error) {
    console.error("Network or parsing error:", error);
    throw error;
  }
}
