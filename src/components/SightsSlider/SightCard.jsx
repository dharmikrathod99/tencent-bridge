import React from 'react';

export function SightCard({ sight, index, isActive, onSelect }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(index);
    }
  };

  return (
    <article
      className={`sight-card ${isActive ? 'is-active' : ''}`}
      tabIndex={0}
      role="button"
      aria-label={sight.ariaLabel}
      data-sight-index={index}
      onClick={() => onSelect(index)}
      onKeyDown={handleKeyDown}
    >
      <span className="sight-kicker">{sight.kicker}</span>
      <img className="sight-pin" src={sight.pin} alt="" />
      <h3>{sight.title}</h3>
      <p>{sight.description}</p>
    </article>
  );
}
