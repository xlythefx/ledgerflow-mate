import { Circle } from "lucide-react";
import { useState, useEffect } from "react";

export function SyncIndicator() {
  const [lastSync, setLastSync] = useState(new Date());
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSyncing(true);
      setTimeout(() => {
        setSyncing(false);
        setLastSync(new Date());
      }, 800);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const timeAgo = Math.floor((Date.now() - lastSync.getTime()) / 1000);
  const label = syncing
    ? "Syncing..."
    : timeAgo < 5
    ? "Just synced"
    : `${timeAgo}s ago`;

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Circle
        className={`h-2 w-2 fill-current ${
          syncing ? "text-warning animate-pulse-dot" : "text-success"
        }`}
      />
      <span>{label}</span>
    </div>
  );
}
