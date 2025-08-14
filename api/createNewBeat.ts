"use server";
import { cookies } from "next/headers";

export async function createNewBeat(
  formData: FormData
): Promise<{ message: string }> {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/beat`;
  const token = (await cookies()).get("token")?.value;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "app-key": `${process.env.NEXT_PUBLIC_APP_KEY}`,
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorResult = await res.json();
      throw new Error(errorResult.error || "Failed to register");
    }

    const result = await res.json();

    if (!result.message) {
      throw new Error("Invalid response format: message not found");
    }

    return result;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}
