"use client";

import * as React from "react";

export type CalendarProps = {
  className?: string;
};

function Calendar({ className }: CalendarProps) {
  return (
    <div className={className}>
      <p>Calendar temporarily disabled</p>
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };