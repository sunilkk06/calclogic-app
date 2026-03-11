import React, { useState, useEffect } from 'react';

const buttonLayout = [
  ['MC', 'MR', 'M+', 'M-', 'C', '⌫'],
  ['(', ')', 'π', 'e', '^', '√'],
  ['sin', 'cos', 'tan', 'log', 'ln', '1/x'],
  ['7', '8', '9', '/', '%', 'x²'],
  ['4', '5', '6', '*', 'x³', 'xʸ'],
  ['1', '2', '3', '-', 'exp', 'mod'],
  ['0', '.', '=', '+', '', ''],
];

const sciFns = ['sin', 'cos', 'tan', 'log', 'ln', '√', '1/x', '^', 'x²', 'x³', 'xʸ', 'exp', 'mod'];

const palette = {
  blue: '#1e90ff',
  green: '#38ef7d',
  red: '#e05a5a',
  dark: '#1e3c72',
  white: '#fff',
  bg: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #38ef7d 100%)',
  card: '#fff',
  cardShadow: '0 2px 12px rgba(30,60,114,0.08)',
  cardTitle: '#22334d',
  cardText: '#444',
};

const styles = {
  wrapper: {
    minHeight: '100vh',
    background: palette.bg,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 0',
  },
  eduRow: {
    display: 'flex',
    gap: 32,
    marginBottom: 32,
    width: '100%',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  eduCard: {
    background: palette.card,
    borderRadius: 14,
    boxShadow: palette.cardShadow,
    padding: '24px 22px 18px 22px',
    minWidth: 260,
    maxWidth: 340,
    flex: 1,
    margin: '0 8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  eduTitle: {
    fontWeight: 700,
    fontSize: '1.18rem',
    color: palette.cardTitle,
    marginBottom: 8,
  },
  eduText: {
    color: palette.cardText,
    fontSize: '1rem',
    lineHeight: 1.5,
  },
  card: {
    background: 'rgba(255,255,255,0.13)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
    backdropFilter: 'blur(8px)',
    borderRadius: 20,
    padding: '32px 24px 24px 24px',
    maxWidth: 420,
    minWidth: 340,
    margin: '0 auto',
    animation: 'fadeInUp 0.8s cubic-bezier(.23,1.01,.32,1) both',
  },
  header: {
    textAlign: 'center',
    marginBottom: 18,
    color: palette.dark,
    fontSize: '2rem',
    fontWeight: 700,
    letterSpacing: 1,
  },
  display: {
    background: 'rgba(30,60,114,0.85)',
    color: palette.white,
    borderRadius: 10,
    padding: '18px 12px 8px 12px',
    marginBottom: 16,
    fontSize: '1.2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  memory: {
    fontSize: '1rem',
    color: palette.green,
    minHeight: '1.2em',
  },
  input: {
    background: 'transparent',
    border: 'none',
    color: palette.white,
    fontSize: '2.1rem',
    width: '100%',
    outline: 'none',
    textAlign: 'right',
    fontWeight: 600,
    marginTop: 2,
    wordBreak: 'break-all',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  row: {
    display: 'flex',
    gap: 8,
  },
  btn: {
    flex: 1,
    padding: '14px 0',
    fontSize: '1.1rem',
    border: 'none',
    borderRadius: 8,
    background: 'rgba(46, 62, 84, 0.92)',
    color: palette.white,
    cursor: 'pointer',
    transition: 'background 0.18s, transform 0.12s, box-shadow 0.18s',
    fontWeight: 500,
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
    outline: 'none',
    minWidth: 0,
    minHeight: 0,
    userSelect: 'none',
  },
  sciFn: {
    background: palette.blue,
    color: palette.white,
  },
  equals: {
    background: palette.green,
    color: palette.white,
    fontWeight: 700,
    boxShadow: '0 2px 8px #38ef7d44',
  },
  clear: {
    background: palette.red,
    color: palette.white,
  },
  btnHover: {
    background: palette.green,
    color: palette.dark,
    transform: 'translateY(-2px) scale(1.04)',
    boxShadow: '0 2px 8px #38ef7d44',
  },
  btnActive: {
    background: palette.dark,
    color: palette.white,
    transform: 'scale(0.98)',
  },
  disabled: {
    background: 'transparent',
    color: 'transparent',
    cursor: 'default',
    boxShadow: 'none',
  },
};

if (typeof window !== 'undefined' && !document.getElementById('fadeInUpKeyframes')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'fadeInUpKeyframes';
  styleSheet.innerHTML = `@keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }`;
  document.head.appendChild(styleSheet);
}

function evaluate(input) {
  try {
    let expr = input
      .replace(/π/g, `(${Math.PI})`)
      .replace(/e/g, `(${Math.E})`)
      .replace(/÷|\//g, '/')
      .replace(/×|\*/g, '*')
      .replace(/\^/g, '**')
      .replace(/√([\d.]+)/g, 'Math.sqrt($1)')
      .replace(/(\d+)\s*x²/g, 'Math.pow($1,2)')
      .replace(/(\d+)\s*x³/g, 'Math.pow($1,3)')
      .replace(/(\d+)\s*xʸ\s*(\d+)/g, 'Math.pow($1,$2)')
      .replace(/(\d+)\s*exp/g, 'Math.exp($1)')
      .replace(/(\d+)\s*mod\s*(\d+)/g, '($1%$2)')
      .replace(/(\d+)\s*%/g, '($1/100)')
      .replace(/sin\(([^)]+)\)/g, (_, a) => `Math.sin(${a})`)
      .replace(/cos\(([^)]+)\)/g, (_, a) => `Math.cos(${a})`)
      .replace(/tan\(([^)]+)\)/g, (_, a) => `Math.tan(${a})`)
      .replace(/log\(([^)]+)\)/g, (_, a) => `Math.log10(${a})`)
      .replace(/ln\(([^)]+)\)/g, (_, a) => `Math.log(${a})`)
      .replace(/1\/x\(([^)]+)\)/g, (_, a) => `(1/(${a}))`);
    // eslint-disable-next-line no-eval
    return eval(expr);
  } catch {
    return 'Error';
  }
}

