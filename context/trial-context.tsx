"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { isGuestUser, isRegisteredUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/client";
import { markProfileRegistered } from "@/lib/supabase/profiles";
import { getTrialUsageCounts } from "@/lib/supabase/trial-counts";
import {
  LIMIT_MODAL_MESSAGE,
  RETENTION_MODAL_MESSAGE,
  TRIAL_CAST_LIMIT,
  TRIAL_REPLY_LIMIT,
} from "@/lib/trial/constants";
import {
  clearLegacyTrialTriggerStorage,
  hasShownTrialTrigger,
  markTrialTriggerShown,
  type TrialTriggerKey,
} from "@/lib/trial/storage";
import { useUser } from "@/hooks/use-user";
import { SignupRetentionModal } from "@/components/auth/signup-retention-modal";

export type SignupModalVariant = "retention" | "limit";

interface TrialContextValue {
  isGuest: boolean;
  isRegistered: boolean;
  castCount: number;
  replyCount: number;
  loading: boolean;
  showInboxChatGate: boolean;
  dismissInboxChatGate: () => void;
  guardCast: () => boolean;
  guardReply: () => boolean;
  notifyCastSuccess: () => void;
  notifyReplySuccess: () => void;
  promptInboxChatSignup: () => void;
  triggerRouteSignupPrompt: (route: "inbox" | "profile") => void;
  openSignupModal: (variant: SignupModalVariant) => void;
  refreshUsage: () => Promise<void>;
}

const TrialContext = createContext<TrialContextValue | null>(null);

