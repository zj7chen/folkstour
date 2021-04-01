import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import LocationInput from "components/LocationInput";
import { useRouter } from "next/router";

function CreateTripForm(props) {
  const [departure, setDeparture] = useState(null);
  const [destination, setDestination] = useState(null);

  const router = useRouter();
  // teamSize options: "1-3", "4-6", "any"
  const teamSize = router.query.teamsize ?? "1-3";

  // transport allowed: "driving", "cycling", "trekking"
  // ?.是做什么的？ split() 不是不改original string吗？
  const transport = router.query.transport?.split() ?? [];

  // teamSize options: "any", "male", "female"
  const gender = router.query.gender ?? "any";

  return (
    <Form>
      <LocationInput
        id="departure"
        label="Departure"
        value={departure}
        onChange={setDeparture}
      />
      <LocationInput
        id="destination"
        label="Destination"
        value={destination}
        onChange={setDestination}
      />
      {/*此处需要加入集合日期，用calendar做*/}

      <div style={{ marginTop: 200 }} />

      <div>
        <Form.Label>Team Size</Form.Label>
        <Form.Check
          type="radio"
          id="teamsize_1-3"
          name="teamsize"
          value="1-3"
          label="1-3"
          checked={teamSize === "1-3"}
        />
        <Form.Check
          type="radio"
          id="teamsize_4-6"
          name="teamsize"
          value="4-6"
          label="4-6"
          checked={teamSize === "4-6"}
        />
        <Form.Check
          type="radio"
          id="teamsize_any"
          name="teamsize"
          value="any"
          label="Any"
          checked={teamSize === "any"}
        />
      </div>

      <div>
        <Form.Group>Transportation</Form.Group>
        <Button variant="primary" onClick={() => setDriving(true)}>
          Driving
        </Button>
        <Button variant="primary" onClick={() => setCycling(true)}>
          Cycling
        </Button>
        <Button variant="primary" onClick={() => setTrekking(true)}>
          Trekking
        </Button>
      </div>

      <div>
        <Form.Group>Gender Requirement</Form.Group>
        <Button variant="primary" onClick={() => setSexMale(true)}>
          Male
        </Button>
        <Button variant="primary" onClick={() => setSexFemale(true)}>
          Female
        </Button>
        <Button variant="primary" onClick={() => setSexAny(true)}>
          Any
        </Button>
      </div>
    </Form>
  );
}

export default CreateTripForm;
