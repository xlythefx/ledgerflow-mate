import { forwardRef } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { User, FolderOpen, Briefcase } from "lucide-react";

export interface TransactionTag {
  label: string;
  category: string;
  subItems?: string[];
  employees?: string[];
}

const tagColors: Record<string, string> = {
  department: "bg-info/15 text-info border-info/30 hover:bg-info/25",
  project: "bg-primary/15 text-primary border-primary/30 hover:bg-primary/25",
  client: "bg-warning/15 text-warning border-warning/30 hover:bg-warning/25",
};

const categoryIcons: Record<string, React.ElementType> = {
  department: User,
  project: FolderOpen,
  client: Briefcase,
};

const TooltipBadge = forwardRef<HTMLDivElement, { className: string; children: React.ReactNode }>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} {...props}>
      <Badge variant="outline" className={className}>
        {children}
      </Badge>
    </div>
  )
);
TooltipBadge.displayName = "TooltipBadge";

interface TagBadgeProps {
  tag: TransactionTag;
}

export function TagBadge({ tag }: TagBadgeProps) {
  const colorClass = tagColors[tag.category] || "bg-muted text-muted-foreground border-border";
  const Icon = categoryIcons[tag.category];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <TooltipBadge className={`${colorClass} text-[11px] font-medium cursor-pointer transition-colors`}>
          {tag.label}
        </TooltipBadge>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-[240px] p-3">
        <div className="flex items-center gap-1.5 mb-2">
          {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
          <span className="text-xs font-semibold capitalize">{tag.category}: {tag.label}</span>
        </div>

        {tag.employees && tag.employees.length > 0 && (
          <div className="mb-2">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">People</p>
            <div className="flex flex-wrap gap-1">
              {tag.employees.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-1 text-[11px] bg-accent px-1.5 py-0.5 rounded"
                >
                  <User className="h-2.5 w-2.5" />
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}

        {tag.subItems && tag.subItems.length > 0 && (
          <div>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Related</p>
            <ul className="text-xs text-muted-foreground space-y-0.5">
              {tag.subItems.map((item) => (
                <li key={item} className="flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
