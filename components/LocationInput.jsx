import countries from "cities.json";
import Fuse from "fuse.js";
import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import { displayLocation } from "client/display";

const cityList = [];
for (const [country, provinces] of Object.entries(countries)) {
  for (const [province, cities] of Object.entries(provinces)) {
    for (const [city] of Object.entries(cities)) {
      cityList.push({ country, province, city });
    }
  }
}

const fuse = new Fuse(cityList, {
  keys: ["country", "province", "city"],
});

function LocationInput(props) {
  const [handle, setHandle] = useState();

  return (
    <AsyncSelect
      id={props.field.id}
      name={props.field.name}
      value={props.form.value}
      onChange={(selected) => {
        props.form.setFieldValue(
          props.field.name,
          selected.map(({ value }) => value)
        );
      }}
      placeholder={props.placeholder}
      isMulti
      cacheOptions
      loadOptions={(inputValue, callback) => {
        clearTimeout(handle);
        setHandle(
          setTimeout(() => {
            const result = fuse.search(inputValue, { limit: 4 });
            callback(
              result.map(({ item }) => ({
                value: item,
                label: displayLocation(item),
              }))
            );
          }, 300)
        );
      }}
      defaultOptions
    />
  );
}

export default LocationInput;
