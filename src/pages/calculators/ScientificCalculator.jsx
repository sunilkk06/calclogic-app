import React, { useState } from 'react';

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
      <div style={styles.eduRow}>
        <div style={styles.eduCard}>
          <div style={styles.eduTitle}>Input Expression</div>
          <div style={styles.eduText}>
            Enter your calculation using the number and operator buttons. Use parentheses for grouping and advanced expressions.
          </div>
        </div>
        <div style={styles.eduCard}>
          <div style={styles.eduTitle}>Use Scientific Functions</div>
          <div style={styles.eduText}>
            Access scientific functions like sin, cos, tan, log, powers, roots, and constants (π, e) using the blue buttons.
          </div>
        </div>
        <div style={styles.eduCard}>
          <div style={styles.eduTitle}>Calculate &amp; Memory</div>
          <div style={styles.eduText}>
            Press <b>=</b> to get your result. Use memory buttons (M+, M-, MR, MC) to store and recall values for multi-step calculations.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScientificCalculator;
