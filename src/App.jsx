// src/App.jsx
import { useCurrencyConverter } from './hooks/useCurrencyConverter';
import { ConverterForm } from './components/ConverterForm';
import { LoadingSpinner } from './components/LoadingSpinner';
import './App.css';

export default function App() {
  const {
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
    swapCurrencies
  } = useCurrencyConverter();

  if (loadingCurrencies) {
    return (
      <div className="container">
        <div className="panel loading-panel">
          <LoadingSpinner />
          <p>Loading currencies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="panel">
        <header className="header">
          <h1>Currency Converter</h1>
          <p className="subtitle">Real-time exchange rates</p>
        </header>

        <ConverterForm
          amount={amount}
          onAmountChange={setAmount}
          fromCurrency={fromCurrency}
          onFromCurrencyChange={setFromCurrency}
          toCurrency={toCurrency}
          onToCurrencyChange={setToCurrency}
          currencies={currencies}
          loading={loading}
          error={error}
          result={result}
          onSwap={swapCurrencies}
        />

        <footer className="footer">
          <p>Powered by Frankfurter API</p>
        </footer>
      </div>
    </div>
  );
}