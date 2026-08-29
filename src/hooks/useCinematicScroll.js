import { useEffect, useRef } from 'react';

const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const smoothstep = (e0, e1, v) => {
  const x = clamp((v - e0) / (e1 - e0));
  return x * x * (3 - 2 * x);
};
const lerp = (a, b, t) => a + (b - a) * t;
const segmentInOut = (s, a, b, c, d) => {
  const enter = smoothstep(a, b, s);
  const exit = smoothstep(c, d, s);
  return { enter, exit, active: enter * (1 - exit) };
};

export function useCinematicScroll(sectionRef, sightsControlsRef, onResize) {
  const stateRef = useRef({
    targetMouseX: 0,
    targetMouseY: 0,
    mouseX: 0,
    mouseY: 0,
    targetScroll: 0,
    smoothScroll: 0,
    initialized: false,
    rafPending: false
  });

  useEffect(() => {
    const root = document.documentElement;
    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const getScrollDistance = () => {
      if (!section) return 0;
      return clamp(-section.getBoundingClientRect().top, 0, section.offsetHeight - window.innerHeight);
    };

    function update() {
      const state = stateRef.current;
      state.rafPending = false;
      state.targetScroll = getScrollDistance();

      if (!state.initialized || reduceMotion.matches) {
        state.smoothScroll = state.targetScroll;
        state.initialized = true;
      } else {
        state.smoothScroll = lerp(state.smoothScroll, state.targetScroll, 0.14);
      }
      if (Math.abs(state.smoothScroll - state.targetScroll) < 0.08) {
        state.smoothScroll = state.targetScroll;
      }

      if (reduceMotion.matches) {
        state.mouseX = 0;
        state.mouseY = 0;
      } else {
        state.mouseX = lerp(state.mouseX, state.targetMouseX, 0.12);
        state.mouseY = lerp(state.mouseY, state.targetMouseY, 0.12);
      }

      const { smoothScroll, mouseX, mouseY } = state;

      const frame2 = segmentInOut(smoothScroll, 560, 900, 1300, 1620);
      const frame3 = segmentInOut(smoothScroll, 1760, 2140, 2540, 2700);
      const progress = clamp(smoothScroll / 2700);
      const introExit = smoothstep(90, 650, smoothScroll);
      const sightsEnterRaw = smoothstep(2760, 3560, smoothScroll);
      const sightsEnter = Math.pow(sightsEnterRaw, 1.55);
      const sightsControlsEnter = smoothstep(3360, 3660, smoothScroll);
      const blurActive = clamp(frame2.active + frame3.active);
      const frame2Opacity = frame2.active * (1 - frame3.enter);
      const splitDrift = Math.pow(frame2.enter, 1.5);
      const panel2Opacity = frame2.active * (1 - frame2.exit);
      const panel3Opacity = frame3.active * (1 - frame3.exit);
      const backScale = 0.76 + progress * 0.2 + frame2.enter * 0.18 + frame3.enter * 0.16;
      const sharedHeroY = progress * -74;
      const sharedHeroScale = progress * 0.23;
      const sightsScreenTop = Math.min(220, Math.max(112, window.innerHeight * 0.19)) - 50;
      const sightsParentTop = window.innerHeight - (window.innerHeight - sightsScreenTop) / backScale;

      root.style.setProperty('--mx', (reduceMotion.matches ? 0 : mouseX).toFixed(4));
      root.style.setProperty('--my', (reduceMotion.matches ? 0 : mouseY).toFixed(4));

      root.style.setProperty('--back-opacity', (1 - frame2.active * 0.06).toString());
      root.style.setProperty('--back-x', `${mouseX * -12}px`);
      root.style.setProperty('--back-y', `${mouseY * -4}px`);
      root.style.setProperty('--back-scale', backScale.toString());
      root.style.setProperty('--four-y', `${10 + progress * 10}vh`);
      root.style.setProperty('--four-scale', (0.78 + progress * 0.16).toString());
      root.style.setProperty('--bazaar-y', `${20 - progress * 8}vh`);
      root.style.setProperty('--blur-px', `${blurActive * 14}px`);
      root.style.setProperty('--back-brightness', (1 - blurActive * 0.255).toString());
      root.style.setProperty('--bazaar-blur-px', `${frame2.active * 14}px`);
      root.style.setProperty('--bazaar-brightness', (1 - frame2.active * 0.255 - frame3.active * 0.06).toString());
      root.style.setProperty('--bazaar-saturation', (1 + frame3.active * 0.18).toString());
      root.style.setProperty('--shade-opacity', '1');
      root.style.setProperty('--shade-z', frame2.active > 0.02 ? '2' : '0');
      root.style.setProperty('--shade-top-alpha', (blurActive * 0.465).toString());
      root.style.setProperty('--shade-mid-alpha', (blurActive * 0.42).toString());
      root.style.setProperty('--shade-bottom-alpha', (blurActive * 0.51).toString());

      root.style.setProperty('--title-y', `${introExit * -210}px`);
      root.style.setProperty('--title-scale', (1 - introExit * 0.08).toString());
      root.style.setProperty('--title-opacity', (1 - introExit).toString());

      root.style.setProperty('--bridge-x', `calc(-50% + ${mouseX * 18}px)`);
      root.style.setProperty('--bridge-y', `${mouseY * 8 + sharedHeroY - frame2.exit * 760}px`);
      root.style.setProperty('--bridge-bottom', `${5 - frame2.enter * 13}vh`);
      root.style.setProperty('--bridge-width', `${67.2 + frame2.enter * 37.8}vw`);
      root.style.setProperty('--bridge-scale', (1.02 + sharedHeroScale + frame2.exit * 0.46).toString());

      root.style.setProperty('--split-left-x', `calc(-50% + ${-splitDrift * 46}vw + ${mouseX * 22}px)`);
      root.style.setProperty('--split-left-y', `${mouseY * 10 + sharedHeroY - splitDrift * 180}px`);
      root.style.setProperty('--split-left-scale', (1 + sharedHeroScale + frame2.enter * 0.74).toString());
      root.style.setProperty('--split-right-x', `calc(-50% + ${splitDrift * 46}vw + ${mouseX * 22}px)`);
      root.style.setProperty('--split-right-y', `${mouseY * 10 + sharedHeroY - splitDrift * 180}px`);
      root.style.setProperty('--split-right-scale', (1 + sharedHeroScale + frame2.enter * 0.74).toString());

      root.style.setProperty('--frame2-opacity', frame2Opacity.toString());
      root.style.setProperty('--frame2-x', `calc(-50% + ${mouseX * 10}px)`);
      root.style.setProperty('--frame2-y', `calc(-50% + ${mouseY * 8 - frame2.exit * 150}px)`);
      root.style.setProperty('--frame2-scale', (1.06 + frame2.enter * 0.08 + frame2.exit * 0.08).toString());

      root.style.setProperty('--intro-copy-y', `${introExit * 90}px`);
      root.style.setProperty('--intro-copy-opacity', (1 - introExit).toString());
      root.style.setProperty('--panel2-opacity', panel2Opacity.toString());
      root.style.setProperty('--panel2-y', `calc(-50% + ${-frame2.exit * 86 + (1 - frame2.enter) * 58}px)`);
      root.style.setProperty('--panel3-opacity', panel3Opacity.toString());
      root.style.setProperty('--panel3-y', `calc(-50% + ${-frame3.exit * 86 + (1 - frame3.enter) * 58}px)`);

      root.style.setProperty('--sights-opacity', sightsEnter.toString());
      root.style.setProperty('--sights-controls-opacity', sightsControlsEnter.toString());
      if (sightsControlsRef.current) {
        sightsControlsRef.current.classList.toggle('is-ready', sightsControlsEnter > 0.98);
      }
      root.style.setProperty('--sights-visibility', sightsEnter > 0.01 ? 'visible' : 'hidden');
      root.style.setProperty('--sights-y', '0px');
      root.style.setProperty('--sights-enter-x', `${(1 - sightsEnter) * 420}vw`);
      root.style.setProperty('--sights-scale', (1 / backScale).toString());
      root.style.setProperty('--sights-top', `${sightsParentTop}px`);
      root.style.setProperty('--sights-screen-top', `${sightsScreenTop}px`);

      const needsScrollUpdate = Math.abs(smoothScroll - state.targetScroll) > 0.08;
      const needsMouseUpdate =
        !reduceMotion.matches &&
        (Math.abs(mouseX - state.targetMouseX) > 0.001 || Math.abs(mouseY - state.targetMouseY) > 0.001);

      if (needsScrollUpdate || needsMouseUpdate) {
        requestTick();
      }
    }

    function requestTick() {
      if (!stateRef.current.rafPending) {
        stateRef.current.rafPending = true;
        requestAnimationFrame(update);
      }
    }

    const handleScroll = () => requestTick();
    const handleResize = () => {
      if (onResize) onResize();
      requestTick();
    };
    const handlePointerMove = (e) => {
      stateRef.current.targetMouseX = e.clientX / window.innerWidth - 0.5;
      stateRef.current.targetMouseY = e.clientY / window.innerHeight - 0.5;
      requestTick();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    requestTick();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [sectionRef, sightsControlsRef, onResize]);
}
