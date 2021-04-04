import React, { useState } from "react";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import { DateRangePicker } from "react-dates";

// Used a date picker from https://github.com/airbnb/react-dates/blob/master/README.md

function DateInput(props) {
  const [focusedInput, setFocusedInput] = useState();

  return (
    <DateRangePicker
      startDate={props.field.value?.start}
      endDate={props.field.value?.end}
      startDateId={props.field.id + "_start"}
      endDateId={props.field.id + "_end"}
      onDatesChange={({ startDate, endDate }) => {
        props.form.setFieldValue(props.field.name, {
          start: startDate,
          end: endDate,
        });
      }}
      focusedInput={focusedInput}
      onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
    />
  );
}

export default DateInput;
