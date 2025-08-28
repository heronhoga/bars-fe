"use server";
import { EditProfileFormData } from "@/types/profileType";
import { cookies } from "next/headers";

export async function updateProfile(
  data: EditProfileFormData
): Promise<{ message: string }> {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/edit`;
  const token = (await cookies()).get("token")?.value;
  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "app-key": `${process.env.NEXT_PUBLIC_APP_KEY}`,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        "id": data.id,
        "region": data.region,
        "discord": data.discord
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to update beats: ${errorText}`);
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
