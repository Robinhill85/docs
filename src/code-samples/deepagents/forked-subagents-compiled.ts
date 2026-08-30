// :snippet-start: forked-subagents-compiled-js
import { CompiledSubAgent, createDeepAgent } from "deepagents";
import { createAgent, tool } from "langchain";
import { z } from "zod";

const readLogs = tool(
  async ({ path }: { path: string }) => `logs from ${path}`,
  {
    name: "read_logs",
    description: "Read a log file",
    schema: z.object({ path: z.string() }),
  },
);

// A prebuilt graph with its own system prompt -- forking inherits the
// parent's message history only, not its system prompt.
const incidentGraph = createAgent({
  // KEEP MODEL
  model: "claude-sonnet-4-6",
  tools: [readLogs],
  prompt: "You are an incident postmortem writer.",
});

const incidentResponder: CompiledSubAgent = {
  name: "incident-responder",
  description: "Continues an in-progress incident investigation and drafts the postmortem",
  runnable: incidentGraph,
  mode: "fork",
};

const agent = await createDeepAgent({
  // KEEP MODEL
  model: "claude-sonnet-4-6",
  tools: [readLogs],
  subagents: [incidentResponder],
});
// :snippet-end:

// :remove-start:
if (!agent) throw new Error("agent not created");
console.log("✓ forked-subagents-compiled validated");
// :remove-end:
