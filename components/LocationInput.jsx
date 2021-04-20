import countries from "cities.json";
import { displayLocation } from "client/display";
import Fuse from "fuse.js";
import React, { useState } from "react";
import AsyncSelect from "react-select/async";

// type City = { country: string, province: string, city: string }

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

function cityToOption(value) {
  return { value, label: displayLocation(value) };
}

// props: {
//   value: City
//   onChange: (val: City) => void
// }
function LocationInput(props) {
  const [handle, setHandle] = useState();

  return (
    <AsyncSelect
      id={props.id}
      name={props.name}
      value={
        props.isMulti
          ? props.value.map((c) => cityToOption(c))
          : props.value
          ? cityToOption(props.value)
          : null
      }
      onChange={(selected) =>
        props.onChange(
          props.isMulti ? selected.map((o) => o.value) : selected.value
        )
      }
      placeholder={props.placeholder}
      isMulti={props.isMulti}
      cacheOptions
      loadOptions={(inputValue, callback) => {
        clearTimeout(handle);
        setHandle(
          setTimeout(() => {
            const result = fuse.search(inputValue, { limit: 4 });
            callback(result.map(({ item }) => cityToOption(item)));
          }, 300)
        );
      }}
      defaultOptions
    />
  );
}

export default LocationInput;
