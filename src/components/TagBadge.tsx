import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface TransactionTag {
  label: string;
  category: string;
  subItems?: string[];
}

const tagColors: Record<string, string> = {
  department: "bg-info/15 text-info border-info/30",
  project: "bg-primary/15 text-primary border-primary/30",
  client: "bg-warning/15 text-warning border-warning/30",
};

interface TagBadgeProps {
  tag: TransactionTag;
}

export function TagBadge({ tag }: TagBadgeProps) {
  const colorClass = tagColors[tag.category] || "bg-muted text-muted-foreground border-border";

  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge variant="outline" className={`${colorClass} text-[11px] font-medium cursor-default`}>
          {tag.label}
        </Badge>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-[200px]">
        <p className="text-xs font-medium mb-1 capitalize">{tag.category}</p>
        {tag.subItems && tag.subItems.length > 0 && (
          <ul className="text-xs text-muted-foreground space-y-0.5">
            {tag.subItems.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
