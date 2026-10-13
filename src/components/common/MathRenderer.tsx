import React, { useMemo } from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
}

// Render a single LaTeX string safely to HTML
function renderLatex(tex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(tex.trim(), {
      displayMode,
      throwOnError: false,
      output: 'html',
      strict: false,
    });
  } catch (err) {
    console.warn('KaTeX render error:', err);
    return `<span class="font-mono text-rose-500">${tex}</span>`;
  }
}

// Parse inline text containing inline math `$ ... $` and `\( ... \)` and markdown bold/italic
function parseInlineContent(text: string): React.ReactNode[] {
  // Regex to match math: $...$ or \(...\)
  const mathRegex = /(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\))/g;

  const parts = text.split(mathRegex);

  return parts.map((part, idx) => {
    if (!part) return null;

    // Block math in inline flow
    if (part.startsWith('$$') && part.endsWith('$$')) {
      const tex = part.slice(2, -2);
      const html = renderLatex(tex, true);
      return (
        <span
          key={idx}
          className="block my-2 overflow-x-auto max-w-full text-center"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }

    if (part.startsWith('\\[') && part.endsWith('\\]')) {
      const tex = part.slice(2, -2);
      const html = renderLatex(tex, true);
      return (
        <span
          key={idx}
          className="block my-2 overflow-x-auto max-w-full text-center"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }

    // Inline math: $...$ or \(...\)
    if (
      (part.startsWith('$') && part.endsWith('$') && part.length > 2) ||
      (part.startsWith('\\(') && part.endsWith('\\)'))
    ) {
      const tex = part.startsWith('$') ? part.slice(1, -1) : part.slice(2, -2);
      const html = renderLatex(tex, false);
      return (
        <span
          key={idx}
          className="inline-math inline px-0.5"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }

    // Regular text: parse markdown bold, inline code
    return <span key={idx}>{parseBasicMarkdown(part)}</span>;
  });
}

// Lightweight parser for bold, italics, inline code
function parseBasicMarkdown(text: string): React.ReactNode[] {
  // Split on bold **...** and inline code `...`
  const mdRegex = /(\*\*[^*]+?\*\*|`[^`]+?`|\*[^*]+?\*)/g;
  const tokens = text.split(mdRegex);

  return tokens.map((token, i) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return <strong key={i} className="font-bold text-slate-900">{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith('`') && token.endsWith('`')) {
      return (
        <code key={i} className="px-1.5 py-0.5 rounded bg-stone-100 text-rose-800 font-mono text-[11px]">
          {token.slice(1, -1)}
        </code>
      );
    }
    if (token.startsWith('*') && token.endsWith('*') && token.length > 2) {
      return <em key={i} className="italic text-stone-700">{token.slice(1, -1)}</em>;
    }
    return token;
  });
}

export const MathRenderer: React.FC<MathRendererProps> = ({ content, className = '' }) => {
  const renderedElements = useMemo(() => {
    if (!content) return null;

    // Split text into paragraphs and blocks
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let inBlockMath = false;
    let blockMathContent: string[] = [];

    lines.forEach((line, lineIdx) => {
      // Check block math start/end
      if (line.trim().startsWith('$$') && line.trim().endsWith('$$') && line.trim().length > 4) {
        const tex = line.trim().slice(2, -2);
        const html = renderLatex(tex, true);
        elements.push(
          <div
            key={`math-block-${lineIdx}`}
            className="my-3 overflow-x-auto max-w-full text-center p-2 rounded-xl bg-stone-50/70 border border-stone-200/60 shadow-2xs"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
        return;
      }

      if (line.trim() === '$$') {
        if (inBlockMath) {
          // End of block math
          const tex = blockMathContent.join('\n');
          const html = renderLatex(tex, true);
          elements.push(
            <div
              key={`math-block-${lineIdx}`}
              className="my-3 overflow-x-auto max-w-full text-center p-2 rounded-xl bg-stone-50/70 border border-stone-200/60 shadow-2xs"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
          blockMathContent = [];
          inBlockMath = false;
        } else {
          inBlockMath = true;
        }
        return;
      }

      if (inBlockMath) {
        blockMathContent.push(line);
        return;
      }

      // Check code block
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre
              key={`code-${lineIdx}`}
              className="p-3 my-2 rounded-2xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800"
            >
              <code>{codeBlockContent.join('\n')}</code>
            </pre>
          );
          codeBlockContent = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      // Headers
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={`h3-${lineIdx}`} className="text-sm font-bold text-slate-900 mt-3 mb-1.5 flex items-center gap-1.5">
            {parseInlineContent(line.slice(4))}
          </h3>
        );
        return;
      }

      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={`h2-${lineIdx}`} className="text-base font-extrabold text-slate-900 mt-3.5 mb-2 border-b border-stone-100 pb-1">
            {parseInlineContent(line.slice(3))}
          </h2>
        );
        return;
      }

      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={`h1-${lineIdx}`} className="text-lg font-black text-slate-900 mt-4 mb-2">
            {parseInlineContent(line.slice(2))}
          </h1>
        );
        return;
      }

      // Horizontal separator
      if (line.trim() === '---' || line.trim() === '***') {
        elements.push(<hr key={`hr-${lineIdx}`} className="my-3 border-stone-200" />);
        return;
      }

      // Bullet lists
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const bulletText = line.trim().slice(2);
        elements.push(
          <div key={`bullet-${lineIdx}`} className="flex items-start gap-2 my-1 pl-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-1.5 shrink-0" />
            <div className="flex-1 leading-relaxed text-slate-800">
              {parseInlineContent(bulletText)}
            </div>
          </div>
        );
        return;
      }

      // Numbered lists (e.g. 1. , 2. )
      const numMatch = line.trim().match(/^(\d+)\.\s+(.*)$/);
      if (numMatch) {
        const num = numMatch[1];
        const rest = numMatch[2];
        elements.push(
          <div key={`num-${lineIdx}`} className="flex items-start gap-2 my-1 pl-1">
            <span className="font-bold text-slate-900 font-sans text-[11px] shrink-0 mt-0.5">
              {num}.
            </span>
            <div className="flex-1 leading-relaxed text-slate-800">
              {parseInlineContent(rest)}
            </div>
          </div>
        );
        return;
      }

      // Empty line
      if (!line.trim()) {
        elements.push(<div key={`spacer-${lineIdx}`} className="h-1.5" />);
        return;
      }

      // Normal paragraph line
      elements.push(
        <div key={`p-${lineIdx}`} className="leading-relaxed my-0.5 text-slate-800">
          {parseInlineContent(line)}
        </div>
      );
    });

    return elements;
  }, [content]);

  return <div className={`math-content text-xs leading-relaxed space-y-0.5 ${className}`}>{renderedElements}</div>;
};
