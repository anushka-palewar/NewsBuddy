import "./Portfolio.css";

const Portfolio = () => {
  return (
    <div className="portfolio">

      {/* HERO */}
      <section className="p-hero">
        <h1>NewsApplication</h1>
        <p>
          A full-stack news platform designed for kids, adults, and students —
          delivering daily news, weekly summaries, and live TV in one place.
        </p>
        <span className="tag">Full Stack Project</span>
      </section>

      {/* ABOUT */}
      <section className="p-section">
        <h2>📌 About the Project</h2>
        <p>
          NewsApplication is a modern news platform built to solve the problem of
          information overload and unsafe content. It separates news for kids
          and adults, provides exam-focused summaries, and allows admins to
          control content sources.
        </p>
      </section>

      {/* PROBLEM */}
      <section className="p-section light">
        <h2>❓ Problem Statement</h2>
        <ul>
          <li>Kids exposed to unsafe or complex news</li>
          <li>No single platform for daily + weekly current affairs</li>
          <li>Lack of exam-oriented news presentation</li>
          <li>Uncontrolled or fake news sources</li>
        </ul>
      </section>

      {/* SOLUTION */}
      <section className="p-section">
        <h2>✅ Solution</h2>
        <p>
          NewsApplication provides a clean, curated, and age-based news
          experience with admin-controlled sources, making news safe,
          educational, and reliable.
        </p>
      </section>

      {/* FEATURES */}
      <section className="p-section light">
        <h2>✨ Key Features</h2>

        <div className="features-grid">
          <div className="f-card">🧒 Kids-friendly news</div>
          <div className="f-card">📰 Adult daily news</div>
          <div className="f-card">📅 Weekly summaries</div>
          <div className="f-card">📺 Live YouTube news</div>
          <div className="f-card">🗞 Newspaper directory</div>
          <div className="f-card">🔐 Admin management</div>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="p-section">
        <h2>🛠 Tech Stack</h2>

        <div className="tech">
          <span>Java</span>
          <span>Spring Boot</span>
          <span>Spring MVC</span>
          <span>MySQL</span>
          <span>React</span>
          <span>REST APIs</span>
        </div>
      </section>

      {/* ADMIN */}
      <section className="p-section light">
        <h2>🧑‍💼 Admin Panel</h2>
        <ul>
          <li>Add / remove newspapers</li>
          <li>Manage live TV channels</li>
          <li>Enable / disable sources</li>
          <li>Password-based admin login</li>
        </ul>
      </section>

      {/* FUTURE */}
      <section className="p-section">
        <h2>🚀 Future Enhancements</h2>
        <ul>
          <li>User login & personalization</li>
          <li>Search & filters</li>
          <li>Dark mode</li>
          <li>Mobile app version</li>
          <li>AI-based summaries</li>
        </ul>
      </section>

      {/* FOOTER */}
      <section className="p-footer">
        <p>
          Designed & Developed by <b>[Your Name]</b>
        </p>
        <p>
          Full Stack Java & React Developer
        </p>
      </section>

    </div>
  );
};

export default Portfolio;
