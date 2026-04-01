import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { parseReason, segmentColors } from "@/data/reasons";

interface ReasonBadgesProps {
  reason: string;
}

export function ReasonBadges({ reason }: ReasonBadgesProps) {
  const { segments } = parseReason(reason);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex gap-1 flex-wrap cursor-pointer">
          {segments.map((segment, i) => {
            const colorClass = segmentColors[i] ?? segmentColors[2];
            return (
              <Badge
                key={`${segment}-${i}`}
                variant="outline"
                className={`${colorClass} text-[11px] font-medium transition-colors`}
              >
                {segment}
              </Badge>
            );
          })}
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-[300px] p-3">
        <p className="text-xs font-semibold">Full Reason</p>
        <p className="text-xs text-muted-foreground mt-1">{reason}</p>
      </TooltipContent>
    </Tooltip>
  );
}
