"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type AIAgent = "groq" | "openai";
export type GroqModel = "llama-3.1-8b-instant" | "llama-3.3-70b-versatile";

interface AIAgentSelectorProps {
  value: AIAgent;
  model?: GroqModel;
  onValueChange: (value: AIAgent) => void;
  onModelChange?: (model: GroqModel) => void;
}

export function AIAgentSelector({ value, model, onValueChange, onModelChange }: AIAgentSelectorProps) {
  const handleValueChange = (val: string) => {
    if (val === "groq-8b" || val === "groq-70b") {
      onValueChange("groq");
      if (onModelChange) {
        onModelChange(val === "groq-8b" ? "llama-3.1-8b-instant" : "llama-3.3-70b-versatile");
      }
    } else {
      onValueChange(val as AIAgent);
    }
  };

  const displayValue = value === "groq" 
    ? (model === "llama-3.3-70b-versatile" ? "groq-70b" : "groq-8b")
    : value;

  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-muted-foreground whitespace-nowrap">
        AI Agent
      </label>
      <Select value={displayValue} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[200px] h-7 text-xs [&>span]:truncate [&>span]:text-left">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="min-w-[200px]">
          <SelectItem value="groq-8b" className="text-xs">Groq (llama-3.1-8b-instant)</SelectItem>
          <SelectItem value="groq-70b" className="text-xs">Groq (llama-3.3-70b-versatile)</SelectItem>
          <SelectItem value="openai" className="text-xs">OpenAI (gpt-4o-mini)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

