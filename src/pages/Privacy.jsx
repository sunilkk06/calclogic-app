import React from 'react'

const Privacy = () => {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            CalcLogic ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
          <ul>
            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site.</li>
            <li><strong>Financial Data:</strong> Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the Site.</li>
            <li><strong>Data From Social Networks:</strong> User information from social networks, including your name, your social network username, location, gender, birth date, email address, profile picture, and public data for contacts, if you connect your account to such social networks.</li>
            <li><strong>Mobile Device Data:</strong> Device information, such as your mobile device ID, model, and manufacturer, and information about the location of your device, if you access the Site from a mobile device.</li>
          </ul>
        </section>

        <section>
          <h2>3. Use of Your Information</h2>
          <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
          <ul>
            <li>Generate a personal profile about you so that future visits to the Site will be personalized as possible.</li>
            <li>Increase the efficiency and operation of the Site.</li>
            <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
            <li>Notify you of updates to the Site.</li>
            <li>Offer new products, services, and/or recommendations to you.</li>
          </ul>
        </section>

        <section>
          <h2>4. Disclosure of Your Information</h2>
          <p>We may share information we have collected about you in certain situations:</p>
          <ul>
            <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information is necessary to comply with the law, enforce our Site policies, or protect ours or others' rights, property, or safety.</li>
            <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
          </ul>
        </section>

        <section>
          <h2>5. Security of Your Information</h2>
          <p>
            We use administrative, technical, and physical security measures to protect your personal information. However, no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
          </p>
        </section>

        <section>
          <h2>6. Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please contact us at:
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

export default Privacy
