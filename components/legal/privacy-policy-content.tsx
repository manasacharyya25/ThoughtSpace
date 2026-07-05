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

export function PrivacyPolicyContent() {
  return (
    <article className="feed-card space-y-8 p-6 sm:p-8">
      <header className="space-y-2 border-b border-border/40 pb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-heading sm:text-3xl">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground">
          Effective date: {legal.effectiveDate}
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {legal.operatorName} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
          &ldquo;our&rdquo;) operates {env.NEXT_PUBLIC_APP_NAME} at{" "}
          <a
            href={legal.siteUrl}
            className="text-foreground underline-offset-2 hover:underline"
          >
            {legal.siteUrl}
          </a>{" "}
          (the &ldquo;Service&rdquo;). This Privacy Policy explains how we
          collect, use, and protect your information when you use the Service.
        </p>
      </header>

      <Section title="1. Who we are">
        <p>
          The Service is operated by {legal.operatorName}. For privacy-related
          questions, contact us at{" "}
          <a
            href={`mailto:${legal.contactEmail}`}
            className="text-foreground underline-offset-2 hover:underline"
          >
            {legal.contactEmail}
          </a>
          .
        </p>
      </Section>

      <Section title="2. Information we collect">
        <p>
          <strong className="font-medium text-foreground">
            Account and authentication
          </strong>
          <br />
          When you create an account or sign in, we collect your email address
          and authentication data from your sign-in method (email/password or
          Google OAuth). If you sign in with Google, we receive information
          Google provides, such as your email address and basic profile
          information Google shares with us.
        </p>
        <p>
          <strong className="font-medium text-foreground">
            Profile information
          </strong>
          <br />
          When you complete onboarding, we collect your username, age range,
          gender (and optional self-described gender), country, and bio.
        </p>
        <p>
          <strong className="font-medium text-foreground">
            Content you create
          </strong>
          <br />
          We store content you submit on the Service, including posts
          (&ldquo;thoughts&rdquo;), responses to posts, and private messages in
          one-to-one conversations.
        </p>
        <p>
          <strong className="font-medium text-foreground">
            Usage and technical data
          </strong>
          <br />
          We may collect limited technical information such as device or browser
          type and general usage data through analytics tools to understand how
          the Service is used and to improve it.
        </p>
      </Section>

      <Section title="3. How we use your information">
        <p>We use your information to:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Provide, operate, and maintain the Service</li>
          <li>Authenticate you and manage your account</li>
          <li>
            Display your profile and content to other users as designed by the
            Service
          </li>
          <li>Enable private conversations between users</li>
          <li>Send service-related communications (e.g. account verification)</li>
          <li>Monitor, analyze, and improve the Service</li>
          <li>Protect the security and integrity of the Service</li>
        </ul>
        <p>We do not sell your personal information.</p>
      </Section>

      <Section title="4. How we share information">
        <p>
          <strong className="font-medium text-foreground">Other users</strong>
          <br />
          Your username, profile details, posts, and responses are visible to
          other authenticated users according to how the Service works. Private
          messages are visible only to participants in that conversation.
        </p>
        <p>
          <strong className="font-medium text-foreground">
            Service providers
          </strong>
          <br />
          We use trusted third parties to run the Service, including Supabase
          (authentication, database, and hosting of user data), Google (OAuth
          sign-in, if you choose that option), and Vercel (application hosting
          and analytics). These providers process data on our behalf under
          their own privacy policies and our agreements with them.
        </p>
        <p>
          <strong className="font-medium text-foreground">
            Legal requirements
          </strong>
          <br />
          We may disclose information if required by law or to protect the
          rights, safety, and security of {legal.operatorName}, our users, or
          others.
        </p>
      </Section>

      <Section title="5. Data retention">
        <p>
          We retain your information while your account is active and as needed
          to provide the Service. If you delete your account or request
          deletion, we will delete or anonymize your personal data within a
          reasonable period, except where we must retain it for legal or
          legitimate business purposes.
        </p>
      </Section>

      <Section title="6. Your choices and rights">
        <p>
          Depending on where you live, you may have rights to access, correct, or
          delete your personal information. To exercise these rights, contact{" "}
          <a
            href={`mailto:${legal.contactEmail}`}
            className="text-foreground underline-offset-2 hover:underline"
          >
            {legal.contactEmail}
          </a>
          . We will respond within a reasonable time.
        </p>
        <p>
          You can update profile information from your account settings in the
          app. You may sign out at any time. To delete your account, contact us
          at the email above.
        </p>
      </Section>

      <Section title="7. Security">
        <p>
          We use reasonable technical and organizational measures to protect
          your information. No method of transmission or storage is completely
          secure; we cannot guarantee absolute security.
        </p>
      </Section>

      <Section title="8. Children">
        <p>
          The Service is intended for users 18 years of age and older. We do not
          knowingly collect personal information from anyone under 18. If you
          believe a minor has provided us information, contact us and we will
          delete it.
        </p>
      </Section>

      <Section title="9. International users">
        <p>
          Your information may be processed in countries where we or our
          service providers operate. By using the Service, you consent to that
          processing.
        </p>
      </Section>

      <Section title="10. Third-party links and services">
        <p>
          The Service may link to or integrate with third-party services (such
          as Google sign-in). Their privacy practices are governed by their own
          policies. We encourage you to review them.
        </p>
      </Section>

      <Section title="11. Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. We will post the
          updated version on this page and update the effective date. Continued
          use of the Service after changes means you accept the updated policy.
        </p>
      </Section>

      <Section title="12. Contact us">
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
