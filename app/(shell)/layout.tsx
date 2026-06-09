import { AppShell } from "@/components/layout/app-shell";
import { ShellProviders } from "./providers";

export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ShellProviders>
      <AppShell>{children}</AppShell>
    </ShellProviders>
  );
}
