"use server";
import { BeatByUser, BeatByUserResponse } from "@/types/beatType";
import { cookies } from "next/headers";

export async function getBeatByUser(page: number): Promise<BeatByUserResponse> {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/beatbyuser?page=${page}`;
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

    console.log(result.data)

    return result as BeatByUserResponse
  } catch (error) {
    console.error("Network or parsing error:", error);
    throw error;
  }
}
