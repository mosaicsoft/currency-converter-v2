// src/hooks/useCurrencyConverter.js
import { useState, useEffect, useCallback, useRef } from "react";
import { fetchCurrencies, fetchConversion } from "../services/currencyService";

export function useCurrencyConverter() {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [currencies, setCurrencies] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);

  const abortControllerRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Load currencies on mount
  useEffect(() => {
    fetchCurrencies()
      .then(setCurrencies)
      .catch(() => setError("Failed to load currencies"))
      .finally(() => setLoadingCurrencies(false));
  }, []);

  // Debounced conversion
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Reset states
    setResult(null);
    setError("");

    // Validate input
    if (!amount || amount.trim() === "") return;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid positive number");
      return;
    }

    if (!fromCurrency || !toCurrency) {
      setError("Please select both currencies");
      return;
    }

    if (fromCurrency === toCurrency) {
      setResult({ amount: numAmount, currency: toCurrency, rate: 1 });
      return;
    }

    // Debounce API call
    debounceTimerRef.current = setTimeout(() => {
      setLoading(true);
      abortControllerRef.current = new AbortController();

      fetchConversion(
        numAmount,
        fromCurrency,
        toCurrency,
        abortControllerRef.current.signal
      )
        .then((data) => {
          const convertedAmount = data.rates[toCurrency];
          const rate = convertedAmount / numAmount;
          setResult({
            amount: convertedAmount,
            currency: toCurrency,
            rate: rate,
          });
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            setError("Conversion failed. Please try again.");
          }
        })
        .finally(() => setLoading(false));
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [amount, fromCurrency, toCurrency]);

  const swapCurrencies = useCallback(() => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }, [fromCurrency, toCurrency]);

  return {
    amount,
    setAmount,
    fromCurrency,
    setFromCurrency,
    toCurrency,
    setToCurrency,
    currencies,
    result,
    loading,
    error,
    loadingCurrencies,
    swapCurrencies,
  };
}
