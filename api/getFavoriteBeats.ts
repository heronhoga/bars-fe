import { Beat } from "@/types/beatType";

export async function getFavoriteBeats(): Promise<Beat[]> {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/favoritebeats`;

  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'app-key': `${process.env.NEXT_PUBLIC_APP_KEY}`,
      },
    });

    if (!res.ok) {
      console.error(`Error response: ${res.status} - ${res.statusText}`);
      throw new Error('Failed to fetch beats');
    }

    const result = await res.json();

    if (!Array.isArray(result.data)) {
      throw new Error('Invalid response format');
    }

    return result.data as Beat[];
  } catch (error) {
    console.error("Network or parsing error:", error);
    throw error;
  }
}

