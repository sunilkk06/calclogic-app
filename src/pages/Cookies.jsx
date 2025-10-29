import React from 'react'

const Cookies = () => {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <h1>Cookie Policy</h1>
        <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>

        <section>
          <h2>1. What Are Cookies?</h2>
          <p>
            Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the website owners.
          </p>
        </section>

        <section>
          <h2>2. How We Use Cookies</h2>
          <p>CalcLogic uses cookies for the following purposes:</p>
          <ul>
            <li><strong>Essential Cookies:</strong> These cookies are necessary for the Site to function properly. They enable you to navigate the Site and use its features.</li>
            <li><strong>Performance Cookies:</strong> These cookies collect information about how you use the Site, such as which pages you visit and if you experience any errors. This information helps us improve the Site's performance.</li>
            <li><strong>Functional Cookies:</strong> These cookies allow the Site to remember choices you make (such as your username or language preference) and provide enhanced features.</li>
            <li><strong>Targeting Cookies:</strong> These cookies are used to deliver advertisements that are relevant to you and your interests. They may also be used to limit the number of times you see an advertisement and to measure the effectiveness of advertising campaigns.</li>
          </ul>
        </section>

        <section>
          <h2>3. Types of Cookies We Use</h2>
          <ul>
            <li><strong>Session Cookies:</strong> These cookies expire when you close your browser.</li>
            <li><strong>Persistent Cookies:</strong> These cookies remain on your device for a set period of time or until you delete them.</li>
            <li><strong>First-Party Cookies:</strong> These are cookies set by CalcLogic.</li>
            <li><strong>Third-Party Cookies:</strong> These are cookies set by third parties, such as analytics providers or advertising networks.</li>
          </ul>
        </section>

        <section>
          <h2>4. Your Cookie Choices</h2>
          <p>
            Most web browsers allow you to control cookies through their settings. You can set your browser to refuse cookies or alert you when cookies are being sent. However, blocking cookies may affect your ability to use certain features of the Site.
          </p>
          <p>
            You can also opt out of certain types of cookies by visiting the following websites:
          </p>
          <ul>
            <li>Network Advertising Initiative (NAI): <a href="https://www.networkadvertising.org/" target="_blank" rel="noopener noreferrer">www.networkadvertising.org</a></li>
            <li>Digital Advertising Alliance (DAA): <a href="https://www.aboutads.info/" target="_blank" rel="noopener noreferrer">www.aboutads.info</a></li>
          </ul>
        </section>

        <section>
          <h2>5. Third-Party Cookies</h2>
          <p>
            We may allow third-party service providers to place cookies on the Site for analytics and advertising purposes. These third parties may use cookies to track your online activities over time and across different websites.
          </p>
        </section>

        <section>
          <h2>6. Updates to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We encourage you to review this policy periodically to stay informed about how we use cookies.
          </p>
        </section>

        <section>
          <h2>7. Contact Us</h2>
          <p>
            If you have any questions about this Cookie Policy, please contact us at:
          </p>
          <p>
            <strong>CalcLogic</strong><br />
            Email: contact@calclogic.com
          </p>
        </section>
      </div>
    </div>
  )
}

export default Cookies
