import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import Prism from "prismjs"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-python"
import "prismjs/components/prism-c"
import "prismjs/components/prism-cpp"
import "prismjs/components/prism-java"
import "prismjs/components/prism-go"
import "prismjs/components/prism-rust"
import "prismjs/components/prism-ruby"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-bash"
import "prismjs/components/prism-kotlin"
import "prismjs/components/prism-swift"
import "prismjs/components/prism-php"
import "prismjs/components/prism-r"
import "prismjs/components/prism-lua"
import "prismjs/components/prism-dart"
import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"
import axios from 'axios'
import './App.css'

// ── Language registry ──────────────────────────────────────────────────────
const LANGS = {
  javascript: { label: 'JavaScript', icon: 'JS',  color: '#f7df1e', glow: 'rgba(247,223,30,0.3)',  prism: 'javascript' },
  typescript: { label: 'TypeScript', icon: 'TS',  color: '#3178c6', glow: 'rgba(49,120,198,0.3)',  prism: 'typescript' },
  python:     { label: 'Python',     icon: 'PY',  color: '#4584b6', glow: 'rgba(69,132,182,0.3)',  prism: 'python'     },
  java:       { label: 'Java',       icon: 'JAV', color: '#f89820', glow: 'rgba(248,152,32,0.3)',  prism: 'java'       },
  cpp:        { label: 'C++',        icon: 'C++', color: '#00589d', glow: 'rgba(0,88,157,0.3)',    prism: 'cpp'        },
  c:          { label: 'C',          icon: 'C',   color: '#a8b9cc', glow: 'rgba(168,185,204,0.3)', prism: 'c'          },
  go:         { label: 'Go',         icon: 'GO',  color: '#00acd7', glow: 'rgba(0,172,215,0.3)',   prism: 'go'         },
  rust:       { label: 'Rust',       icon: 'RS',  color: '#f74c00', glow: 'rgba(247,76,0,0.3)',    prism: 'rust'       },
  kotlin:     { label: 'Kotlin',     icon: 'KT',  color: '#7f52ff', glow: 'rgba(127,82,255,0.3)',  prism: 'kotlin'     },
  swift:      { label: 'Swift',      icon: 'SW',  color: '#f05138', glow: 'rgba(240,81,56,0.3)',   prism: 'swift'      },
  ruby:       { label: 'Ruby',       icon: 'RB',  color: '#cc342d', glow: 'rgba(204,52,45,0.3)',   prism: 'ruby'       },
  php:        { label: 'PHP',        icon: 'PHP', color: '#8892be', glow: 'rgba(136,146,190,0.3)', prism: 'php'        },
  lua:        { label: 'Lua',        icon: 'LUA', color: '#000080', glow: 'rgba(0,0,128,0.3)',     prism: 'lua'        },
  dart:       { label: 'Dart',       icon: 'DT',  color: '#00b4ab', glow: 'rgba(0,180,171,0.3)',   prism: 'dart'       },
  bash:       { label: 'Bash',       icon: 'SH',  color: '#89e051', glow: 'rgba(137,224,81,0.3)',  prism: 'bash'       },
  r:          { label: 'R',          icon: 'R',   color: '#198ce7', glow: 'rgba(25,140,231,0.3)',  prism: 'r'          },
}

