"use server";
import { cookies } from "next/headers";
import { BeatFull } from "@/types/beatType";

export async function getAllBeats(pageNum: number): Promise<BeatFull[]> {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/beat?page=${pageNum}`;

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

    return result.data as BeatFull[];
  } catch (error) {
    console.error("Network or parsing error:", error);
    throw error;
  }
}
