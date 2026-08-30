// :snippet-start: forked-subagents-basic-js
import { createDeepAgent } from "deepagents";
import { tool } from "langchain";
import { z } from "zod";

const readLogs = tool(
  async ({ path }: { path: string }) => `logs from ${path}`,
  {
    name: "read_logs",
    description: "Read a log file",
    schema: z.object({ path: z.string() }),
  },
);

const incidentResponder = {
  name: "incident-responder",
  description: "Continues an in-progress incident investigation and drafts the postmortem",
  mode: "fork" as const,
  tools: [readLogs],
};

const agent = await createDeepAgent({
  // KEEP MODEL
  model: "claude-sonnet-4-6",
  tools: [readLogs],
  subagents: [incidentResponder],
});

// The parent has already been investigating for several turns before
// delegating -- the fork continues with that full history, not a blank slate.
const result = await agent.invoke({
  messages: [
    { role: "user", content: "Investigate the outage in payment-service" },
    {
      role: "assistant",
      content: "Found a spike in 500s starting 14:02 UTC, tied to deploy a1b2c3d.",
    },
    { role: "user", content: "Hand this off to incident-responder to draft the postmortem" },
  ],
});
// :snippet-end:

// :remove-start:
if (!result) throw new Error("result not created");
console.log("✓ forked-subagents-basic validated");
// :remove-end:
