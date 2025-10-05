// src/components/ConverterForm.jsx
import { CurrencySelect } from './CurrencySelect';
import { SwapButton } from './SwapButton';
import { LoadingSpinner } from './LoadingSpinner';

export function ConverterForm({
  amount,
  onAmountChange,
  fromCurrency,
  onFromCurrencyChange,
  toCurrency,
  onToCurrencyChange,
  currencies,
  loading,
  error,
  result,
  onSwap
}) {
  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Allow empty, numbers, and single decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      onAmountChange(value);
    }
  };

  return (
    <div className="converter-form">
      <div className="input-group">
        <label htmlFor="amount" className="input-label">
          Amount
        </label>
        <input
          id="amount"
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Enter amount"
          className="amount-input"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'error-message' : undefined}
        />
      </div>

      <div className="currency-selects-grid">
        <div className="currency-column">
          <CurrencySelect
            value={fromCurrency}
            onChange={onFromCurrencyChange}
            currencies={currencies}
            label="From"
            disabled={loading}
          />
          
          <CurrencySelect
            value={toCurrency}
            onChange={onToCurrencyChange}
            currencies={currencies}
            label="To"
            disabled={loading}
          />
        </div>
        
        <div className="swap-column">
          <SwapButton onClick={onSwap} disabled={loading} />
        </div>
      </div>

      {error && (
        <div id="error-message" className="error" role="alert">
          {error}
        </div>
      )}

      {loading && (
        <div className="result-box loading-box">
          <LoadingSpinner />
        </div>
      )}

      {!loading && result && !error && (
        <div className="result-box">
          <div className="result-main">
            <span className="result-amount">
              {result.amount.toFixed(2)}
            </span>
            <span className="result-currency">{result.currency}</span>
          </div>
          {result.rate !== 1 && (
            <div className="exchange-rate">
              1 {fromCurrency} = {result.rate.toFixed(4)} {toCurrency}
            </div>
          )}
        </div>
      )}
    </div>
  );
}