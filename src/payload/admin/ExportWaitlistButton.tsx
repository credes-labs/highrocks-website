"use client";

import { Button } from "@payloadcms/ui";

/** “Export CSV” above the Waitlist list view. */
export function ExportWaitlistButton() {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "calc(var(--base) * 0.75)" }}>
      <Button el="anchor" url="/api/waitlist-signups/export" buttonStyle="secondary" size="small" newTab={false}>
        Export CSV
      </Button>
    </div>
  );
}
