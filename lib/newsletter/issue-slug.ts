const ISSUE_SLUG_PREFIX = "issue-";

/** Build public path segment: issue-04 */
export function toNewsletterIssueSlug(issueNum: string): string {
  const normalized = issueNum.trim();
  return `${ISSUE_SLUG_PREFIX}${normalized}`;
}

/** Parse issue-04 → 04; returns null if invalid */
export function parseNewsletterIssueSlug(slug: string): string | null {
  const trimmed = slug.trim();
  if (!trimmed.toLowerCase().startsWith(ISSUE_SLUG_PREFIX)) {
    return null;
  }

  const issueNum = trimmed.slice(ISSUE_SLUG_PREFIX.length).trim();
  if (!issueNum) {
    return null;
  }

  return issueNum;
}

export function newsletterIssuePath(issueNum: string): string {
  return `/newsletter/${toNewsletterIssueSlug(issueNum)}`;
}
