import React from 'react';
import { ExternalLink } from 'lucide-react';

/**
 * FormattedDescription
 * Preserves newlines, paragraphs, and whitespace as entered in the text box.
 * Automatically recognizes and transforms Markdown links, raw URLs, bold text,
 * and inline code into safe, styled interactive elements.
 */

const TOKEN_REGEX = /(\[[^\]]+\]\((?:https?:\/\/[^\s)]+|www\.[^\s)]+)\)|https?:\/\/[^\s<]+[^<.,:;"')\]\s]|www\.[^\s<]+[^<.,:;"')\]\s]|\*\*[^*]+\*\*|`[^`]+`)/gi;

const parseTextWithLinks = (text, linkColorClass = 'text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300') => {
  if (!text) return null;

  const parts = text.split(TOKEN_REGEX);

  return parts.map((part, index) => {
    if (!part) return null;

    // 1. Markdown link: [title](url)
    const mdMatch = part.match(/^\[([^\]]+)\]\(((?:https?:\/\/|www\.)[^\s)]+)\)$/i);
    if (mdMatch) {
      const label = mdMatch[1];
      const rawUrl = mdMatch[2];
      const href = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
      return (
        <a
          key={`md-${index}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={`inline-flex items-center gap-1 font-semibold underline underline-offset-2 break-all transition-colors ${linkColorClass}`}
        >
          <span>{label}</span>
          <ExternalLink className="w-3 h-3 inline-block shrink-0 opacity-80" />
        </a>
      );
    }

    // 2. Raw URL: https://... or http://... or www....
    if (/^(https?:\/\/|www\.)/i.test(part)) {
      const href = part.startsWith('http') ? part : `https://${part}`;
      return (
        <a
          key={`url-${index}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={`inline-flex items-center gap-1 font-semibold underline underline-offset-2 break-all transition-colors ${linkColorClass}`}
        >
          <span>{part}</span>
          <ExternalLink className="w-3 h-3 inline-block shrink-0 opacity-80" />
        </a>
      );
    }

    // 3. Bold text: **text**
    const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);
    if (boldMatch) {
      return (
        <strong key={`b-${index}`} className="font-bold text-slate-900 dark:text-white">
          {boldMatch[1]}
        </strong>
      );
    }

    // 4. Inline code: `code`
    const codeMatch = part.match(/^`([^`]+)`$/);
    if (codeMatch) {
      return (
        <code
          key={`c-${index}`}
          className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 font-mono text-[0.88em] border border-slate-200/80 dark:border-zinc-700/80"
        >
          {codeMatch[1]}
        </code>
      );
    }

    // 5. Plain text segment
    return part;
  });
};

const FormattedDescription = ({
  text,
  className = '',
  linkColorClass = 'text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300'
}) => {
  if (!text) return null;

  return (
    <div
      className={`whitespace-pre-wrap break-words leading-relaxed font-sans ${className}`}
      style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
    >
      {parseTextWithLinks(text, linkColorClass)}
    </div>
  );
};

export default FormattedDescription;
