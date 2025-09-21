import numpy as np
import pandas as pd
import json

carbonData = pd.read_csv('../longerEmissions.csv')

#Drop the entity column because we dont need it
carbonData = carbonData.drop('Entity', axis=1)

print(carbonData.head())

#We want to find the middle point between the two C02e values, so we must do that here
for index, row in carbonData.iterrows():
    value = row["CO2e"]
    if "-" in value:
        value_parts = value.split('-')

        value_low = float(value_parts[0])
        print(value_low)

        value_high = float(value_parts[1])
        print(f"The high value is: {value_high}")
        if value_high != value_low:
            value_new = value_high - ((value_high - value_low)/2)
        else:
            value_new = value_high
        carbonData.at[index, "CO2e"] = value_new

print(carbonData.head())

#Test out the querying by looking for the carbon footprint of mushrooms:
print(carbonData[carbonData['Name'] == "Mushrooms"])


#Open the json file to read the foods
try:
    with open("api_response.json", "r") as file:
        aiReturnData = json.load(file)
    food_items = [item["food_item"] for item in aiReturnData]
    print("Successfully loaded from the JSON file!!")
    print(food_items)
except FileNotFoundError:
    print(f"Error: The file 'api_response.json' was not found")
except json.JSONDecodeError:
    print(f"Error: The file 'api_response.json' contains invalid json")


#Using the food items that gemini found and put in the JSON file, look for them in the carbon emission CSV:
#If a food item is found, print out its spot in the CSV list and its carbon emission value per KG.
for item in food_items:
    print(f"Looking in the dataset for: {item}")
    print(carbonData[carbonData['Name'] == item])






