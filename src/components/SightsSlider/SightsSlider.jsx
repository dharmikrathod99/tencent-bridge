import React, { useMemo } from 'react';
import { SightCard } from './SightCard';
import { SIGHTS_DATA } from '../../constants/sightsData';

export function SightsSlider({ trackRef, activeSight, onSelectCard, onTransitionEnd }) {
  // Generate 3 identical sets for infinite loop (15 cards)
  const tripleCards = useMemo(() => {
    const sets = [];
    for (let setIdx = 0; setIdx < 3; setIdx++) {
      SIGHTS_DATA.forEach((sight, itemIdx) => {
        const globalIndex = setIdx * SIGHTS_DATA.length + itemIdx;
        sets.push({
          sight,
          globalIndex
        });
      });
    }
    return sets;
  }, []);

  return (
    <section className="sights-slider" aria-label="Mostar sights slider">
      <div
        ref={trackRef}
        className="sights-track"
        onTransitionEnd={onTransitionEnd}
      >
        {tripleCards.map(({ sight, globalIndex }) => (
          <SightCard
            key={`${sight.id}-${globalIndex}`}
            sight={sight}
            index={globalIndex}
            isActive={globalIndex === activeSight}
            onSelect={onSelectCard}
          />
        ))}
      </div>
    </section>
  );
}
