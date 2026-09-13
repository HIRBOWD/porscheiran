"use client";

import { useEffect } from "react";

// Persian and Arabic Unicode ranges, including presentation forms and zero-width joiners
const PERSIAN_CHAR_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u200C\u200D]/;
const LATIN_CHAR_REGEX = /[A-Za-z]/;

// Match contiguous Persian segments (words and intra-Persian punctuation/spaces)
const PERSIAN_PHRASE_REGEX = /([\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u200C\u200D]+(?:[\s\u200C\u200D،؛؟]+[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u200C\u200D]+)*)/g;

export default function PersianTypographyProvider() {
  useEffect(() => {
    if (typeof window === "undefined" || !document.body) return;

    const processElement = (root: Node) => {
      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode(node) {
            const val = node.nodeValue;
            if (!val || !val.trim() || !PERSIAN_CHAR_REGEX.test(val)) {
              return NodeFilter.FILTER_REJECT;
            }

            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;

            const tag = parent.tagName.toLowerCase();
            if (
              tag === "script" ||
              tag === "style" ||
              tag === "canvas" ||
              tag === "svg" ||
              tag === "code" ||
              tag === "pre" ||
              tag === "textarea" ||
              tag === "input" ||
              parent.closest("#showroom-canvas") ||
              parent.closest("canvas") ||
              parent.closest("svg")
            ) {
              return NodeFilter.FILTER_REJECT;
            }

            // Skip if immediate parent is already designated as persian
            if (
              parent.getAttribute("data-persian") === "true" ||
              parent.classList.contains("font-persian")
            ) {
              return NodeFilter.FILTER_REJECT;
            }

            return NodeFilter.FILTER_ACCEPT;
          },
        }
      );

      const candidateNodes: Text[] = [];
      let current: Node | null;
      while ((current = walker.nextNode())) {
        candidateNodes.push(current as Text);
      }

      for (const textNode of candidateNodes) {
        const text = textNode.nodeValue;
        if (!text || !text.trim() || !PERSIAN_CHAR_REGEX.test(text)) continue;

        const parent = textNode.parentElement;
        if (!parent) continue;

        const hasLatin = LATIN_CHAR_REGEX.test(text);

        if (!hasLatin) {
          // Pure Persian text: protect the container without disrupting children
          if (parent.childNodes.length === 1) {
            parent.setAttribute("data-persian", "true");
            parent.setAttribute("lang", "fa");
          } else {
            const span = document.createElement("span");
            span.setAttribute("data-persian", "true");
            span.setAttribute("lang", "fa");
            span.className = "font-persian";
            span.textContent = text;
            textNode.replaceWith(span);
          }
        } else {
          // Mixed Persian and Latin text: isolate Persian words so Latin words keep their uppercase tracking
          const fragment = document.createDocumentFragment();
          const parts = text.split(PERSIAN_PHRASE_REGEX);

          let hasReplacement = false;
          for (const part of parts) {
            if (!part) continue;
            if (PERSIAN_CHAR_REGEX.test(part)) {
              hasReplacement = true;
              const span = document.createElement("span");
              span.setAttribute("data-persian", "true");
              span.setAttribute("lang", "fa");
              span.className = "font-persian";
              span.textContent = part;
              fragment.appendChild(span);
            } else {
              fragment.appendChild(document.createTextNode(part));
            }
          }

          if (hasReplacement) {
            textNode.replaceWith(fragment);
          }
        }
      }
    };

    // Initial normalization pass
    processElement(document.body);

    // MutationObserver to automatically catch newly rendered or added Persian text
    let timeoutId: NodeJS.Timeout | null = null;

    const observer = new MutationObserver((mutations) => {
      let needsProcessing = false;

      for (const m of mutations) {
        if (m.type === "childList" && m.addedNodes.length > 0) {
          for (let i = 0; i < m.addedNodes.length; i++) {
            const node = m.addedNodes[i];
            if (node.nodeType === Node.ELEMENT_NODE) {
              const el = node as HTMLElement;
              if (el.getAttribute("data-persian") === "true") continue;
              const tag = el.tagName?.toLowerCase();
              if (tag === "canvas" || tag === "svg" || tag === "script") continue;
              needsProcessing = true;
              break;
            } else if (node.nodeType === Node.TEXT_NODE) {
              if (PERSIAN_CHAR_REGEX.test(node.nodeValue || "")) {
                needsProcessing = true;
                break;
              }
            }
          }
        } else if (m.type === "characterData") {
          const parent = m.target.parentElement;
          if (
            parent &&
            parent.getAttribute("data-persian") !== "true" &&
            PERSIAN_CHAR_REGEX.test(m.target.nodeValue || "")
          ) {
            needsProcessing = true;
          }
        }
        if (needsProcessing) break;
      }

      if (needsProcessing) {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          observer.disconnect();
          processElement(document.body);
          observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
          });
        }, 30);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  return null;
}
