"use client";

import { useEffect, useRef, useState } from "react";
import {
  categoryExists,
  filterCategorySuggestions,
  normalizeCategory,
} from "@/lib/category";
import { cn } from "@/lib/utils";

interface CategoryAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  error?: string;
  onBlur?: () => void;
}

export function CategoryAutocomplete({
  value,
  onChange,
  suggestions,
  error,
  onBlur,
}: CategoryAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = filterCategorySuggestions(value, suggestions);
  const normalized = normalizeCategory(value);
  const isNew =
    normalized.length > 0 && !categoryExists(value, suggestions);
  const showCreateOption = isNew && !filtered.includes(normalized);

  useEffect(() => {
    setHighlighted(0);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = showCreateOption
    ? [...filtered, `__create__:${normalized}`]
    : filtered;

  const selectOption = (option: string) => {
    if (option.startsWith("__create__:")) {
      onChange(option.replace("__create__:", ""));
    } else {
      onChange(option);
    }
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || options.length === 0) {
      if (e.key === "ArrowDown" && value) setOpen(true);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((i) => (i + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((i) => (i - 1 + options.length) % options.length);
    } else if (e.key === "Enter" && open) {
      e.preventDefault();
      selectOption(options[highlighted]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative flex-1 min-w-[160px]">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        placeholder="Type a category..."
        autoComplete="off"
        className={cn(
          "w-full rounded-md border bg-muted/30 px-3 py-1.5 text-sm capitalize transition-colors placeholder:normal-case placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-border",
          error
            ? "border-red-500/50"
            : value
              ? "border-border text-foreground"
              : "border-border/40 text-muted-foreground"
        )}
      />

      {open && (filtered.length > 0 || showCreateOption) && (
        <ul
          className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-lg"
          role="listbox"
        >
          {filtered.map((cat, i) => (
            <li key={cat} role="option" aria-selected={highlighted === i}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectOption(cat)}
                className={cn(
                  "flex w-full px-3 py-2 text-left text-[15px] capitalize transition-colors",
                  highlighted === i
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                {cat}
              </button>
            </li>
          ))}
          {showCreateOption && (
            <li
              role="option"
              aria-selected={highlighted === filtered.length}
            >
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectOption(`__create__:${normalized}`)}
                className={cn(
                  "flex w-full px-3 py-2 text-left text-sm transition-colors",
                  highlighted === filtered.length
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                Create &ldquo;{normalized}&rdquo;
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
