import { auth } from "@clerk/nextjs/server";
import { ConversationsContent } from "@/components/shared/conversations-content";
import { getGeneratedReplies } from "@/app/actions/conversations";
import { getProfiles } from "@/app/actions/profile";

export default async function ConversationsPage() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const [replies, profiles] = await Promise.all([
    getGeneratedReplies(),
    getProfiles(),
  ]);

  return (
    <>
      {/* Header */}
      <div className="px-4 sm:px-5 py-3 flex items-center justify-between border-b border-border">
        <div>
          <h3 className="text-base sm:text-xl font-medium tracking-tight text-foreground">
            Conversations
          </h3>
          <p className="text-sm sm:text-sm text-muted-foreground">
            View and manage your past generated replies and conversations.
          </p>
        </div>
        {/* Upload functionality commented out for now */}
        {/* <Button className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500 text-white text-sm font-medium tracking-tight px-3 py-1.5 hover:bg-sky-400 h-auto">
          <Upload className="h-3.5 w-3.5" />
          Upload Thread
        </Button> */}
      </div>

      {/* Content */}
      <div className="pt-4">
        {/* Upload area - commented out for now */}
        {/* <Card className="rounded-xl border-dashed border-border bg-card/60 p-6 sm:p-8 space-y-3 text-center">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-lg bg-sky-500/10 border border-sky-500/40 flex items-center justify-center">
              <Upload className="h-6 w-6 text-sky-400" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground">
              Upload conversation threads
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              Drop screenshots, text files, or paste conversation history
            </p>
          </div>
          <Button
            variant="outline"
            className="inline-flex items-center gap-1.5 rounded-lg border-border bg-card text-sm text-foreground px-4 py-2 hover:bg-muted"
          >
            <Upload className="h-4 w-4" />
            Browse files
          </Button>
        </Card> */}

        {/* Conversation list with filter */}
        <ConversationsContent replies={replies} profiles={profiles} />
      </div>
    </>
  );
}
