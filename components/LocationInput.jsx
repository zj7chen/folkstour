import countries from "cities.json";
import Fuse from "fuse.js";
import React, { useState } from "react";
import AsyncSelect from "react-select/async";

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

function locationToString(location) {
  if (!location) return "";
  return `${location.city}, ${location.province}, ${location.country}`;
}

function LocationInput(props) {
  const [value, setValue] = useState(null);
  const [handle, setHandle] = useState();
  console.log(value);

  return (
    <AsyncSelect
      id={props.field.id}
      name={props.field.name}
      value={props.form.value}
      onChange={({ value }) =>
        props.form.setFieldValue(props.field.name, value)
      }
      placeholder={props.placeholder}
      cacheOptions
      loadOptions={(inputValue, callback) => {
        clearTimeout(handle);
        setHandle(
          setTimeout(() => {
            const result = fuse.search(inputValue, { limit: 4 });
            callback(
              result.map(({ item }) => ({
                value: item,
                label: locationToString(item),
              }))
            );
          }, 300)
        );
      }}
      // 这又是啥？其余by default？
      defaultOptions
    />
  );
}

export default LocationInput;
