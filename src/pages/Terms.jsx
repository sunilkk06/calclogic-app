import React from 'react'

const Terms = () => {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <h1>Terms of Service</h1>
        <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>

        <section>
          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing and using the CalcLogic website (the "Site"), you accept and agree to be bound by and comply with these Terms and Conditions. If you do not agree to abide by the above, please do not use this service.
          </p>
        </section>

        <section>
          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials (information or software) on CalcLogic's Site for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul>
            <li>Modifying or copying the materials</li>
            <li>Using the materials for any commercial purpose or for any public display</li>
            <li>Attempting to decompile or reverse engineer any software contained on the Site</li>
            <li>Removing any copyright or other proprietary notations from the materials</li>
            <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
          </ul>
        </section>

        <section>
          <h2>3. Disclaimer</h2>
          <p>
            The materials on CalcLogic's Site are provided on an 'as is' basis. CalcLogic makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </section>

        <section>
          <h2>4. Limitations</h2>
          <p>
            In no event shall CalcLogic or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on CalcLogic's Site, even if CalcLogic or an authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>
        </section>

        <section>
          <h2>5. Accuracy of Materials</h2>
          <p>
            The materials appearing on CalcLogic's Site could include technical, typographical, or photographic errors. CalcLogic does not warrant that any of the materials on the Site are accurate, complete, or current. CalcLogic may make changes to the materials contained on the Site at any time without notice.
          </p>
        </section>

        <section>
          <h2>6. Links</h2>
          <p>
            CalcLogic has not reviewed all of the sites linked to its Site and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by CalcLogic of the site. Use of any such linked website is at the user's own risk.
          </p>
        </section>

        <section>
          <h2>7. Modifications</h2>
          <p>
            CalcLogic may revise these Terms and Conditions for the Site at any time without notice. By using this Site, you are agreeing to be bound by the then current version of these Terms and Conditions.
          </p>
        </section>

        <section>
          <h2>8. Governing Law</h2>
          <p>
            These Terms and Conditions and any separate agreements we provide to render services are governed by and construed in accordance with the laws of the jurisdiction in which CalcLogic operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </p>
        </section>

        <section>
          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about these Terms and Conditions, please contact us at:
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

export default Terms
