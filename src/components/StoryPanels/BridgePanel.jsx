import React from 'react';

export function BridgePanel() {
  return (
    <section className="story-panel story-panel-bridge" id="bridge" aria-label="Old Bridge details">
      <h2>The bridge is the city's compass.</h2>
      <p>
        Stari Most links the banks of the Neretva and anchors a historic quarter shaped by Ottoman, Mediterranean, and
        European layers.
      </p>
      <dl className="facts">
        <div>
          <dt>1566</dt>
          <dd>Original bridge completed</dd>
        </div>
        <div>
          <dt>2005</dt>
          <dd>Old Bridge Area inscribed by UNESCO</dd>
        </div>
      </dl>
    </section>
  );
}
