import { useEffect, useMemo, useState } from "react"
import {
  campaigns,
  desks,
  divisions,
  partners,
  practices,
  talents,
} from "./data.js"

const chapters = [
  { id: "roster", label: "Roster" },
  { id: "practice", label: "Practice" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
]

function matches(talent, division) {
  if (division === "all") return true
  if (division === "new") return talent.face === "new"
  return talent.division === division
}

export default function App() {
  const [division, setDivision] = useState("all")
  const [selectedId, setSelectedId] = useState(talents[0].id)
  const [menuOpen, setMenuOpen] = useState(false)
  const [chapter, setChapter] = useState("roster")

  const visible = useMemo(
    () => talents.filter((talent) => matches(talent, division)),
    [division],
  )
  const selected =
    visible.find((talent) => talent.id === selectedId) ?? visible[0] ?? null
  const chapterLabel =
    chapters.find((item) => item.id === chapter)?.label ?? "Roster"

  useEffect(() => {
    const nodes = chapters
      .map((item) => document.getElementById(item.id))
      .filter(Boolean)
    if (nodes.length === 0) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (hit?.target.id) setChapter(hit.target.id)
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.15, 0.4] },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKey = (event) => {
      if (event.key === "Escape") setMenuOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [menuOpen])

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <>
      <a className="skip" href="#roster">
        Skip to roster
      </a>
      <header className="site-header">
        <div className="wrap header-bar">
          <a className="wordmark" href="#top" onClick={closeMenu}>
            Halden
          </a>
          <p className="chapter">Now · {chapterLabel}</p>
          <nav
            id="site-nav"
            className={menuOpen ? "nav is-open" : "nav"}
            aria-label="Sections"
          >
            {chapters.map((item) => (
              <a key={item.id} href={`#${item.id}`} onClick={closeMenu}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <a className="book" href="#contact" onClick={closeMenu}>
              Book
            </a>
            <button
              type="button"
              className="menu-button"
              aria-expanded={menuOpen}
              aria-controls="site-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="masthead wrap" aria-labelledby="hero-title">
          <div>
            <p className="kicker">Model management · Copenhagen</p>
            <h1 id="hero-title">
              A short roster, <em>held closely.</em>
            </h1>
          </div>
          <div>
            <p className="lede">
              Halden represents models for fashion, beauty, and moving image.
              The list stays small so casting can stay specific.
            </p>
            <dl className="facts">
              <div>
                <dt>Roster</dt>
                <dd>{talents.length}</dd>
              </div>
              <div>
                <dt>Founded</dt>
                <dd>2014</dd>
              </div>
              <div>
                <dt>Desks</dt>
                <dd>{desks.length} cities</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="section wrap" id="roster" aria-labelledby="roster-title">
          <div className="section-head">
            <h2 id="roster-title">Roster</h2>
            <p>
              {visible.length} {visible.length === 1 ? "person" : "people"} on
              this list.
            </p>
          </div>
          <div className="filters" role="group" aria-label="Filter the roster">
            {divisions.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={division === item.id}
                onClick={() => setDivision(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="roster-layout">
            <div className="talent-list">
              {visible.map((talent, index) => {
                const active = talent.id === selected?.id
                return (
                  <button
                    key={talent.id}
                    type="button"
                    className={active ? "talent-row is-active" : "talent-row"}
                    aria-current={active ? "true" : undefined}
                    onClick={() => setSelectedId(talent.id)}
                  >
                    <span className="index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="talent-name">
                      {talent.name}
                      {talent.face === "new" ? (
                        <span className="badge">New</span>
                      ) : null}
                    </span>
                    <span className="talent-city">{talent.city}</span>
                  </button>
                )
              })}
            </div>
            {selected ? <Portrait talent={selected} /> : null}
          </div>
        </section>

        <section className="section wrap" id="practice" aria-labelledby="practice-title">
          <div className="section-head">
            <h2 id="practice-title">Practice</h2>
            <p>How the desk works with talent and with clients.</p>
          </div>
          <div className="practice-grid">
            {practices.map((item) => (
              <article key={item.index}>
                <p className="index">{item.index}</p>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section wrap" id="work" aria-labelledby="work-title">
          <div className="section-head">
            <h2 id="work-title">Selected work</h2>
            <p>Two recent jobs from the roster.</p>
          </div>
          <div className="work-grid">
            {campaigns.map((item) => (
              <article key={item.id} className="campaign">
                <img src={item.image} alt={`${item.title} campaign photograph`} />
                <p className="kicker">{item.kicker}</p>
                <h3>{item.title}</h3>
                <p className="campaign-talent">With {item.talent}</p>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
          <h3 className="label partners-label">Houses we have sat for</h3>
          <ul className="partners">
            {partners.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </section>

        <section className="section wrap" id="contact" aria-labelledby="contact-title">
          <div className="contact-layout">
            <div>
              <h2 id="contact-title">Book a talent</h2>
              <p className="lede">
                Send the date, the city, and the kind of face you need. The
                Copenhagen desk reads every note.
              </p>
              <ul className="desk-list">
                {desks.map((desk) => (
                  <li key={desk.city}>
                    <strong>{desk.city}</strong>
                    <span>{desk.detail}</span>
                  </li>
                ))}
              </ul>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap footer-grid">
          <div>
            <p className="wordmark">Halden</p>
            <p>Independent model management. Founded 2014.</p>
          </div>
          <div>
            <h2 className="label">Desks</h2>
            <ul>
              {desks.map((desk) => (
                <li key={desk.city}>{desk.city}</li>
              ))}
            </ul>
          </div>
          <nav aria-label="Footer">
            <h2 className="label">Index</h2>
            <ul>
              {chapters.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="wrap fineprint">
          Demonstration roster. Portraits and campaign pictures are stock
          photographs, not signed talent.
        </p>
      </footer>
    </>
  )
}

function Portrait({ talent }) {
  return (
    <figure className="portrait" id="portrait">
      <img
        src={talent.image}
        alt={`Portrait of ${talent.name}`}
        width="900"
        height="1200"
      />
      <figcaption>
        <p className="portrait-name">{talent.name}</p>
        <p>
          {talent.height} · {talent.city}
        </p>
        <p>{talent.note}</p>
      </figcaption>
    </figure>
  )
}

function ContactForm() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    company: "",
    brief: "",
  })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  function update(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  function validate(next) {
    const nextErrors = {}
    if (!next.name.trim()) nextErrors.name = "Add your name."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next.email.trim())) {
      nextErrors.email = "Add a valid email."
    }
    if (next.brief.trim().length < 8) {
      nextErrors.brief = "Tell us the job in a sentence or two."
    }
    return nextErrors
  }

  function onSubmit(event) {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) setSent(true)
  }

  if (sent) {
    return (
      <div className="form-status" role="status">
        <p className="portrait-name">Note kept on this page.</p>
        <p>
          Nothing was sent to a server. This desk is a demonstration, so the
          form only confirms what you wrote.
        </p>
        <button
          type="button"
          className="book reset"
          onClick={() => {
            setSent(false)
            setValues({ name: "", email: "", company: "", brief: "" })
          }}
        >
          Write another note
        </button>
      </div>
    )
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      <Field
        label="Name"
        name="name"
        value={values.name}
        error={errors.name}
        onChange={update}
        autoComplete="name"
      />
      <Field
        label="Email"
        name="email"
        type="email"
        value={values.email}
        error={errors.email}
        onChange={update}
        autoComplete="email"
      />
      <Field
        label="Company"
        name="company"
        value={values.company}
        onChange={update}
        autoComplete="organization"
      />
      <Field
        label="Brief"
        name="brief"
        value={values.brief}
        error={errors.brief}
        onChange={update}
        multiline
      />
      <button type="submit" className="submit">
        Send note
      </button>
    </form>
  )
}

function Field({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  multiline = false,
}) {
  const errorId = error ? `${name}-error` : undefined
  const shared = {
    id: name,
    name,
    value,
    onChange,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": errorId,
    autoComplete,
    required: name !== "company",
  }

  return (
    <label className="field" htmlFor={name}>
      <span>
        {label}
        {name !== "company" ? " *" : ""}
      </span>
      {multiline ? (
        <textarea {...shared} rows={4} />
      ) : (
        <input {...shared} type={type} />
      )}
      {error ? (
        <span className="field-error" id={errorId}>
          {error}
        </span>
      ) : null}
    </label>
  )
}
