import { LoginFormData } from "@/types/loginType";

export async function login(formData: LoginFormData): Promise<string> {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "app-key": `${process.env.NEXT_PUBLIC_APP_KEY}`,
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const errorResult = await res.json();
      throw new Error(errorResult.error || "Failed to login");
    }

    const result = await res.json();

    if (!result.message) {
      throw new Error("Invalid response format: message not found");
    }

    return result.token;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}
