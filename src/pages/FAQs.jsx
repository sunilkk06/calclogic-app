import React, { useState, useEffect } from 'react';

const FAQs = () => {
  const [openItems, setOpenItems] = useState({});

  // FAQ data with comprehensive content for SEO
  const faqData = [
    {
      id: 1,
      question: "What is CalcLogic?",
      answer: "CalcLogic is a comprehensive platform offering free online calculators for financial planning, health and fitness tracking, mathematical computations, and everyday calculations. Our tools are designed to help individuals and professionals make informed decisions with accurate, real-time calculations."
    },
    {
      id: 2,
      question: "How do I use the calculators?",
      answer: "Using our calculators is simple: 1) Select the calculator you need from our categories (Financial, Health, Math, or Other), 2) Enter the required data in the input fields, 3) Click calculate to get instant results. Most calculators also provide detailed explanations and breakdowns of the calculations."
    },
    {
      id: 3,
      question: "Is my data secure and private?",
      answer: "Absolutely! We prioritize your privacy and security. All calculations are performed locally in your browser, and we do not store, collect, or share any personal information or calculation data. Your privacy is completely protected."
    },
    {
      id: 4,
      question: "Are the calculators free to use?",
      answer: "Yes, all CalcLogic calculators are completely free to use. There are no hidden fees, subscriptions, or premium features. We believe everyone should have access to accurate calculation tools."
    },
    {
      id: 5,
      question: "What types of calculators do you offer?",
      answer: "We offer calculators in four main categories: Financial (mortgage, loan, investment, retirement planning), Health & Fitness (BMI, BMR, calorie, macro calculations), Mathematical (percentage, fraction, scientific, statistics), and Other utilities (age, date, time, GPA calculations)."
    },
    {
      id: 6,
      question: "How accurate are the calculations?",
      answer: "Our calculators use industry-standard formulas and are regularly updated to ensure maximum accuracy. However, results should be used for informational purposes and we recommend consulting with professionals for important financial or health decisions."
    },
    {
      id: 7,
      question: "Can I access CalcLogic on mobile devices?",
      answer: "Yes! CalcLogic is fully responsive and optimized for mobile devices, tablets, and desktop computers. You can access all our calculators from any device with an internet connection."
    },
    {
      id: 8,
      question: "Do you provide explanations for the calculations?",
      answer: "Many of our calculators include detailed explanations, formulas used, and step-by-step breakdowns to help you understand how the results are calculated. This educational approach helps you learn while you calculate."
    },
    {
      id: 9,
      question: "How often are the calculators updated?",
      answer: "We regularly review and update our calculators to ensure they reflect current standards, regulations, and best practices. Tax calculators, for example, are updated annually to reflect current tax laws."
    },
    {
      id: 10,
      question: "Can I suggest a new calculator?",
      answer: "We welcome suggestions for new calculators! Please contact us at contact@calclogic.com with your ideas. We regularly add new tools based on user feedback and emerging needs."
    }
  ];

  // Add structured data to head for SEO
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqData.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Add meta tags for SEO
    document.title = "Frequently Asked Questions - CalcLogic | Free Online Calculator FAQs";
    
    const metaDescription = document.querySelector('meta[name="description"]') || document.createElement('meta');
    metaDescription.name = "description";
    metaDescription.content = "Find answers to frequently asked questions about CalcLogic's free online calculators. Learn about security, accuracy, usage, and our comprehensive calculator tools.";
    if (!document.querySelector('meta[name="description"]')) {
      document.head.appendChild(metaDescription);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]') || document.createElement('meta');
    metaKeywords.name = "keywords";
    metaKeywords.content = "calculator FAQ, online calculator help, free calculator questions, CalcLogic support, calculator security, calculation accuracy";
    if (!document.querySelector('meta[name="keywords"]')) {
      document.head.appendChild(metaKeywords);
    }

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h1>Frequently Asked Questions</h1>
        <p className="calculator-description">
          Get answers to common questions about CalcLogic's free online calculators
        </p>
      </div>

      <div className="calculator-form">
        <div className="faq-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          {faqData.map((item) => (
            <div 
              key={item.id} 
              className="faq-item" 
              style={{
                marginBottom: '1rem',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
            >
              <button
                className="faq-question"
                onClick={() => toggleItem(item.id)}
                style={{
                  width: '100%',
                  padding: '1.25rem',
                  textAlign: 'left',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: '#2d3748',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f7fafc'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                aria-expanded={openItems[item.id] || false}
                aria-controls={`faq-answer-${item.id}`}
              >
                <span>{item.question}</span>
                <span 
                  style={{
                    transform: openItems[item.id] ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                    fontSize: '1.2rem',
                    color: '#4a5568'
                  }}
                >
                  ↓
                </span>
              </button>
              
              {openItems[item.id] && (
                <div 
                  id={`faq-answer-${item.id}`}
                  className="faq-answer"
                  style={{
                    padding: '0 1.25rem 1.25rem 1.25rem',
                    borderTop: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc'
                  }}
                >
                  <p style={{
                    margin: 0,
                    lineHeight: '1.6',
                    color: '#4a5568'
                  }}>
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="input-section" style={{ textAlign: 'center', marginTop: '3rem' }}>
          <h2>Still Have Questions?</h2>
          <p>
            If you couldn't find the answer you're looking for, feel free to contact us at{' '}
            <a href="mailto:contact@calclogic.com" style={{ color: '#3182ce', textDecoration: 'none' }}>
              contact@calclogic.com
            </a>
            . We're here to help!
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQs;

