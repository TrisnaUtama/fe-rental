import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Label } from "./label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";

import { type DayPickerProps } from "react-day-picker"; 

export interface DatePickerProps {
  value?: Date;
  onChange: (date?: Date) => void;
  label?: string;
  placeholder?: string;
  id?: string;
  className?: string;
  disabled?: boolean | DayPickerProps["disabled"];
}

export function DatePicker({
  value,
  onChange,
  label,
  placeholder = "Select a date",
  id,
  className,
  disabled, // This is the prop passed from the parent
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  // This handles the case where 'disabled' is a boolean to disable the button entirely.
  // If `disabled` is an array of dates, this will be `false`, allowing the button to be clickable.
  const isButtonCompletelyDisabled = typeof disabled === 'boolean' && disabled;

  // This is the prop passed to the <Calendar /> component.
  // It correctly passes `true` (if disabled is boolean true) or the array of dates.
  const disabledForCalendar: DayPickerProps["disabled"] | undefined =
    typeof disabled === 'boolean' ? disabled : disabled;

  return (
    <div className="flex flex-col gap-2 w-fit">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={id}
            disabled={isButtonCompletelyDisabled} // Only disable the button if `disabled` is explicitly `true`
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !value && "text-muted-foreground",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange(date);
              setOpen(false);
            }}
            initialFocus
            disabled={disabledForCalendar}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
