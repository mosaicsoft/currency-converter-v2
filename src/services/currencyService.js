// src/services/currencyService.js
const API_BASE = "https://api.frankfurter.app";

export const fetchCurrencies = async () => {
  const response = await fetch(`${API_BASE}/currencies`);
  if (!response.ok) throw new Error("Failed to fetch currencies");
  return response.json();
};

export const fetchConversion = async (amount, from, to, signal) => {
  const response = await fetch(
    `${API_BASE}/latest?amount=${amount}&from=${from}&to=${to}`,
    { signal }
  );
  if (!response.ok) throw new Error("Conversion failed");
  return response.json();
};
