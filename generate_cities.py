#!/usr/bin/env python3
import csv
import json
from collections import defaultdict


def read_csv(filename, lat, lng):
    with open(filename, newline='') as csvfile:
        reader = csv.reader(csvfile)
        next(reader)
        # province -> city -> [lat, lng]
        city_info = defaultdict(dict)
        for row in reader:
            city_info[row[3]][row[0]] = [float(row[lng]), float(row[lat])]

        return city_info


country_info = {
    "Canada": read_csv("canadacities.csv", lat=4, lng=5),
    "US": read_csv("uscities.csv", lat=6, lng=7),
}

with open("cities.json", "w") as citiesfile:
    json.dump(country_info, citiesfile)
