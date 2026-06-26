import type { LucideIcon } from "lucide-react";
import {
  Calendar,
  Compass,
  Eye,
  Globe,
  Heart,
  Lightbulb,
  Lock,
  Mail,
  MessageCircle,
  MessagesSquare,
  Palette,
  Quote,
  Shield,
  Sparkles,
  Target,
  UserRound,
  Users,
  Waves,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ProfileFieldTone = "blue" | "peach" | "lilac" | "mint" | "slate";

const toneStyles: Record<
  ProfileFieldTone,
  { badge: string; icon: string; card: string }
> = {
  blue: {
    badge: "bg-[#EBF5FF] border-[#2F9CFA]/20",
    icon: "text-[#2F9CFA]",
    card: "from-[#EBF5FF]/80 to-white",
  },
  peach: {
    badge: "bg-[#FFF0EB] border-[#FFAB91]/25",
    icon: "text-[#FF8A65]",
    card: "from-[#FFF0EB]/70 to-white",
  },
  lilac: {
    badge: "bg-[#F3E8FF] border-[#B39DDB]/25",
    icon: "text-[#9C7BD4]",
    card: "from-[#F3E8FF]/70 to-white",
  },
  mint: {
    badge: "bg-[#E8F8F0] border-[#81C784]/25",
    icon: "text-[#5FAF7A]",
    card: "from-[#E8F8F0]/70 to-white",
  },
  slate: {
    badge: "bg-[#EDF0F1] border-[#1C1D1E]/10",
    icon: "text-[#1C1D1E]/70",
    card: "from-[#EDF0F1]/80 to-white",
  },
};

export type ProfileFieldKey =
  | "username"
  | "memberSince"
  | "bio"
  | "ageRange"
  | "gender"
  | "country"
  | "email"
  | "values"
  | "topics"
  | "communicationStyles"
  | "connectionGoals"
  | "greatConnection"
  | "impact"
  | "hobbies"
  | "conversationMeaning"
  | "conversationDepth"
  | "comfortableSharing"
  | "displayPreference"
  | "contentVisibility"
  | "surpriseFact"
  | "quote"
  | "superpower"
  | "personality"
  | "moreAboutYou"
  | "completeProfile"
  | "plan";

const fieldMeta: Record<
  ProfileFieldKey,
  { icon: LucideIcon; tone: ProfileFieldTone }
> = {
  username: { icon: UserRound, tone: "blue" },
  memberSince: { icon: Calendar, tone: "slate" },
  bio: { icon: MessageCircle, tone: "lilac" },
  ageRange: { icon: Calendar, tone: "blue" },
  gender: { icon: UserRound, tone: "lilac" },
  country: { icon: Globe, tone: "mint" },
  email: { icon: Mail, tone: "blue" },
  values: { icon: Heart, tone: "peach" },
  topics: { icon: Compass, tone: "blue" },
  communicationStyles: { icon: MessagesSquare, tone: "lilac" },
  connectionGoals: { icon: Users, tone: "blue" },
  greatConnection: { icon: Heart, tone: "peach" },
  impact: { icon: Target, tone: "mint" },
  hobbies: { icon: Palette, tone: "peach" },
  conversationMeaning: { icon: Lightbulb, tone: "lilac" },
  conversationDepth: { icon: Waves, tone: "blue" },
  comfortableSharing: { icon: Shield, tone: "mint" },
  displayPreference: { icon: Eye, tone: "slate" },
  contentVisibility: { icon: Lock, tone: "slate" },
  surpriseFact: { icon: Sparkles, tone: "peach" },
  quote: { icon: Quote, tone: "lilac" },
  superpower: { icon: Zap, tone: "blue" },
  personality: { icon: Sparkles, tone: "blue" },
  moreAboutYou: { icon: Target, tone: "mint" },
  completeProfile: { icon: Sparkles, tone: "blue" },
  plan: { icon: Zap, tone: "peach" },
};

export function getProfileFieldMeta(key: ProfileFieldKey) {
  return fieldMeta[key];
}

export function ProfileIconBadge({
  fieldKey,
  size = "md",
  className,
}: {
  fieldKey: ProfileFieldKey;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const meta = fieldMeta[fieldKey];
  const Icon = meta.icon;
  const tone = toneStyles[meta.tone];

  const sizeClass =
    size === "lg"
      ? "h-12 w-12 rounded-2xl [&_svg]:size-5"
      : size === "sm"
        ? "h-8 w-8 rounded-xl [&_svg]:size-3.5"
        : "h-10 w-10 rounded-xl [&_svg]:size-4";

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center border",
        sizeClass,
        tone.badge,
        className
      )}
      aria-hidden="true"
    >
      <Icon className={tone.icon} />
    </div>
  );
}

export function ProfileSectionHeader({
  fieldKey,
  title,
  description,
}: {
  fieldKey: ProfileFieldKey;
  title: string;
  description?: string;
}) {
  const meta = fieldMeta[fieldKey];

  return (
    <div className="flex items-start gap-3">
      <ProfileIconBadge fieldKey={fieldKey} />
      <div className="min-w-0">
        <h3
          className={cn(
            "text-base font-extrabold tracking-tight text-[#1C1D1E]",
            meta.tone === "blue" && "text-[#1C1D1E]"
          )}
        >
          {title}
        </h3>
        {description ? (
          <p className="mt-1 text-xs font-medium text-[#1C1D1E]/45">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function profileCardAccent(fieldKey: ProfileFieldKey) {
  return toneStyles[fieldMeta[fieldKey].tone].card;
}
