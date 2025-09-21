import numpy as np
import pandas as pd
import json

carbonData = pd.read_csv('../foodEmissions.csv')

#Drop the year column because we dont need it
carbonData = carbonData.drop('Year', axis=1)

print(carbonData.head())

#Test out the querying by looking for the carbon footprint of mushrooms:
print(carbonData[carbonData['Entity'] == "Mushrooms"])


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
    print(carbonData[carbonData['Entity'] == item])






