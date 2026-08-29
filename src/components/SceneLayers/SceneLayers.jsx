import React from 'react';
import { SCENE_ASSETS } from '../../constants/assets';
import { Header } from '../Header/Header';
import { SightsSlider } from '../SightsSlider/SightsSlider';

export function SceneLayers({
  sightsControlsRef,
  trackRef,
  activeSight,
  onSelectCard,
  onTransitionEnd,
  onMovePrev,
  onMoveNext
}) {
  return (
    <div className="world">
      {/* Sky Background */}
      <img className="scene-img sky-img" src={SCENE_ASSETS.sky} alt="" />

      {/* Header */}
      <Header />

      {/* Back Stack */}
      <div className="back-stack">
        <img className="scene-img back-img back-four" src={SCENE_ASSETS.backFour} alt="" />
        <SightsSlider
          trackRef={trackRef}
          activeSight={activeSight}
          onSelectCard={onSelectCard}
          onTransitionEnd={onTransitionEnd}
        />
        <img className="scene-img back-img back-bazaar" src={SCENE_ASSETS.bazaar} alt="" />
      </div>

      {/* Sights Controls */}
      <div ref={sightsControlsRef} className="sights-controls" aria-label="Slider controls">
        <button className="sight-nav sight-prev" aria-label="Previous sight" type="button" onClick={onMovePrev}>
          ←
        </button>
        <button className="sight-nav sight-next" aria-label="Next sight" type="button" onClick={onMoveNext}>
          →
        </button>
      </div>

      {/* Hero Title */}
      <h1 className="hero-title">Tencent-Bridge</h1>

      {/* Splitframe Layers */}
      <img className="scene-img splitframe-img splitframe-left" src={SCENE_ASSETS.splitframeLeft} alt="" />
      <img className="scene-img splitframe-img splitframe-right" src={SCENE_ASSETS.splitframeRight} alt="" />

      {/* Bridge Foreground Layer */}
      <img className="scene-img bridge-img" src={SCENE_ASSETS.bridge} alt="" />

      {/* Frame Two River Layer */}
      <img className="scene-img frame-two-img" src={SCENE_ASSETS.frameTwo} alt="" />

      {/* Gradient Shade */}
      <div className="shade" />
    </div>
  );
}
