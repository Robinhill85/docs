"""Forked subagents page code samples: CompiledSubAgent."""

from __future__ import annotations

# :snippet-start: forked-subagents-compiled-py
from deepagents import CompiledSubAgent, create_deep_agent
from langchain.agents import create_agent


def read_logs(path: str) -> str:
    """Read a log file."""
    return f"logs from {path}"


# A prebuilt graph with its own system prompt -- forking inherits the
# parent's message history only, not its system prompt.
incident_graph = create_agent(
    # KEEP MODEL
    model="claude-sonnet-4-6",
    tools=[read_logs],
    system_prompt="You are an incident postmortem writer.",
)

incident_responder = CompiledSubAgent(
    name="incident-responder",
    description="Continues an in-progress incident investigation and drafts the postmortem",
    runnable=incident_graph,
    mode="fork",
)

agent = create_deep_agent(
    model="claude-sonnet-4-6",
    tools=[read_logs],
    subagents=[incident_responder],
)
# :snippet-end:

# :remove-start:
assert agent is not None
# :remove-end:
