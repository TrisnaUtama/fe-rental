import { format, addDays, eachDayOfInterval } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { toast } from "sonner";

interface DatePickerWithRangeProps {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  className?: string;
  disabledDates?: Date[];
  fixedDuration?: number;
}

export function DatePickerWithRange({
  value,
  onChange,
  className,
  disabledDates = [], 
  fixedDuration,
}: DatePickerWithRangeProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0); 

  const handleSelect = (range: DateRange | undefined) => {
    if (!fixedDuration) {
      onChange(range);
      if (range?.to) setPopoverOpen(false);
      return;
    }

    if (range?.from) {
      const fromDate = range.from;
      const toDate = addDays(fromDate, fixedDuration - 1);
      const newRange = { from: fromDate, to: toDate };

      const intervalDates = eachDayOfInterval({ start: newRange.from, end: newRange.to });
      const isInvalid = intervalDates.some((day) =>
        disabledDates.some(
          (disabledDay) =>
            format(day, "yyyy-MM-dd") === format(disabledDay, "yyyy-MM-dd")
        )
      );

      if (isInvalid) {
        onChange(undefined);
        toast.warning(
          "The selected date range includes unavailable dates. Please pick another start date."
        );
      } else {
        onChange(newRange);
        setPopoverOpen(false);
      }
    } else {
      onChange(range);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "LLL dd, y")} -{" "}
                  {format(value.to, "LLL dd, y")}
                </>
              ) : (
                format(value.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a start date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={[...disabledDates, { before: tomorrow }]}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}