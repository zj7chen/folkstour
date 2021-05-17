import React, { useState } from "react";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import { DateRangePicker } from "react-dates";
import moment from "moment";

// Used a date picker from https://github.com/airbnb/react-dates/blob/master/README.md

// date: must be moment.js date
function momentToDate(date) {
  return date.format("YYYY-MM-DD");
}

// value: { start: "YYYY-MM-DD" | null, end: "YYYY-MM-DD" | null }
function DateInput(props) {
  const [focusedInput, setFocusedInput] = useState();

  return (
    <div>
      <DateRangePicker
        startDate={props.value.start ? moment(props.value.start) : null}
        endDate={props.value.end ? moment(props.value.end) : null}
        startDateId={props.id + "_start"}
        endDateId={props.id + "_end"}
        onDatesChange={({ startDate, endDate }) => {
          props.onChange({
            start: startDate ? momentToDate(startDate) : null,
            end: endDate ? momentToDate(endDate) : null,
          });
        }}
        focusedInput={focusedInput}
        onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
        appendToBody
      />
    </div>
  );
}

export default DateInput;
