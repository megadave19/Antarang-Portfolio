import { useEffect } from "react";
import { track } from "@vercel/analytics";

/**
 * Reads identification + UTM params from the URL on first mount and fires a
 * single custom Vercel Analytics event so the dashboard can attribute the
 * visit to a specific recipient or campaign.
 *
 * Conventions (see README "Tracking" section):
 *   ?u=<recipient-id>            — personalised link sent to a specific person
 *   ?utm_source=<src>            — standard UTM tags from shared links / posts
 *   ?utm_medium=<med>
 *   ?utm_campaign=<camp>
 *
 * Deduped per browser session so a single visitor doesn't generate N events
 * if they click around the SPA.
 *
 * No PII is captured beyond the values WE choose to put in the URL when WE
 * share the link. No fingerprinting, no IP lookup — fully GDPR-friendly when
 * paired with @vercel/analytics' default cookieless tracking.
 */
export function useVisitorTracking() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const u = params.get("u") || undefined;
    const utm_source = params.get("utm_source") || undefined;
    const utm_medium = params.get("utm_medium") || undefined;
    const utm_campaign = params.get("utm_campaign") || undefined;
    const utm_content = params.get("utm_content") || undefined;

    // Nothing to log if the URL is plain.
    if (!u && !utm_source && !utm_campaign) return;

    // Dedupe per session: one event per unique (id × source × campaign) combo.
    const dedupeKey = `ag-visit:${u ?? ""}|${utm_source ?? ""}|${utm_campaign ?? ""}`;
    try {
      if (sessionStorage.getItem(dedupeKey)) return;
      sessionStorage.setItem(dedupeKey, "1");
    } catch {
      // sessionStorage can throw in private-mode iOS Safari; proceed without dedupe
    }

    // Vercel Analytics custom events accept string / number / boolean values
    // only. Skip undefined fields so they don't render as the literal string
    // "undefined" in the dashboard.
    const payload: Record<string, string> = {};
    if (u) payload.id = u;
    if (utm_source) payload.source = utm_source;
    if (utm_medium) payload.medium = utm_medium;
    if (utm_campaign) payload.campaign = utm_campaign;
    if (utm_content) payload.content = utm_content;

    track("visitor", payload);
  }, []);
}
