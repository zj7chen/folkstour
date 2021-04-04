import csv
import json
from collections import defaultdict


def read_csv(filename):
    with open(filename, newline='') as csvfile:
        reader = csv.reader(csvfile)
        next(reader)
        # province -> city -> [lat, lng]
        city_info = defaultdict(dict)
        for row in reader:
            city_info[row[3]][row[0]] = [row[6], row[7]]

        return city_info


country_info = {
    "Canada": read_csv("canadacities.csv"),
    "US": read_csv("uscities.csv"),
}

with open("cities.json", "w") as citiesfile:
    json.dump(country_info, citiesfile)
