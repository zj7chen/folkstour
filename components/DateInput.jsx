import ArrowForwardOutline from "components/icons/ArrowForwardOutline";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import styles from "./DateInput.module.css";

function DateInput({ id, value, onChange, onBlur }) {
  const { start, end } = value;
  return (
    <InputGroup>
      <Form.Control
        id={`${id}_start`}
        type="date"
        value={start}
        max={end}
        onChange={(e) =>
          onChange?.({
            start: e.currentTarget.value,
            end,
          })
        }
        onBlur={onBlur}
      />
      <div className={styles.separator}>
        <span className="inline-icon">
          <ArrowForwardOutline />
        </span>
      </div>
      <Form.Control
        id={`${id}_end`}
        type="date"
        min={start}
        value={end}
        onChange={(e) =>
          onChange?.({
            start,
            end: e.currentTarget.value,
          })
        }
        onBlur={onBlur}
      />
    </InputGroup>
  );
}

export default DateInput;
