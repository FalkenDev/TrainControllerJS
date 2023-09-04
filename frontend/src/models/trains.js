export const train_api = {
  fetchDelayedTrains: async () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const response = await fetch(`${API_URL}/v1/trains/delayed`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Failed to fetch delayed trains");
    }
  },
};
