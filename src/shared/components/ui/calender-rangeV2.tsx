import { format, addDays, eachDayOfInterval } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils"; 
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { toast } from "sonner"; 

interface DatePickerWithRangeV2Props {
  selected: DateRange | undefined; 
  onSelect: (range: DateRange | undefined) => void;
  className?: string;
  disabledDates?: Date[]; 
  fixedDuration?: number; 
}

export function DatePickerWithRangeV2({
  selected, 
  onSelect, 
  className,
  disabledDates = [],
  fixedDuration,
}: DatePickerWithRangeV2Props) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Removed 'tomorrow' variable and any logic that disables dates before today/tomorrow.
  // This means all historical dates are now selectable unless explicitly in `disabledDates` prop.

  const handleSelect = (range: DateRange | undefined) => {
    if (!fixedDuration) {
      onSelect(range); // Use 'onSelect'
      // Close popover only if 'to' date is selected for a range
      if (range?.to) {
        setPopoverOpen(false);
      }
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
        onSelect(undefined); 
        toast.warning(
          "The selected date range includes unavailable dates. Please pick another start date."
        );
      } else {
        onSelect(newRange); 
        setPopoverOpen(false); 
      }
    } else {
      onSelect(range);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date-picker-trigger" 
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal sm:w-[240px] md:w-[300px]", 
              !selected && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selected?.from ? (
              selected.to ? (
                <>
                  {format(selected.from, "LLL dd, y")} -{" "}
                  {format(selected.to, "LLL dd, y")}
                </>
              ) : (
               
                format(selected.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={selected?.from}
            selected={selected} 
            onSelect={handleSelect} 
            numberOfMonths={2}
            disabled={disabledDates} 
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}