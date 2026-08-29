import React from 'react';

export function Header() {
  return (
    <header className="site-header" aria-label="Primary navigation">
      <a className="site-logo" href="#cinema">
        Bosnia and Herzegovina
      </a>
      <nav className="site-nav" aria-label="Main menu">
        <a href="#cinema">Intro</a>
        <a href="#bridge">Bridge</a>
        <a href="#bazaar">Bazaar</a>
        <a href="#routes">Routes</a>
      </nav>
      <button className="language-switcher" aria-label="Change language" type="button">
        <span>EN</span>
        <span aria-hidden="true">⌄</span>
      </button>
    </header>
  );
}
