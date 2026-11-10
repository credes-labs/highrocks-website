import { Svg } from "@/components/ui/Svg";

/** "⏱ 10 min | 📅 2 hours ago" row used on every article card. */
export function ArticleMeta({
  readTime,
  posted,
  dateTime,
  className = "",
}: {
  readTime: string;
  posted: string;
  /** ISO date for the <time> element. */
  dateTime?: string;
  className?: string;
}) {
  return (
    <p
      className={`flex items-center gap-[11px] text-[10px] font-light capitalize leading-[22.75px] tracking-[0.07em] text-muted ${className}`}
    >
      <span className="flex items-center gap-[7px]">
        <Svg name="pages/clock" width={16} height={15} className="h-[14px] w-[15px]" />
        {readTime}
      </span>
      <Svg name="pages/meta-divider" width={16} height={1} className="h-px w-4 rotate-90" />
      <span className="flex items-center gap-[9px]">
        <Svg name="pages/calendar-small" width={12} height={15} className="h-[14px] w-[11px]" />
        {dateTime ? <time dateTime={dateTime}>{posted}</time> : posted}
      </span>
    </p>
  );
}
