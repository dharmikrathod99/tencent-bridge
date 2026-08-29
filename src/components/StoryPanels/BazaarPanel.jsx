import React from 'react';

export function BazaarPanel() {
  return (
    <section className="story-panel story-panel-bazaar" id="bazaar" aria-label="Old town details">
      <h2>The bazaar keeps Mostar close.</h2>
      <p>
        Stone lanes, mosque courtyards, copper stalls, and riverside coffee stay within a short walk of Stari Most.
      </p>
      <button className="note-button" id="routes" type="button">
        <span aria-hidden="true">↗</span>
        <span>Open old town notes</span>
      </button>
    </section>
  );
}