const ScientificCalculator = () => {
  const [input, setInput] = useState('');
  const [memory, setMemory] = useState(0);
  const [hovered, setHovered] = useState({});
  const [active, setActive] = useState({});

  // Add SEO meta tags and JSON-LD schemas
  useEffect(() => {
    // Update page title
    document.title = 'Scientific Calculator — Free Online with Full Functions | CalcLogic';
    
    // Update or create meta tags
    const updateMetaTag = (name, content) => {
      let meta = document.querySelector(`meta[name="${name}"]`) || 
                 document.querySelector(`meta[property="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(name.startsWith('og:') ? 'property' : 'name', name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Update meta tags
    updateMetaTag('description', 'Free online scientific calculator with trigonometry, logarithms, exponents, roots, constants and memory functions. Works on any device, no download required. Instant calculations.');
    updateMetaTag('keywords', 'scientific calculator, online scientific calculator, free scientific calculator, sin cos tan calculator, log calculator, scientific calculator online, trig calculator, exponent calculator, scientific notation calculator');
    updateMetaTag('canonical', 'https://calclogic.com/scientific-calculator');
    
    // Open Graph tags
    updateMetaTag('og:title', 'Scientific Calculator — Free Online with Full Functions | CalcLogic');
    updateMetaTag('og:description', 'Free online scientific calculator. Trig, logarithms, exponents, roots, constants and memory — no download, works on any device instantly.');
    updateMetaTag('og:type', 'website');
    updateMetaTag('og:url', 'https://calclogic.com/scientific-calculator');
    
    // Twitter tags
    updateMetaTag('twitter:card', 'summary');
    updateMetaTag('twitter:title', 'Scientific Calculator — Free Online | CalcLogic');
    updateMetaTag('twitter:description', 'Free online scientific calculator with trig, logs, exponents and more. Works on any device, no download needed.');

    // Remove existing JSON-LD scripts if any
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => script.remove());

    // Add FAQ Schema
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I calculate sin, cos, and tan?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "To calculate sin, cos, or tan, first make sure your calculator is in the correct angle mode (Degrees or Radians). Then press the sin, cos, or tan button followed by the angle value. For example, sin(30) in degrees equals 0.5. Most problems in everyday use require degrees mode; radians are used in advanced mathematics and physics."
          }
        },
        {
          "@type": "Question",
          "name": "What is the difference between Deg and Rad mode?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Deg (Degrees) and Rad (Radians) are two ways of measuring angles. A full circle is 360 degrees or 2 pi radians. Use Degrees mode for everyday geometry, navigation, and most school problems. Use Radians mode for calculus, physics, and advanced mathematics. To convert: radians = degrees multiplied by pi divided by 180."
          }
        },
        {
          "@type": "Question",
          "name": "What is the difference between log and ln?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Log (written as log) is the base-10 logarithm, also called the common logarithm. Log(100) = 2 because 10 squared equals 100. Ln is the natural logarithm with base e (approximately 2.718). Ln is used extensively in calculus, statistics, and science. For example, ln(e) = 1. Use log for general calculations and ln for natural growth or decay problems."
          }
        },
        {
          "@type": "Question",
          "name": "How do I use the memory buttons (M+, M-, MR, MC)?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Memory buttons let you store and recall values during multi-step calculations. M+ adds the current result to memory. M- subtracts the current result from memory. MR (Memory Recall) displays the stored value. MC (Memory Clear) erases the stored value. For example, calculate 15 multiplied by 4, press M+, then calculate your next expression, press MR to retrieve 60 and use it in your next calculation."
          }
        },
        {
          "@type": "Question",
          "name": "How do I calculate exponents and powers?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use the x squared button for squaring a number (x to the power 2), x cubed for cubing (x to the power 3), or the x to the y button for any custom exponent. For example, to calculate 2 to the power of 8, enter 2, press the x to the y button, enter 8, and press equals to get 256. The exp button is used for scientific notation, representing powers of 10."
          }
        },
        {
          "@type": "Question",
          "name": "How do I calculate square roots and other roots?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Press the square root button to find the square root of any number. For example, the square root of 144 equals 12. For other roots such as cube roots, use the x to the y button with a fractional exponent. For a cube root, raise the number to the power of 1 divided by 3. For example, 27 to the power of 0.333 equals 3."
          }
        },
        {
          "@type": "Question",
          "name": "What does the mod button do?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The mod button calculates the modulus, which is the remainder after division. For example, 17 mod 5 equals 2 because 17 divided by 5 is 3 with a remainder of 2. Modulus is widely used in programming, cryptography, and number theory. It is also useful for determining whether a number is odd or even: any number mod 2 equals either 0 (even) or 1 (odd)."
          }
        },
        {
          "@type": "Question",
          "name": "What are pi and e on a scientific calculator?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Pi (the pi symbol) is the mathematical constant approximately equal to 3.14159, representing the ratio of a circle's circumference to its diameter. It is essential for circle and sphere calculations. The constant e is Euler's number, approximately 2.71828, which is the base of the natural logarithm. It appears in compound interest, population growth, radioactive decay, and many other natural phenomena."
          }
        }
      ]
    };

    // Add HowTo Schema
    const howToSchema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Use a Scientific Calculator",
      "description": "Step-by-step guide to using CalcLogic's free online scientific calculator for trigonometry, logarithms, exponents, and more.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Select your angle mode",
          "text": "Choose Deg (Degrees) for everyday geometry and school problems, or Rad (Radians) for calculus and advanced physics. This setting affects all trigonometric calculations."
        },
        {
          "@type": "HowToStep",
          "name": "Enter your expression",
          "text": "Use the number buttons and operator buttons to enter your calculation. Use parentheses to group parts of complex expressions and control the order of operations."
        },
        {
          "@type": "HowToStep",
          "name": "Use scientific functions",
          "text": "Press sin, cos, tan for trigonometry. Press log for base-10 logarithm or ln for natural logarithm. Use the power buttons for exponents and the square root button for roots. Press pi or e to insert those constants."
        },
        {
          "@type": "HowToStep",
          "name": "Use memory for multi-step calculations",
          "text": "Press M+ to store a result in memory. Continue your calculation and press MR to recall the stored value when needed. Press MC to clear memory when done."
        },
        {
          "@type": "HowToStep",
          "name": "Press equals for your result",
          "text": "Press the equals button to calculate your final result. Press C to clear and start a new calculation."
        }
      ]
    };

    // Create and append FAQ schema script
    const faqScript = document.createElement('script');
    faqScript.type = 'application/ld+json';
    faqScript.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(faqScript);

    // Create and append HowTo schema script
    const howToScript = document.createElement('script');
    howToScript.type = 'application/ld+json';
    howToScript.textContent = JSON.stringify(howToSchema);
    document.head.appendChild(howToScript);

    // Cleanup function to remove scripts when component unmounts
    return () => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      scripts.forEach(script => script.remove());
    };
  }, []); // Empty dependency array means this runs once on mount

  const handleBtn = (btn) => {
    if (!btn) return;
    if (btn === 'C') setInput('');
    else if (btn === '⌫') setInput(input.slice(0, -1));
    else if (btn === '=') setInput(String(evaluate(input)));
    else if (btn === 'MC') setMemory(0);
    else if (btn === 'MR') setInput(input + memory);
    else if (btn === 'M+') setMemory(memory + Number(evaluate(input || 0)));
    else if (btn === 'M-') setMemory(memory - Number(evaluate(input || 0)));
    else if (btn === 'π' || btn === 'e') setInput(input + btn);
    else if (btn === 'x²') setInput(input + 'x²');
    else if (btn === 'x³') setInput(input + 'x³');
    else if (btn === 'xʸ') setInput(input + 'xʸ');
    else if (btn === 'exp') setInput(input + 'exp');
    else if (btn === 'mod') setInput(input + 'mod');
    else if (btn === '√') setInput(input + '√');
    else if (sciFns.includes(btn)) setInput(input + btn + '(');
    else setInput(input + btn);
  };

  const getBtnStyle = (btn) => {
    let style = { ...styles.btn };
    if (!btn) return { ...style, ...styles.disabled };
    if (sciFns.includes(btn)) style = { ...style, ...styles.sciFn };
    if (btn === '=') style = { ...style, ...styles.equals };
    if (btn === 'C') style = { ...style, ...styles.clear };
    if (hovered[btn]) style = { ...style, ...styles.btnHover };
    if (active[btn]) style = { ...style, ...styles.btnActive };
    return style;
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.header}>Scientific Calculator</div>
        <div style={styles.display}>
          <div style={styles.memory}>{memory !== 0 ? `M: ${memory}` : '\u00A0'}</div>
          <input style={styles.input} type="text" value={input} readOnly />
        </div>
        <div style={styles.buttons}>
          {buttonLayout.map((row, i) => (
            <div style={styles.row} key={i}>
              {row.map((btn, j) => (
                <button
                  key={j}
                  style={getBtnStyle(btn)}
                  onClick={() => handleBtn(btn)}
                  onMouseEnter={() => setHovered((h) => ({ ...h, [btn]: true }))}
                  onMouseLeave={() => setHovered((h) => ({ ...h, [btn]: false }))}
                  onMouseDown={() => setActive((a) => ({ ...a, [btn]: true }))}
                  onMouseUp={() => setActive((a) => ({ ...a, [btn]: false }))}
                  disabled={!btn}
                >
                  {btn}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* Comprehensive Educational Content */}
      <div style={{...styles.eduCard, maxWidth: '1200px', width: '100%', margin: '32px auto 0', padding: '40px'}}>
        <h2 style={{...styles.eduTitle, fontSize: '1.45rem', marginBottom: '0.7rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.4rem'}}>Complete Button Reference Guide</h2>
        <p style={styles.eduText}>CalcLogic's scientific calculator includes every function you need for advanced mathematics, science, and engineering. Here's what every button does — including the ones that confuse people most.</p>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', margin: '1.5rem 0'}}>
          <div style={{background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.1rem 1.2rem'}}>
            <h4 style={{fontSize: '0.88rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <span style={{background: '#1e3a5f', color: 'white', fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: '700', padding: '0.15rem 0.5rem', borderRadius: '4px'}}>sin cos tan</span> Trigonometry
            </h4>
            <p style={{fontSize: '0.82rem', color: '#6b7280', margin: '0', lineHeight: '1.5'}}>Calculates sine, cosine, and tangent of an angle. Switch between Deg and Rad mode depending on your problem. Essential for geometry, physics, and engineering.</p>
          </div>
          <div style={{background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.1rem 1.2rem'}}>
            <h4 style={{fontSize: '0.88rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <span style={{background: '#1e3a5f', color: 'white', fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: '700', padding: '0.15rem 0.5rem', borderRadius: '4px'}}>log</span> Logarithm (base 10)
            </h4>
            <p style={{fontSize: '0.82rem', color: '#6b7280', margin: '0', lineHeight: '1.5'}}>The common logarithm. log(100) = 2 because 10 squared = 100. Used in chemistry (pH), acoustics (decibels), and earthquake measurement (Richter scale).</p>
          </div>
          <div style={{background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.1rem 1.2rem'}}>
            <h4 style={{fontSize: '0.88rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <span style={{background: '#1e3a5f', color: 'white', fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: '700', padding: '0.15rem 0.5rem', borderRadius: '4px'}}>ln</span> Natural Logarithm
            </h4>
            <p style={{fontSize: '0.82rem', color: '#6b7280', margin: '0', lineHeight: '1.5'}}>Logarithm with base e (2.71828). Used in calculus, compound interest, population growth, radioactive decay, and statistics.</p>
          </div>
          <div style={{background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.1rem 1.2rem'}}>
            <h4 style={{fontSize: '0.88rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <span style={{background: '#1e3a5f', color: 'white', fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: '700', padding: '0.15rem 0.5rem', borderRadius: '4px'}}>x²</span> Square
            </h4>
            <p style={{fontSize: '0.82rem', color: '#6b7280', margin: '0', lineHeight: '1.5'}}>Raises a number to the power of 2. Example: 9 squared = 81. Shortcut for multiplying a number by itself — faster than using the power button.</p>
          </div>
          <div style={{background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.1rem 1.2rem'}}>
            <h4 style={{fontSize: '0.88rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <span style={{background: '#1e3a5f', color: 'white', fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: '700', padding: '0.15rem 0.5rem', borderRadius: '4px'}}>x³</span> Cube
            </h4>
            <p style={{fontSize: '0.82rem', color: '#6b7280', margin: '0', lineHeight: '1.5'}}>Raises a number to the power of 3. Example: 4 cubed = 64. Common in volume calculations and polynomial equations.</p>
          </div>
          <div style={{background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.1rem 1.2rem'}}>
            <h4 style={{fontSize: '0.88rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <span style={{background: '#1e3a5f', color: 'white', fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: '700', padding: '0.15rem 0.5rem', borderRadius: '4px'}}>xʸ</span> Power
            </h4>
            <p style={{fontSize: '0.82rem', color: '#6b7280', margin: '0', lineHeight: '1.5'}}>Raises x to any power y. Enter base, press xʸ, enter exponent, press equals. Example: 2 to the power 10 = 1,024.</p>
          </div>
          <div style={{background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.1rem 1.2rem'}}>
            <h4 style={{fontSize: '0.88rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <span style={{background: '#1e3a5f', color: 'white', fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: '700', padding: '0.15rem 0.5rem', borderRadius: '4px'}}>√</span> Square Root
            </h4>
            <p style={{fontSize: '0.82rem', color: '#6b7280', margin: '0', lineHeight: '1.5'}}>Finds the square root of a number. Example: square root of 225 = 15. For other roots, use xʸ with a fractional exponent.</p>
          </div>
          <div style={{background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.1rem 1.2rem'}}>
            <h4 style={{fontSize: '0.88rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <span style={{background: '#1e3a5f', color: 'white', fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: '700', padding: '0.15rem 0.5rem', borderRadius: '4px'}}>1/x</span> Reciprocal
            </h4>
            <p style={{fontSize: '0.82rem', color: '#6b7280', margin: '0', lineHeight: '1.5'}}>Divides 1 by the displayed number. Example: 1/8 = 0.125. Useful in optics, electronics, and harmonic calculations.</p>
          </div>
          <div style={{background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.1rem 1.2rem'}}>
            <h4 style={{fontSize: '0.88rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <span style={{background: '#1e3a5f', color: 'white', fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: '700', padding: '0.15rem 0.5rem', borderRadius: '4px'}}>exp</span> Scientific Notation
            </h4>
            <p style={{fontSize: '0.82rem', color: '#6b7280', margin: '0', lineHeight: '1.5'}}>Enters a power of 10. Example: 3 exp 6 = 3,000,000 (3 × 10⁶). Essential for very large or very small numbers in physics and chemistry.</p>
          </div>
          <div style={{background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.1rem 1.2rem'}}>
            <h4 style={{fontSize: '0.88rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <span style={{background: '#1e3a5f', color: 'white', fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: '700', padding: '0.15rem 0.5rem', borderRadius: '4px'}}>mod</span> Modulus
            </h4>
            <p style={{fontSize: '0.82rem', color: '#6b7280', margin: '0', lineHeight: '1.5'}}>Returns the remainder after division. Example: 17 mod 5 = 2. Widely used in programming, cryptography, and number theory.</p>
          </div>
          <div style={{background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.1rem 1.2rem'}}>
            <h4 style={{fontSize: '0.88rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <span style={{background: '#1e3a5f', color: 'white', fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: '700', padding: '0.15rem 0.5rem', borderRadius: '4px'}}>π</span> Pi
            </h4>
            <p style={{fontSize: '0.82rem', color: '#6b7280', margin: '0', lineHeight: '1.5'}}>Inserts pi (3.14159...). Used in all circle, sphere, and wave calculations. Example: area of circle = pi times radius squared.</p>
          </div>
          <div style={{background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.1rem 1.2rem'}}>
            <h4 style={{fontSize: '0.88rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <span style={{background: '#1e3a5f', color: 'white', fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: '700', padding: '0.15rem 0.5rem', borderRadius: '4px'}}>e</span> Euler's Number
            </h4>
            <p style={{fontSize: '0.82rem', color: '#6b7280', margin: '0', lineHeight: '1.5'}}>Inserts e (2.71828...). The base of the natural logarithm. Fundamental to compound interest, growth and decay, and probability.</p>
          </div>
        </div>

        <h3 style={{fontSize: '1.05rem', fontWeight: '700', marginTop: '1.8rem', marginBottom: '0.5rem', color: '#1e3a5f'}}>Degrees vs Radians — Which Mode Should You Use?</h3>
        <p style={styles.eduText}>This is the most common source of wrong answers on a scientific calculator. Choosing the wrong angle mode gives a completely different result for any trigonometric function.</p>

        <div style={{background: '#eff6ff', border: '1px solid #bfdbfe', borderLeft: '4px solid #3b82f6', borderRadius: '0 8px 8px 0', padding: '1.1rem 1.4rem', margin: '1.2rem 0', fontSize: '0.92rem'}}>
          <strong style={{color: '#1d4ed8', display: 'block', marginBottom: '0.3rem'}}>📌 Simple rule:</strong>
          Use <strong>Degrees</strong> for school geometry, navigation, construction, and everyday problems. Use <strong>Radians</strong> for calculus, physics equations, and university-level mathematics.
        </div>

        <table style={{width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', fontSize: '0.92rem'}}>
          <thead>
            <tr>
              <th style={{background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600'}}>Concept</th>
              <th style={{background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600'}}>Degrees</th>
              <th style={{background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600'}}>Radians</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', verticalAlign: 'top'}}>Full circle</td><td style={{padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', verticalAlign: 'top'}}>360°</td><td style={{padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', verticalAlign: 'top'}}>2π (≈ 6.283)</td></tr>
            <tr><td style={{padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', verticalAlign: 'top', background: '#f8fafc'}}>Half circle</td><td style={{padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', verticalAlign: 'top', background: '#f8fafc'}}>180°</td><td style={{padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', verticalAlign: 'top', background: '#f8fafc'}}>π (≈ 3.14159)</td></tr>
            <tr><td style={{padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', verticalAlign: 'top'}}>Quarter circle</td><td style={{padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', verticalAlign: 'top'}}>90°</td><td style={{padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', verticalAlign: 'top'}}>π/2 (≈ 1.5708)</td></tr>
            <tr><td style={{padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', verticalAlign: 'top', background: '#f8fafc'}}>sin(30° or π/6)</td><td style={{padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', verticalAlign: 'top', background: '#f8fafc'}}>0.5</td><td style={{padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', verticalAlign: 'top', background: '#f8fafc'}}>0.5</td></tr>
            <tr><td style={{padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', verticalAlign: 'top'}}>cos(60° or π/3)</td><td style={{padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', verticalAlign: 'top'}}>0.5</td><td style={{padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', verticalAlign: 'top'}}>0.5</td></tr>
            <tr><td style={{padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', verticalAlign: 'top', background: '#f8fafc'}}>tan(45° or π/4)</td><td style={{padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', verticalAlign: 'top', background: '#f8fafc'}}>1</td><td style={{padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', verticalAlign: 'top', background: '#f8fafc'}}>1</td></tr>
            <tr><td style={{padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', verticalAlign: 'top'}}>Conversion formula</td><td style={{padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', verticalAlign: 'top'}}>Degrees × π ÷ 180 = Radians</td><td style={{padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', verticalAlign: 'top'}}>Radians × 180 ÷ π = Degrees</td></tr>
          </tbody>
        </table>

        <div style={{background: '#fffbeb', border: '1px solid #fde68a', borderLeft: '4px solid #f59e0b', borderRadius: '0 8px 8px 0', padding: '1.1rem 1.4rem', margin: '1.2rem 0', fontSize: '0.92rem'}}>
          <strong style={{color: '#92400e', display: 'block', marginBottom: '0.4rem'}}>📘 Why mode matters — a real example</strong>
          sin(30) in <strong>Degrees mode</strong> = <strong>0.5</strong> ✅ (correct for a 30-degree angle)<br />
          sin(30) in <strong>Radians mode</strong> = <strong>-0.988</strong> ❌ (wrong — 30 radians is a very different angle)<br /><br />
          Always check your mode before any trig calculation.
        </div>

        <h3 style={{fontSize: '1.05rem', fontWeight: '700', marginTop: '1.8rem', marginBottom: '0.5rem', color: '#1e3a5f'}}>Frequently Asked Questions</h3>

        <div style={{border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem', marginBottom: '1rem'}}>
          <h4 style={{margin: '0 0 0.5rem 0', fontSize: '0.98rem', color: '#1e3a5f'}}>How do I calculate sin, cos, and tan?</h4>
          <p style={{margin: '0', fontSize: '0.92rem', color: '#374151'}}>First check your angle mode — press <strong>Deg</strong> for degrees or <strong>Rad</strong> for radians. Then press the sin, cos, or tan button and enter your angle value. For example, sin(30) in degrees = 0.5.</p>
        </div>

        <div style={{border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem', marginBottom: '1rem'}}>
          <h4 style={{margin: '0 0 0.5rem 0', fontSize: '0.98rem', color: '#1e3a5f'}}>What is the difference between Deg and Rad mode?</h4>
          <p style={{margin: '0', fontSize: '0.92rem', color: '#374151'}}>Degrees and radians are two units for measuring angles. A full circle equals 360 degrees or 2π radians. Use <strong>Degrees</strong> for everyday geometry, school problems, and navigation. Use <strong>Radians</strong> for calculus, physics, and advanced mathematics.</p>
        </div>

        <div style={{border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem', marginBottom: '1rem'}}>
          <h4 style={{margin: '0 0 0.5rem 0', fontSize: '0.98rem', color: '#1e3a5f'}}>What is the difference between log and ln?</h4>
          <p style={{margin: '0', fontSize: '0.92rem', color: '#374151'}}><strong>log</strong> is the base-10 logarithm (common log). log(1000) = 3 because 10³ = 1000. <strong>ln</strong> is the natural logarithm with base e (2.71828). ln(e) = 1. Use log for chemistry, acoustics, and general calculations. Use ln for calculus, compound interest, and natural growth or decay problems.</p>
        </div>

        <div style={{border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem', marginBottom: '1rem'}}>
          <h4 style={{margin: '0 0 0.5rem 0', fontSize: '0.98rem', color: '#1e3a5f'}}>How do I use memory buttons?</h4>
          <p style={{margin: '0', fontSize: '0.92rem', color: '#374151'}}>Memory buttons store values between calculations. <strong>M+</strong> adds the current value to memory. <strong>M-</strong> subtracts it. <strong>MR</strong> recalls the stored value. <strong>MC</strong> clears memory. This is especially useful for multi-step problems where you need to use an intermediate result later.</p>
        </div>

        <p style={{fontSize: '0.82rem', color: '#6b7280', fontStyle: 'italic', borderTop: '1px solid #e5e7eb', paddingTop: '1rem', marginTop: '3rem', margin: '3rem 0 0 0'}}>CalcLogic's scientific calculator is designed for educational and general-purpose use. For professional engineering, scientific research, or examination use, verify results with appropriate certified tools and consult your institution's approved calculator policy.</p>
      </div>
    </div>
  );
};

export default ScientificCalculator;
