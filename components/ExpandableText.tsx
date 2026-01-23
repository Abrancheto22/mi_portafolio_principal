"use client";

import { useState } from 'react';

interface ExpandableTextProps {
  text: string;
  limit?: number;
}

export default function ExpandableText({ text, limit = 300 }: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Si el texto es corto, no necesita botón
  if (text.length <= limit) {
    return <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{text}</p>;
  }

  return (
    <div>
      <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
        {isExpanded ? text : `${text.substring(0, limit)}...`}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 text-blue-600 font-bold text-xs hover:text-blue-800 transition-colors uppercase tracking-tighter"
      >
        {isExpanded ? "↑ Ver menos" : "↓ Ver más completo"}
      </button>
    </div>
  );
}