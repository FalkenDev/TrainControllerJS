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

  fetchCodes: async () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const response = await fetch(`${API_URL}/v1/trains/codes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Failed to fetch codes");
    }
  },

  fetchAllTickets: async () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const response = await fetch(`${API_URL}/v1/trains/tickets/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Failed to fetch tickets");
    }
  },

  fetchSpecificTickets: async (trainNr) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const response = await fetch(`${API_URL}/v1/trains/tickets/${trainNr}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Failed to fetch tickets");
    }
  },

  createTicket: async (trainNr, code) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const response = await fetch(`${API_URL}/v1/trains/tickets/${trainNr}`, {
      method: "POST",
      body: {
        code: code,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Failed to fetch tickets");
    }
  },
};
