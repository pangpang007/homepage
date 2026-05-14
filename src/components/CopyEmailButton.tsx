"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";

type Props = {
  email: string;
};

export function CopyEmailButton({ email }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="focus-ring inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border-strong/80 bg-elevated/60 px-4 py-2.5 text-sm font-medium text-fg transition-colors duration-200 hover:border-accent-soft hover:text-accent-soft"
    >
      {copied ? (
        <Check className="h-4 w-4 text-gold" aria-hidden />
      ) : (
        <Mail className="h-4 w-4" aria-hidden />
      )}
      {copied ? "已复制邮箱" : "复制邮箱"}
    </button>
  );
}
