// src/components/CurrencySelect.jsx
import { useState, useRef, useEffect } from 'react';

export function CurrencySelect({ value, onChange, currencies, label, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const currencyEntries = Object.entries(currencies);
  
  // Filter currencies based on search term
  const filteredCurrencies = currencyEntries.filter(([code, name]) => {
    const search = searchTerm.toLowerCase();
    return code.toLowerCase().includes(search) || name.toLowerCase().includes(search);
  });

  // Get display text for selected currency
  const displayText = currencies[value] ? `${value} - ${currencies[value]}` : value;

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset highlighted index when search changes
  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchTerm]);

  const handleSelect = (code) => {
    onChange(code);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => 
          prev < filteredCurrencies.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCurrencies[highlightedIndex]) {
          handleSelect(filteredCurrencies[highlightedIndex][0]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchTerm('');
        break;
    }
  };

  return (
    <div className="currency-select-wrapper" ref={dropdownRef}>
      <label htmlFor={`currency-${label}`} className="currency-label">
        {label}
      </label>
      
      <div className="custom-select">
        <button
          type="button"
          className={`select-trigger ${isOpen ? 'open' : ''}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={label}
        >
          <span className="select-value">{displayText}</span>
          <svg 
            className={`select-arrow ${isOpen ? 'open' : ''}`}
            width="12" 
            height="8" 
            viewBox="0 0 12 8" 
            fill="none"
          >
            <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {isOpen && (
          <div className="select-dropdown">
            <div className="search-box">
              <input
                ref={inputRef}
                type="text"
                className="search-input"
                placeholder="Search currency..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            
            <ul className="options-list" role="listbox">
              {filteredCurrencies.length > 0 ? (
                filteredCurrencies.map(([code, name], index) => (
                  <li
                    key={code}
                    className={`option-item ${code === value ? 'selected' : ''} ${
                      index === highlightedIndex ? 'highlighted' : ''
                    }`}
                    onClick={() => handleSelect(code)}
                    role="option"
                    aria-selected={code === value}
                  >
                    <span className="option-code">{code}</span>
                    <span className="option-name">{name}</span>
                  </li>
                ))
              ) : (
                <li className="option-item no-results">No currencies found</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}