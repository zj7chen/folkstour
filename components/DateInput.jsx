import React, { useState } from "react";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import { DateRangePicker } from "react-dates";

// Used a date picker from https://github.com/airbnb/react-dates/blob/master/README.md

function DateInput() {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [focusedInput, setFocusedInput] = useState();

  return (
    <DateRangePicker
      startDate={startDate}
      startDateId="start-date"
      endDate={endDate}
      endDateId="end-date"
      onDatesChange={({ startDate, endDate }) => {
        setStartDate(startDate);
        setEndDate(endDate);
      }}
      focusedInput={focusedInput}
      onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
    />
  );
}

export default DateInput;
