import numpy as np
import pandas as pd

carbonData = pd.read_csv('../foodEmissions.csv')

#Drop the year column because we dont need it
carbonData = carbonData.drop('Year', axis=1)


print(carbonData.head())

#Test out the querying by looking for the carbon footprint of mushrooms:
print(carbonData[carbonData['Entity'] == "Mushrooms"])



