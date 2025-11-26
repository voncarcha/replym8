"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type AIAgent = "groq" | "openai";

interface AIAgentSelectorProps {
  value: AIAgent;
  onValueChange: (value: AIAgent) => void;
}

export function AIAgentSelector({ value, onValueChange }: AIAgentSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-muted-foreground whitespace-nowrap">
        AI Agent
      </label>
      <Select value={value} onValueChange={(val) => onValueChange(val as AIAgent)}>
        <SelectTrigger className="w-[150px] h-7 text-xs [&>span]:truncate [&>span]:text-left">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="min-w-[150px]">
          <SelectItem value="groq" className="text-xs">Groq (llama-3.3-70b-versatile)</SelectItem>
          <SelectItem value="openai" className="text-xs">OpenAI (gpt-4o-mini)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

