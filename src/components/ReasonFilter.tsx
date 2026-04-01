import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import { useMemo } from "react";
import { REASON_LIST, getSegmentHierarchy } from "@/data/reasons";

interface ReasonFilterProps {
  category: string;
  department: string;
  project: string;
  onCategoryChange: (v: string) => void;
  onDepartmentChange: (v: string) => void;
  onProjectChange: (v: string) => void;
}

export function ReasonFilter({
  category,
  department,
  project,
  onCategoryChange,
  onDepartmentChange,
  onProjectChange,
}: ReasonFilterProps) {
  const hierarchy = useMemo(() => getSegmentHierarchy([...REASON_LIST]), []);

  const level2Options = useMemo(() => {
    if (category === "all") return [];
    return hierarchy.level2Map[category] ?? [];
  }, [category, hierarchy]);

  const level3Options = useMemo(() => {
    if (category === "all" || department === "all") return [];
    const key = `${category}||${department}`;
    return hierarchy.level3Map[key] ?? [];
  }, [category, department, hierarchy]);

  const handleCategoryChange = (v: string) => {
    onCategoryChange(v);
    onDepartmentChange("all");
    onProjectChange("all");
  };

  const handleDepartmentChange = (v: string) => {
    onDepartmentChange(v);
    onProjectChange("all");
  };

  return (
    <>
      <Select value={category} onValueChange={handleCategoryChange}>
        <SelectTrigger className="w-[160px] bg-card border-border">
          <Filter className="h-3.5 w-3.5 mr-1" />
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Reasons</SelectItem>
          {hierarchy.level1.map((l) => (
            <SelectItem key={l} value={l}>{l}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {level2Options.length > 0 && (
        <Select value={department} onValueChange={handleDepartmentChange}>
          <SelectTrigger className="w-[160px] bg-card border-border">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {level2Options.map((l) => (
              <SelectItem key={l} value={l}>{l}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {level3Options.length > 0 && (
        <Select value={project} onValueChange={onProjectChange}>
          <SelectTrigger className="w-[180px] bg-card border-border">
            <SelectValue placeholder="Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {level3Options.map((l) => (
              <SelectItem key={l} value={l}>{l}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </>
  );
}
