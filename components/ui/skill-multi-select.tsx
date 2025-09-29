"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronDown } from "lucide-react";
import { useSkills } from "@/hooks/use-skills";
import { Skill } from "@/types/interfaces";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SkillMultiSelectProps {
  value: Skill[];
  onChange: (skills: Skill[]) => void;
  placeholder?: string;
  disabled?: boolean;
  maxDisplay?: number;
}

export default function SkillMultiSelect({
  value,
  onChange,
  placeholder = "Select skills",
  disabled,
  maxDisplay = 3,
}: SkillMultiSelectProps) {
  const { data, isLoading } = useSkills({ page: 1, size: 300 });

  const allSkills: Skill[] = useMemo(() => {
    if (!data || data.status !== "success") return [];
    return data.data?.items || [];
  }, [data]);

  const isSelected = (skillId: number) =>
    value.some((s) => s.skillId === skillId);

  const toggleSkill = (skill: Skill) => {
    if (isSelected(skill.skillId)) {
      onChange(value.filter((s) => s.skillId !== skill.skillId));
    } else {
      onChange([...value, skill]);
    }
  };

  const displayText = useMemo(() => {
    if (!value || value.length === 0) return placeholder;
    const names = value.map((v) => v.name);
    const shown = names.slice(0, maxDisplay).join(", ");
    const extra = names.length - maxDisplay;
    return extra > 0 ? `${shown} +${extra}` : shown;
  }, [value, placeholder, maxDisplay]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between"
          disabled={disabled}
        >
          <span className={value.length === 0 ? "text-muted-foreground" : ""}>
            {displayText}
          </span>
          <ChevronDown className="h-4 w-4 opacity-70" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="start">
        <ScrollArea className="h-64">
          <div className="py-1">
            {isLoading && (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                Loading skills...
              </div>
            )}
            {!isLoading && allSkills.length === 0 && (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No skills available
              </div>
            )}
            {!isLoading &&
              allSkills.map((skill) => {
                const selected = isSelected(skill.skillId);
                return (
                  <button
                    key={skill.skillId}
                    type="button"
                    className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent ${selected ? "bg-accent" : ""
                      }`}
                    onClick={() => toggleSkill(skill)}
                  >
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-sm border ${selected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-muted-foreground/30"
                        }`}
                    >
                      {selected && <Check className="h-3 w-3" />}
                    </span>
                    <span>{skill.name}</span>
                  </button>
                );
              })}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
