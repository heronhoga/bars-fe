"use server";
import { cookies } from "next/headers";

export async function deleteBeat(id: string): Promise<{ message: string }> {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/beat`;
  const token = (await cookies()).get("token")?.value;
  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "app-key": `${process.env.NEXT_PUBLIC_APP_KEY}`,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        beat_id: id,
      }),
    });

    if (!res.ok) {
      console.error(`Error response: ${res.status} - ${res.statusText}`);
      throw new Error("Failed to fetch beats");
    }

    const result = await res.json();

    if (!result.message) {
      throw new Error("Invalid response format: message not found");
    }

    return result;
  } catch (error) {
    console.error("Network or parsing error:", error);
    throw error;
  }
}