// ── Language auto-detection ────────────────────────────────────────────────
function detectLang(code) {
  const c = code.trim()
  if (!c) return 'javascript'
  if (/(^package\s+\w+.*\nimport|fun\s+main\s*\(|println\s*\(|:\s*String|:\s*Int\b|data\s+class)/m.test(c)) return 'kotlin'
  if (/(import\s+Foundation|var\s+\w+:\s*\w+\s*=|func\s+\w+\s*\(.*\)\s*->\s*\w+|guard\s+let|@objc)/m.test(c)) return 'swift'
  if (/(^<\?php|echo\s+[\"\']|namespace\s+\w+;|\$\w+\s*=)/m.test(c)) return 'php'
  if (/(^package\s+main\b|func\s+\w+\s*\(|fmt\.(Print|Scan)|:=\s*make\(|go\s+func)/m.test(c)) return 'go'
  if (/(fn\s+\w+\s*\(|let\s+mut\s+|println!\(|use\s+std::|impl\s+\w+)/m.test(c)) return 'rust'
  if (/(public\s+(static\s+)?class|System\.out\.print|void\s+main\s*\(|@Override|import\s+java\.)/m.test(c)) return 'java'
  if (/(#include\s*<(iostream|vector|string|algorithm)|std::|cout\s*<<|cin\s*>>|namespace\s+std)/m.test(c)) return 'cpp'
  if (/(#include\s*<(stdio|stdlib|string|math)\.h>|printf\s*\(|scanf\s*\(|int\s+main\s*\()/m.test(c)) return 'c'
  if (/(^def |^class |^import |^from .+ import|print\s*\(|elif |lambda |:\s*$|__init__|self\.)/m.test(c)) return 'python'
  if (/(^\s*(def |end$|puts |require )|\.each\s*do|\.map\s*{)/m.test(c)) return 'ruby'
  if (/(^#!\/bin\/(bash|sh)|echo\s+|fi$|\[\[|\$\{?\w+\}?|\bgrep\b|\bawk\b)/m.test(c)) return 'bash'
  if (/(:\s*(string|number|boolean|void|any|never|unknown)\b|interface\s+\w+|type\s+\w+\s*=)/m.test(c)) return 'typescript'
  if (/(<-\s*function|\bggplot\b|library\s*\(|data\.frame\s*\()/m.test(c)) return 'r'
  if (/(local\s+\w+\s*=|ngx\.|io\.write)/m.test(c)) return 'lua'
  if (/(void\s+main\s*\(|Flutter|Widget|StatelessWidget|dart:)/m.test(c)) return 'dart'
  if (/(function\s+\w+|const\s+|let\s+|var\s+|console\.|=>\s*{|\bfetch\b|\bdocument\b)/m.test(c)) return 'javascript'
  return 'javascript'
}

// ── App ────────────────────────────────────────────────────────────────────
export default function App() {
  const [code, setCode]       = useState(`// 👋 Start typing — language auto-detected!\nfunction greet(name) {\n  return \`Hello, \${name}! 👋\`\n}\n\nconsole.log(greet("World"))`)
  const [lang, setLang]       = useState('javascript')
  const [review, setReview]   = useState('')
  const [loading, setLoading] = useState(false)
  const [dots, setDots]       = useState('')
  const [done, setDone]       = useState(false)

  // Live language detection
  useEffect(() => { setLang(detectLang(code)) }, [code])

  // Reset when user edits after a review
  useEffect(() => {
    if (done) { setDone(false); setReview('') }
  }, [code])

  // Animated dots
  useEffect(() => {
    if (!loading) { setDots(''); return }
    const id = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 400)
    return () => clearInterval(id)
  }, [loading])

  const L = LANGS[lang] || LANGS.javascript

  function highlight(c) {
    try {
      const g = Prism.languages[L.prism]
      return g ? Prism.highlight(c, g, L.prism) : c
    } catch { return c }
  }

  async function reviewCode() {
    if (loading) return
    setLoading(true)
    setReview('')
    setDone(false)

    // Smart prompt — AI decides if correct or wrong and responds accordingly
    const prompt = `You are an expert ${L.label} code reviewer.

Analyze the following ${L.label} code carefully.

If the code is CORRECT:
- Start with a brief "✅ Code looks good!" confirmation
- Explain what the code does in 1-2 sentences
- Give specific, actionable suggestions to improve it (performance, readability, best practices, edge cases)
- Show improved code snippets where helpful

If the code has ERRORS or BUGS:
- Start with "❌ Found issues in your code"
- Clearly explain what is wrong and why
- Point out the exact problematic lines
- Provide the fully corrected working code in a code block

Be direct, concise, and developer-friendly. Use markdown formatting.

\`\`\`${L.prism}
${code}
\`\`\``

    try {
      const res = await axios.post('http://localhost:3000/ai/get-review', { code: prompt })
      setReview(res.data)
      setDone(true)
    } catch {
      setReview('**Connection Error**\n\nCould not reach `localhost:3000`. Make sure your backend server is running.')
      setDone(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="shell">
      <div className="bg-mesh" />
      <div className="orb o1" /><div className="orb o2" />
      <div className="orb o3" /><div className="orb o4" />

      {/* ── Header ── */}
      <header className="glass-bar">
        <div className="brand">
          <div className="brand-gem">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="url(#hg)" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="url(#hg)" strokeWidth="1.8" strokeLinejoin="round"/>
              <defs><linearGradient id="hg" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse"><stop stopColor="#e879f9"/><stop offset="1" stopColor="#22d3ee"/></linearGradient></defs>
            </svg>
          </div>
          <span className="brand-name">code<em>review</em>.ai</span>
        </div>

        {/* Live language badge */}
        <div className="lang-pill" style={{ '--lc': L.color, '--lg': L.glow }}>
          <span className="lang-pip" />
          <span className="lang-icon">{L.icon}</span>
          <span className="lang-name">{L.label}</span>
          <span className="lang-auto">auto-detected</span>
        </div>

        <div className="header-right">
          <div className="stat">{code.split('\n').length}<span>lines</span></div>
          <div className="stat">{code.length}<span>chars</span></div>
        </div>
      </header>

      {/* ── Column labels ── */}
      <div className="col-labels">
        <div className="col-label">
          <span className="col-dot" style={{ background: '#a78bfa' }} />
          Code
        </div>
        <div className="col-label">
          <span className="col-dot" style={{ background: '#22d3ee' }} />
          AI Review
        </div>
      </div>

      {/* ── Workspace ── */}
      <main className="workspace">

        {/* LEFT — Editor */}
        <div className="glass-panel panel-left">
          <div className="glass-edge-top" />
          <div className="glass-edge-left" />

          <div className="editor-scroll">
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={highlight}
              padding={24}
              style={{
                fontFamily: '"Fira Code","Cascadia Code","JetBrains Mono",monospace',
                fontSize: 13.5,
                lineHeight: 1.9,
                minHeight: '100%',
                background: 'transparent',
                color: '#e2e8f0',
                caretColor: L.color,
              }}
            />
          </div>

          <div className="btn-dock">
            <button
              className={`glass-btn btn-review ${loading ? 'busy' : ''} ${done ? 'btn-done' : ''}`}
              onClick={reviewCode}
              disabled={loading}
            >
              {loading ? (
                <><span className="spin" />Reviewing{dots}</>
              ) : done ? (
                <><CheckIcon /> Review Again</>
              ) : (
                <><AIIcon /> AI Review</>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT — AI Review */}
        <div className="glass-panel panel-right">
          <div className="glass-edge-top" style={{ '--edge-color': 'rgba(34,211,238,0.6)' }} />
          <div className="glass-edge-right" />

          <div className="review-scroll">

            {/* Empty state */}
            {!review && !loading && (
              <div className="empty">
                <div className="empty-sphere">
                  <div className="sphere-inner"><AIIcon size={32} /></div>
                </div>
                <p className="empty-h">AI Code Review</p>
                <p className="empty-p">
                  Paste your code and click <strong>AI Review</strong>.<br />
                  <span className="flow-step"><span className="flow-num">✓</span> If correct — suggestions to improve</span>
                  <span className="flow-step"><span className="flow-num">✗</span> If wrong — explanation + fixed code</span>
                </p>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="ai-loading">
                <div className="ai-orb">
                  <div className="ai-ring ar1"/><div className="ai-ring ar2"/><div className="ai-ring ar3"/>
                  <div className="ai-core"/>
                </div>
                <p className="ai-label">Reviewing your {L.label} code{dots}</p>
                <p className="ai-sub">Checking correctness · best practices · improvements</p>
              </div>
            )}

            {/* Review result */}
            {review && !loading && (
              <div className="md-body">
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{review}</ReactMarkdown>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  )
}

function AIIcon({ size = 13 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
}
function CheckIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
}