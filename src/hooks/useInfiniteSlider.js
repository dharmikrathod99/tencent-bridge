import { useState, useRef, useEffect, useCallback } from 'react';

export function useInfiniteSlider(trackRef, originalCount) {
  const [activeSight, setActiveSight] = useState(originalCount);
  const activeSightRef = useRef(originalCount);
  activeSightRef.current = activeSight;

  const updateShift = useCallback((index) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = track.querySelectorAll('.sight-card');
    if (cards.length === 0) return;
    const cardWidth = cards[0].offsetWidth;
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '0');
    document.documentElement.style.setProperty('--sights-shift', `${-(cardWidth + gap) * index}px`);
  }, [trackRef]);

  const jumpSightSlider = useCallback((targetIndex) => {
    const track = trackRef.current;
    if (!track) return;
    track.classList.add('is-jumping');
    activeSightRef.current = targetIndex;
    setActiveSight(targetIndex);
    updateShift(targetIndex);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (track) {
          track.classList.remove('is-jumping');
        }
      });
    });
  }, [trackRef, updateShift]);

  const normalizeSightSlider = useCallback(() => {
    const current = activeSightRef.current;
    if (current >= originalCount * 2) {
      jumpSightSlider(current - originalCount);
    } else if (current < originalCount) {
      jumpSightSlider(current + originalCount);
    }
  }, [originalCount, jumpSightSlider]);

  const moveSightSlider = useCallback((direction) => {
    const next = activeSightRef.current + direction;
    activeSightRef.current = next;
    setActiveSight(next);
    updateShift(next);
  }, [updateShift]);

  const selectSightCard = useCallback((index) => {
    activeSightRef.current = index;
    setActiveSight(index);
    updateShift(index);
  }, [updateShift]);

  useEffect(() => {
    updateShift(activeSight);
  }, [activeSight, updateShift]);

  return {
    activeSight,
    moveSightSlider,
    selectSightCard,
    normalizeSightSlider,
    updateShift: () => updateShift(activeSightRef.current)
  };
}
