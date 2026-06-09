"use client";

import { useState } from "react";
import {
  ChatInput,
  ChatThreadView,
  ThreadList,
} from "@/components/chat";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { chatThreads } from "@/data";
import { currentUser } from "@/data/users";

export function InboxPage() {
  const [activeThreadId, setActiveThreadId] = useState(chatThreads[0]?.id);
  const activeThread = chatThreads.find((t) => t.id === activeThreadId);

  return (
    <div className="mx-auto w-full max-w-4xl">
      <PageHeader
        title="Inbox"
        description="Private conversations — respond when something moves you"
      />

      <div className="grid gap-4 md:grid-cols-[280px_1fr]">
        <Card className="hidden md:block">
          <CardContent>
            <ThreadList
              threads={chatThreads}
              activeId={activeThreadId}
              onSelect={setActiveThreadId}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            {activeThread ? (
              <>
                <p className="mb-4 text-sm font-medium">
                  {activeThread.participant.name}
                </p>
                <ChatThreadView
                  thread={activeThread}
                  currentUserId={currentUser.id}
                />
                <ChatInput />
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Select a conversation
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 md:hidden">
        <ThreadList
          threads={chatThreads}
          activeId={activeThreadId}
          onSelect={setActiveThreadId}
        />
      </div>
    </div>
  );
}
