import { Card, CardContent } from "@/components/ui/card";

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="border-t border-slate-900 bg-slate-950">
      <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-8 sm:py-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-50">
              People who write a lot, reply with ReplyM8.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-xl">
              From founders to account managers, ReplyM8 keeps their tone consistent without burning
              all their focus on the inbox.
            </p>
          </div>
          <div className="text-xs text-slate-400">
            <span className="font-medium text-slate-200">4.9 / 5</span> average response quality
            rating
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="rounded-xl border-slate-800 bg-slate-950/90 p-4 sm:p-5 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-[0.7rem] font-medium">
                JS
              </div>
              <div>
                <div className="text-xs font-medium text-slate-100">Julia S.</div>
                <div className="text-[0.65rem] text-slate-400">Agency founder</div>
              </div>
            </div>
            <p className="text-sm text-slate-200 flex-1">
              &ldquo;ReplyM8 nails the nuance of how I talk to clients vs the team. It&apos;s like
              having a personal comms chief for my inbox.&rdquo;
            </p>
          </Card>

          <Card className="rounded-xl border-slate-800 bg-slate-950/90 p-4 sm:p-5 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-[0.7rem] font-medium">
                DM
              </div>
              <div>
                <div className="text-xs font-medium text-slate-100">David M.</div>
                <div className="text-[0.65rem] text-slate-400">Sales lead</div>
              </div>
            </div>
            <p className="text-sm text-slate-200 flex-1">
              &ldquo;I save at least an hour a day. The per-recipient profiles are the
              differentiator—follow-ups feel personal, not templated.&rdquo;
            </p>
          </Card>

          <Card className="rounded-xl border-slate-800 bg-slate-950/90 p-4 sm:p-5 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-[0.7rem] font-medium">
                AC
              </div>
              <div>
                <div className="text-xs font-medium text-slate-100">Amira C.</div>
                <div className="text-[0.65rem] text-slate-400">Product manager</div>
              </div>
            </div>
            <p className="text-sm text-slate-200 flex-1">
              &ldquo;It keeps me from overthinking every response. I still edit when it&apos;s
              sensitive, but 80% of replies go out as-is.&rdquo;
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}

