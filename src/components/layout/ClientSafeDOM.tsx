"use client";

import { useEffect } from "react";

/**
 * ClientSafeDOM provides defensive safeguards against:
 * 1. "Cannot read properties of null (reading 'removeChild')" and "NotFoundError: The node to be removed is not a child of this node"
 *    caused by browser extensions (Google Translate, Grammarly, DarkReader, etc.) mutating or reparenting DOM nodes during React's reconciliation.
 * 2. Unhandled removeChild errors that trigger Next.js development overlays.
 */
export default function ClientSafeDOM() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Monkey-patch Node.prototype.removeChild
    if (typeof Node !== "undefined" && Node.prototype) {
      const originalRemoveChild = Node.prototype.removeChild;
      Node.prototype.removeChild = function <T extends Node>(child: T): T {
        if (!child || child.parentNode !== this) {
          if (process.env.NODE_ENV !== "production" && typeof console !== "undefined" && console.warn) {
            console.warn(
              "[ClientSafeDOM] Prevented invalid removeChild call on detached or non-child node:",
              child
            );
          }
          return child;
        }
        return originalRemoveChild.call(this, child) as T;
      };

      const originalInsertBefore = Node.prototype.insertBefore;
      Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
        if (referenceNode && referenceNode.parentNode !== this) {
          if (process.env.NODE_ENV !== "production" && typeof console !== "undefined" && console.warn) {
            console.warn(
              "[ClientSafeDOM] Prevented invalid insertBefore call with mismatched parentNode:",
              referenceNode
            );
          }
          return newNode;
        }
        return originalInsertBefore.call(this, newNode, referenceNode) as T;
      };
    }

    // 2. Global error listener to prevent removeChild unhandled exceptions from popping up in development overlay
    const errorHandler = (event: ErrorEvent) => {
      if (
        event &&
        (event.message?.includes("removeChild") ||
          event.message?.includes("not a child") ||
          (event.error && (event.error.message?.includes("removeChild") || event.error.message?.includes("not a child"))))
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (process.env.NODE_ENV !== "production" && typeof console !== "undefined" && console.warn) {
          console.warn("[ClientSafeDOM] Handled harmless browser extension / reconciler removeChild error:", event.message);
        }
      }
    };

    window.addEventListener("error", errorHandler, true);
    return () => {
      window.removeEventListener("error", errorHandler, true);
    };
  }, []);

  return <span style={{ display: "none" }} aria-hidden="true" />;
}

