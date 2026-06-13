import Link from "next/link";
import { env } from "@/lib/env";
import { legal } from "@/lib/legal";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-semibold tracking-tight text-heading">
        {title}
      </h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

export function TermsOfServiceContent() {
  return (
    <article className="feed-card space-y-8 p-6 sm:p-8">
      <header className="space-y-2 border-b border-border/40 pb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-heading sm:text-3xl">
          Terms of Service
        </h1>
        <p className="text-sm text-muted-foreground">
          Effective date: {legal.effectiveDate}
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          These Terms of Service (&ldquo;Terms&rdquo;) govern your use of{" "}
          {env.NEXT_PUBLIC_APP_NAME} at{" "}
          <a
            href={legal.siteUrl}
            className="text-foreground underline-offset-2 hover:underline"
          >
            {legal.siteUrl}
          </a>{" "}
          (the &ldquo;Service&rdquo;), operated by {legal.operatorName}.
        </p>
      </header>

      <Section title="1. Agreement">
        <p>
          By creating an account or using the Service, you agree to these Terms
          and our{" "}
          <Link
            href="/privacy-policy"
            className="text-foreground underline-offset-2 hover:underline"
          >
            Privacy Policy
          </Link>
          . If you do not agree, do not use the Service.
        </p>
      </Section>

      <Section title="2. Eligibility">
        <p>
          You must be at least 18 years old to use the Service. By using the
          Service, you represent that you meet this requirement.
        </p>
      </Section>

      <Section title="3. Your account">
        <p>
          You are responsible for your account credentials and all activity
          under your account. Provide accurate information during registration
          and onboarding. Notify us at{" "}
          <a
            href={`mailto:${legal.contactEmail}`}
            className="text-foreground underline-offset-2 hover:underline"
          >
            {legal.contactEmail}
          </a>{" "}
          if you suspect unauthorized access.
        </p>
      </Section>

      <Section title="4. The Service">
        <p>
          {env.NEXT_PUBLIC_APP_NAME} is a thought-first social platform where
          users share posts, respond to others&rsquo; thoughts, and have private
          one-to-one conversations. We may change, suspend, or discontinue
          features at any time.
        </p>
      </Section>

      <Section title="5. Your content">
        <p>
          You retain ownership of content you post. You grant {legal.operatorName}{" "}
          a non-exclusive, worldwide license to host, store, display, and
          distribute your content solely to operate and improve the Service.
        </p>
        <p>
          You agree not to post content that is illegal, harassing, hateful,
          sexually exploitative, spam, impersonation, or that violates
          others&rsquo; rights. You are solely responsible for your content.
        </p>
      </Section>

      <Section title="6. Acceptable use">
        <p>You agree not to:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Harass, abuse, or harm other users</li>
          <li>
            Attempt to access others&rsquo; private conversations or data
            without authorization
          </li>
          <li>Scrape, reverse engineer, or disrupt the Service</li>
          <li>Use the Service for unlawful purposes</li>
        </ul>
        <p>
          We may remove content or suspend accounts that violate these Terms.
        </p>
      </Section>

      <Section title="7. Privacy">
        <p>
          Our{" "}
          <Link
            href="/privacy-policy"
            className="text-foreground underline-offset-2 hover:underline"
          >
            Privacy Policy
          </Link>{" "}
          explains how we collect and use your information.
        </p>
      </Section>

      <Section title="8. Third-party services">
        <p>
          The Service uses third parties (such as Supabase, Google sign-in, and
          Vercel). Your use of those services may be subject to their terms.
        </p>
      </Section>

      <Section title="9. Disclaimers">
        <p>
          The Service is provided &ldquo;as is&rdquo; without warranties of any
          kind. We do not guarantee uninterrupted or error-free operation.
        </p>
      </Section>

      <Section title="10. Limitation of liability">
        <p>
          To the fullest extent permitted by law, {legal.operatorName} shall not
          be liable for indirect, incidental, special, or consequential damages
          arising from your use of the Service.
        </p>
      </Section>

      <Section title="11. Termination">
        <p>
          You may stop using the Service at any time. We may suspend or
          terminate your account if you violate these Terms. Contact{" "}
          <a
            href={`mailto:${legal.contactEmail}`}
            className="text-foreground underline-offset-2 hover:underline"
          >
            {legal.contactEmail}
          </a>{" "}
          to request account deletion.
        </p>
      </Section>

      <Section title="12. Changes">
        <p>
          We may update these Terms from time to time. We will post the updated
          version on this page and update the effective date. Continued use of
          the Service after changes means you accept the updated Terms.
        </p>
      </Section>

      <Section title="13. Governing law">
        <p>
          These Terms are governed by the laws applicable in the jurisdiction
          where {legal.operatorName} operates, without regard to conflict-of-law
          principles.
        </p>
      </Section>

      <Section title="14. Contact us">
        <p>
          {legal.operatorName}
          <br />
          Email:{" "}
          <a
            href={`mailto:${legal.contactEmail}`}
            className="text-foreground underline-offset-2 hover:underline"
          >
            {legal.contactEmail}
          </a>
          <br />
          Website:{" "}
          <a
            href={legal.siteUrl}
            className="text-foreground underline-offset-2 hover:underline"
          >
            {legal.siteUrl}
          </a>
        </p>
      </Section>

      <footer className="border-t border-border/40 pt-6">
        <Link
          href="/"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back to {env.NEXT_PUBLIC_APP_NAME}
        </Link>
      </footer>
    </article>
  );
}
