import vertexai
from vertexai.generative_models import GenerativeModel, Part

#attaches vertexai project to google cloud
vertexai.init(project="carbonfork", location="us-central1")

# Load the image
image_path = "picture.jpeg"
image_part = Part.from_data(data=open(image_path, "rb").read(), mime_type="image/jpeg")

prompt_text = """
I have a plate of food. Please identify the food items and estimate their portion sizes in grams, as well as looking at how much of the plate the food is taking up, and then estimate the volume of that specific food. use a standard plate size as refrence to the plate in the picture, or if you see other refrence points in the picture you think are more accurate, use those for scale as well. Provide the response as a JSON object with the keys 'food_item' and 'estimated_weight_grams' and 'volume_food'.
"""

# Instantiate the model
model = GenerativeModel("gemini-2.5-pro")

# Generate the response
response = model.generate_content([image_part, prompt_text])

# Print the output
print(response.text)