export function TrialProvider({ children }: { children: ReactNode }) {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [castCount, setCastCount] = useState(0);
  const [replyCount, setReplyCount] = useState(0);
  const [usageLoading, setUsageLoading] = useState(true);
  const [modalVariant, setModalVariant] = useState<SignupModalVariant | null>(
    null
  );
  const [showInboxChatGate, setShowInboxChatGate] = useState(false);
  const pendingRetentionKey = useRef<TrialTriggerKey | null>(null);

  const isGuest = isGuestUser(user);
  const isRegistered = isRegisteredUser(user);
  const userId = user?.id;

  useEffect(() => {
    clearLegacyTrialTriggerStorage();
  }, []);

  const refreshUsage = useCallback(async () => {
    if (!user) {
      setCastCount(0);
      setReplyCount(0);
      setUsageLoading(false);
      return;
    }

    setUsageLoading(true);
    const supabase = createClient();
    const { castCount: casts, replyCount: replies } = await getTrialUsageCounts(
      supabase,
      user.id
    );
    setCastCount(casts);
    setReplyCount(replies);
    setUsageLoading(false);
  }, [user]);

  useEffect(() => {
    void refreshUsage();
  }, [refreshUsage]);

  useEffect(() => {
    if (!isRegistered || !user) return;
    const supabase = createClient();
    void markProfileRegistered(supabase, user.id);
  }, [isRegistered, user]);

  const acknowledgeRetentionModal = useCallback(() => {
    const key = pendingRetentionKey.current;
    if (!key || !userId) return;
    markTrialTriggerShown(userId, key);
    pendingRetentionKey.current = null;
  }, [userId]);

  const openSignupModal = useCallback((variant: SignupModalVariant) => {
    setModalVariant(variant);
  }, []);

  const closeSignupModal = useCallback(() => {
    setModalVariant((current) => {
      if (current === "retention") {
        acknowledgeRetentionModal();
      }
      return null;
    });
  }, [acknowledgeRetentionModal]);

  const showRetentionOnce = useCallback(
    (key: TrialTriggerKey) => {
      if (!isGuest || !userId) return;
      if (hasShownTrialTrigger(userId, key)) return;
      if (pendingRetentionKey.current === key && modalVariant === "retention") {
        return;
      }

      pendingRetentionKey.current = key;
      openSignupModal("retention");
    },
    [isGuest, userId, modalVariant, openSignupModal]
  );

  const guardAction = useCallback(
    (kind: "cast" | "reply") => {
      if (!isGuest) return true;

      const count = kind === "cast" ? castCount : replyCount;
      const limit = kind === "cast" ? TRIAL_CAST_LIMIT : TRIAL_REPLY_LIMIT;

      if (count >= limit) {
        pendingRetentionKey.current = null;
        openSignupModal("limit");
        return false;
      }

      return true;
    },
    [castCount, isGuest, openSignupModal, replyCount]
  );

  const guardCast = useCallback(() => guardAction("cast"), [guardAction]);
  const guardReply = useCallback(() => guardAction("reply"), [guardAction]);

  const notifyCastSuccess = useCallback(() => {
    setCastCount((count) => count + 1);
    showRetentionOnce("firstCast");
  }, [showRetentionOnce]);

  const notifyReplySuccess = useCallback(() => {
    setReplyCount((count) => count + 1);
    showRetentionOnce("firstReply");
  }, [showRetentionOnce]);

  const promptInboxChatSignup = useCallback(() => {
    setShowInboxChatGate(true);
  }, []);

  const dismissInboxChatGate = useCallback(() => {
    setShowInboxChatGate(false);
  }, []);

  const triggerRouteSignupPrompt = useCallback(
    (route: "inbox" | "profile") => {
      if (!isGuest) return;
      showRetentionOnce(route === "inbox" ? "inbox" : "profile");
    },
    [isGuest, showRetentionOnce]
  );

  useEffect(() => {
    if (!isGuest || userLoading) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (castCount + replyCount === 0) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [castCount, isGuest, replyCount, userLoading]);

  useEffect(() => {
    if (!isGuest || userLoading) return;
    if (pathname === "/inbox") {
      triggerRouteSignupPrompt("inbox");
    } else if (pathname === "/profile") {
      triggerRouteSignupPrompt("profile");
    }
  }, [isGuest, pathname, triggerRouteSignupPrompt, userLoading]);

  useEffect(() => {
    pendingRetentionKey.current = null;
    setModalVariant(null);
  }, [userId]);

  const modalMessage =
    modalVariant === "limit" ? LIMIT_MODAL_MESSAGE : RETENTION_MODAL_MESSAGE;

  const value = useMemo(
    () => ({
      isGuest,
      isRegistered,
      castCount,
      replyCount,
      loading: userLoading || usageLoading,
      showInboxChatGate,
      dismissInboxChatGate,
      guardCast,
      guardReply,
      notifyCastSuccess,
      notifyReplySuccess,
      promptInboxChatSignup,
      triggerRouteSignupPrompt,
      openSignupModal,
      refreshUsage,
    }),
    [
      isGuest,
      isRegistered,
      castCount,
      replyCount,
      userLoading,
      usageLoading,
      showInboxChatGate,
      dismissInboxChatGate,
      guardCast,
      guardReply,
      notifyCastSuccess,
      notifyReplySuccess,
      promptInboxChatSignup,
      triggerRouteSignupPrompt,
      openSignupModal,
      refreshUsage,
    ]
  );

  const handleModalAcknowledge = useCallback(() => {
    if (modalVariant === "retention") {
      acknowledgeRetentionModal();
    }
  }, [acknowledgeRetentionModal, modalVariant]);

  return (
    <TrialContext.Provider value={value}>
      {children}
      <SignupRetentionModal
        open={modalVariant !== null}
        variant={modalVariant ?? "retention"}
        message={modalMessage}
        onClose={closeSignupModal}
        onAcknowledge={handleModalAcknowledge}
        onSignedUp={() => {
          closeSignupModal();
          router.refresh();
        }}
      />
    </TrialContext.Provider>
  );
}

export function useTrial() {
  const context = useContext(TrialContext);
  if (!context) {
    throw new Error("useTrial must be used within a TrialProvider");
  }
  return context;
}

export function useTrialOptional() {
  return useContext(TrialContext);
}
