import React, { useRef } from 'react';
import { SceneLayers } from './components/SceneLayers/SceneLayers';
import { IntroCopy } from './components/StoryPanels/IntroCopy';
import { BridgePanel } from './components/StoryPanels/BridgePanel';
import { BazaarPanel } from './components/StoryPanels/BazaarPanel';
import { useCinematicScroll } from './hooks/useCinematicScroll';
import { useInfiniteSlider } from './hooks/useInfiniteSlider';
import { SIGHTS_DATA } from './constants/sightsData';

export default function App() {
  const sectionRef = useRef(null);
  const sightsControlsRef = useRef(null);
  const trackRef = useRef(null);

  const {
    activeSight,
    moveSightSlider,
    selectSightCard,
    normalizeSightSlider,
    updateShift
  } = useInfiniteSlider(trackRef, SIGHTS_DATA.length);

  useCinematicScroll(sectionRef, sightsControlsRef, updateShift);

  return (
    <main className="site-shell">
      <section
        ref={sectionRef}
        className="cinema-scroll"
        id="cinema"
        aria-label="Mostar cinematic scroll story"
      >
        <div className="stage">
          <SceneLayers
            sightsControlsRef={sightsControlsRef}
            trackRef={trackRef}
            activeSight={activeSight}
            onSelectCard={selectSightCard}
            onTransitionEnd={normalizeSightSlider}
            onMovePrev={() => moveSightSlider(-1)}
            onMoveNext={() => moveSightSlider(1)}
          />

          <IntroCopy />
          <BridgePanel />
          <BazaarPanel />
        </div>
      </section>
    </main>
  );
}
