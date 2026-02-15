import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header__left">
        <span className="header__logo" aria-hidden="true" />
        <span className="header__title">Pomofocus</span>
      </div>
      <div className="header__actions">
        <button className="header__button" type="button">
          <span className="header__button-icon" aria-hidden="true">▦</span>
          Report
        </button>
        <button className="header__button" type="button">
          <span className="header__button-icon" aria-hidden="true">⚙</span>
          Setting
        </button>
        <button className="header__button" type="button">
          <span className="header__button-icon" aria-hidden="true">☺</span>
          Sign In
        </button>
        <button className="header__icon-button" type="button" aria-label="Menu">
          ⋮
        </button>
      </div>
    </header>
  )
}

export default Header
