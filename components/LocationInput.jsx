import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import styles from "./LocationInput.module.css";
import countries from "cities.json";
import Fuse from "fuse.js";
import { useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { forwardRef } from "react";

const cityList = [];
for (const [country, provinces] of Object.entries(countries)) {
  for (const [province, cities] of Object.entries(provinces)) {
    for (const city of cities) {
      cityList.push({ country, province, city });
    }
  }
}

const fuse = new Fuse(cityList, {
  keys: ["country", "province", "city"],
});

const QueryInput = forwardRef((props, ref) => {
  return (
    <Form.Control
      ref={ref}
      value={props.value}
      placeholder={props.placeholder}
      onChange={props.onChange}
      onClick={props.onClick}
    />
  );
});

function locationToString(location) {
  if (!location) return "";
  return `${location.city}, ${location.province}, ${location.country}`;
}

function LocationInput(props) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    console.log("schedule");
    const handle = setTimeout(() => {
      console.log("exec");
      const result = fuse.search(query, { limit: 4 });
      setResult(result);
    }, 200);
    return () => clearTimeout(handle);
  }, [query]);

  return (
    <Dropdown
      show={show && result.length > 0}
      onToggle={(isOpen, event, metadata) => {
        console.log(isOpen, event, metadata);
        setShow(isOpen);
      }}
    >
      <Dropdown.Toggle
        as={QueryInput}
        value={show ? query : locationToString(props.field.value)}
        placeholder={props.placeholder}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Dropdown.Menu>
        {result.map(({ item, refIndex }) => (
          <Dropdown.Item
            key={refIndex}
            onClick={() => {
              setQuery(locationToString(item));
              props.form.setFieldValue(props.field.name, item);
            }}
          >
            {locationToString(item)}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default LocationInput;
