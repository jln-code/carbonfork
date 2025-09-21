#The goal of this file is to look at a picture and send it to gemini pro vision. 
#Gemini will then look at the picture and determine what food is on the plate, and how much of it there is.
#The model will then output a json string and that string will be stored to a json file to be used by the carbon emission calculator


import vertexai
from vertexai.generative_models import GenerativeModel, Part
import json


#attaches vertexai project to google cloud
vertexai.init(project="carbonfork", location="us-central1")

# Load the image
# This can be later adapted to work with flask.
image_path = "picture4.jpg"
image_part = Part.from_data(data=open(image_path, "rb").read(), mime_type="image/jpeg")

#This is the prompt that tells gemini to calculate what food and how much. 
#The finger length should be a variable that can be inputed by the user to help the model gauge how much is on the plate.
finger_length = 3
prompt_text = f"""
I have a plate of food. Please identify the food items and estimate their portion sizes in grams, as well as looking at how much of the plate the food is taking up, and then estimate the volume of that specific food. If there is a hand in the picture, know that {finger_length} inches is the middle finger length. Otherwise use a standard plate size as refrence to the plate in the picture, or if you see other refrence points in the picture you think are more accurate, use those for scale as well. Provide the response as a JSON object with the keys 'food_item' and 'estimated_weight_grams' and 'volume_food'.
"""


#The no finger prompt:
# prompt_text = f"""
# I have a plate of food. Please identify the food items and estimate their portion sizes in grams, as well as looking at how much of the plate the food is taking up, and then estimate the volume of that specific food. Use a standard plate size as refrence to the plate in the picture, or if you see other refrence points in the picture you think are more accurate, use those for scale as well. Provide the response as a JSON object with the keys 'food_item' and 'estimated_weight_grams' and 'volume_food'.
# """

# Instantiate the model
model = GenerativeModel("gemini-2.5-pro")

# Generate the response using the google cloud
response = model.generate_content([image_part, prompt_text])

#Convert the response into a JSON file:
possibleJson = response.text
possibleJson = possibleJson[:len(possibleJson)-3]
possibleJson = possibleJson[8:]
# Print the output
try:
    with open("api_response.json", "w") as file:
        file.write(possibleJson)
    print(f"Successfully saved JSON string to api_response.json")
except Exception as e:
    print(f"An error occurred while writing the file: {e}")

#Print the raw cloud API response in the console.
print(response.text)
