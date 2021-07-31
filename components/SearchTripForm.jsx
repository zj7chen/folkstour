import { TEAM_SIZES, TRANSPORTS } from "client/choices";
import DateInput from "components/DateInput";
import LocationInput from "components/LocationInput";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";

function useInput(state, f) {
  const [value, setValue] = useState(f(state));

  // useEffect() executes callback only if the [state] have changed between renderings
  useEffect(() => {
    setValue(f(state));
  }, [state]);

  return [value, setValue];
}

// update dates [start, end]
function parseDates(dates) {
  if (!dates) return { start: "", end: "" };
  const [start, end] = dates.split(",");
  return { start, end };
}

function SearchTripForm(props) {
  const router = useRouter();

  const [title, setTitle] = useInput(router.query.title, (d) => d ?? "");
  const location = router.query.location
    ? JSON.parse(router.query.location)
    : null;
  const [dates, setDates] = useInput(router.query.dates, parseDates);
  const teamSize = router.query.teamsize
    ? router.query.teamsize.split(",")
    : [];
  const transports = router.query.transports
    ? router.query.transports.split(",")
    : [];
  const [expense, setExpense] = useInput(router.query.expense, (d) => d ?? "");

  function update(changes) {
    // FIXME: prevent navigation on unchanged params
    const { query } = router;
    for (const [key, val] of Object.entries(changes)) {
      if (val !== "") query[key] = val;
      else delete query[key];
    }
    router.push({ query });
  }

  return (
    <Form>
      <Form.Group controlId="title">
        <Form.Label>Title</Form.Label>
        <Form.Control
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") update({ title });
          }}
          onBlur={() => update({ title })}
          placeholder="Narrow by trip title"
        />
      </Form.Group>

      <Form.Group controlId="location">
        <Form.Label>Location</Form.Label>
        <LocationInput
          name="location"
          value={location}
          onChange={(location) =>
            update({ location: location ? JSON.stringify(location) : "" })
          }
          placeholder="Narrow by location"
        />
      </Form.Group>

      <Form.Group controlId="dates">
        <Form.Label>Choose your dates</Form.Label>
        <DateInput
          name="dates"
          value={dates}
          onChange={({ start, end }) => {
            setDates({ start, end });
            update({
              dates: start && end ? [start, end].join(",") : "",
            });
          }}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Team Size</Form.Label>
        <div>
          {Object.entries(TEAM_SIZES).map(([key, { displayText }]) => (
            <Form.Check
              inline
              id={`teamSize-${key}`}
              key={key}
              label={displayText}
              checked={teamSize.indexOf(key) !== -1}
              type="checkbox"
              onChange={(e) =>
                update({
                  teamsize: (e.target.checked
                    ? [...teamSize, key]
                    : teamSize.filter((t) => t !== key)
                  ).join(","),
                })
              }
            />
          ))}
        </div>
      </Form.Group>

      <Form.Group>
        <Form.Label>Transport</Form.Label>
        <div>
          {Object.entries(TRANSPORTS).map(([key, { displayText }]) => (
            <Form.Check
              inline
              id={`transport-${key}`}
              key={key}
              label={displayText}
              checked={transports.indexOf(key) !== -1}
              type="checkbox"
              onChange={(e) =>
                update({
                  transports: (e.target.checked
                    ? [...transports, key]
                    : transports.filter((t) => t !== key)
                  ).join(","),
                })
              }
            />
          ))}
        </div>
      </Form.Group>

      <Form.Group controlId="expense">
        <Form.Label>Expected Expense (under $/day)</Form.Label>
        <Form.Control
          type="number"
          value={expense}
          onChange={(e) => setExpense(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") update({ expense });
          }}
          onBlur={() => update({ expense })}
          placeholder="e.g. 300"
        />
      </Form.Group>
    </Form>
  );
}

export default SearchTripForm;
