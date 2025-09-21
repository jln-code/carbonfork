#The goal of this file is to look at a picture and send it to gemini pro vision. 
#Gemini will then look at the picture and determine what food is on the plate, and how much of it there is.
#The model will then output a json string and that string will be stored to a json file to be used by the carbon emission calculator

#Before you run this, you MUST auth your way into the google cloud with $ export GOOGLE_APPLICATION_CREDENTIALS="/absolute/path/sa-key.json"

import vertexai
from vertexai.generative_models import GenerativeModel, Part
import json


#attaches vertexai project to google cloud
vertexai.init(project="carbonfork", location="us-central1")

# Load the image
# This can be later adapted to work with flask.
image_path = "picture5.jpg"
image_part = Part.from_data(data=open(image_path, "rb").read(), mime_type="image/jpeg")

#This is the prompt that tells gemini to calculate what food and how much. 
#The finger length should be a variable that can be inputed by the user to help the model gauge how much is on the plate.
finger_length = 3
prompt_text = f"""
I have a plate of food. Please identify the food items and estimate their portion sizes in grams, as well as looking at how much of the plate the food is taking up, and then estimate the volume of that specific food. If there is a hand in the picture, know that {finger_length} inches is the middle finger length. Otherwise use a standard plate size as refrence to the plate in the picture, or if you see other refrence points in the picture you think are more accurate, use those for scale as well. Provide the response as a JSON object with the keys 'food_item' and 'estimated_weight_grams' and 'volume_food'. When you are detecting the type of food and returning the JSON, have the food item string your returning be something on the more basic side so that we can use a known carbon dataset, for EX: instead of 'southwest vegtable mix' break down that mix into what you see 'black beans, corn,' ect as different food items. Same for things like Popcorn chicken, should be more basic like 'chicken nugget' or 'breaded chicken'. Also attached is a CSV of a food name list that once you identify the food on the plate, you should pick the closet one on the list to put on the JSON. HOWEVER STILL USE THE WEIGHT FROM YOUR INITIAL PREDICTION NOT THE NEW FOOD NAME
"""


#The no finger prompt:
# prompt_text = f"""
# I have a plate of food. Please identify the food items and estimate their portion sizes in grams, as well as looking at how much of the plate the food is taking up, and then estimate the volume of that specific food. Use a standard plate size as refrence to the plate in the picture, or if you see other refrence points in the picture you think are more accurate, use those for scale as well. Provide the response as a JSON object with the keys 'food_item' and 'estimated_weight_grams' and 'volume_food'.
# """

# Instantiate the model
model = GenerativeModel("gemini-2.5-pro")

list_text = """
Beef
Dark chocolate
Lamb
Coffee
Shrimp
Cheese
Fish
Pork
Chicken
Egg
Rice
Peanut
Tofu
Milk
Oatmeal
Wine
Wheat
Rye grains
Berries
Grape
Pea
Potato
Apple
Barley
Cassava
Soymilk
Soy oil
Olive oil
Onion
Leeks
Sugar
Beer
Bottled water
Mineral water
Breakfast cereal
Crackers
Egg pasta
Frozen raspberries
Ice cream
Margarine
Dried pasta
Pesto
Tomato purée
Tomato sauce
Dried yeast
Boneless beef
Bone in beef
Butter
Fresh cheese
Hard cheese
Honey
Boneless lambs
Bone in lambs
Boneless pork
Bone in pork
Boneless poultry
Bone in poultry
Snails
Yogurt
Mushroom
Seed
Frozen fishes
Tapioca
Sweet potatoes
Yukon gold potatoes
Buffalo
Rabbit
Plain bread
Whole bread
Plain crackers
Orange juice
Croissant
Cream
Mozzarella cheese
Cheddar cheese
Ham
Boneless chickens
Boneless turkey
Bone in chickens
Lactose free yogurt
Plain yogurt
Raisins
Strawberries
Avocado
Banana
Pineapple
Melon
Mandarin
Orange
Apricot
Cherry
Kiwifruit
Mango
Peach
Nectarine
Pear
Quince
Olive
Blueberry
Oat
Quinoa
Cowpea
Green bean
Soy
Almond
Cashew
Hazelnut
Pistachio nuts
Walnut
Gherkin
Lettuce
Pepper
Tomato
Asparagus
Cabbage
Spinach
Carrot
Broccoli
Cauliflower
Cucumber
Eggplant
Pumpkin
Zucchini
Anchovy
Cod fishes
Hake
Mackerel
Salmon
Sardine
Sea bass
Seatrout
Tuna
Herring
Lobster
Mussel
Tea
Durum flour
Sorghum flour
Chocolate
Vanilla extract
Soymeal
Canned beans
Beans
Peanut butter
Peanut oil
Peeled tomatoes
Milk chocolate
Espresso
Ketchup
Mayonnaise
Raspberries
Apple juice
Mango juice
Pineapple juice
Canned carrots
Canned corn
Almondmilk
Coconut milk
White wine
Ricotta cheese
Asiago cheese
Camembert cheese
Emmental cheese
Goat cheese
Grana Padano cheese
Parmesan cheese
Pecorino cheese
Goat milk
Bacon
Merguez
Sausage
Duck
Date
Coconut
Pomegranate
Clementine
Lemon
Lime
Carob
Fig
Guava
Plum
Watermelon
Blackberry
Cranberry
Currant
Goose
Clementine
Lemon
Lime
Carob
Fig
Guava
Plum
Watermelon
Blackberry
Cranberry
Currant
Gooseberry
Chickpea
Lentil
Chestnut
Mix nuts
Sesame
Sunflower seeds
Ginger
Garlic
Radish
Rutabaga
Salsify
Turnip
Artichoke
Celery
Celeriac
Monkfish
Carp
Catfish
Haddock
Ling fishes
Beef tongue
Plaice
Cervelat
Pollock
Sharks
Sole
Swordfish
Turbot
Whiting
Stick fishes
Octopus
Calamari
Agar seaweed
Dill
Pizza sauce
Basil
Baking soda
Cinnamon
Ground cinnamon
Cardamom
Ground cardamom
Chervil
Chives
Clove
Coriander seed
Chili peppers
Grapefruit
Cantaloupe
Bass
Turkey
Veal
Lima beans
French beans
Pinto beans
Millet
Sea salt
Herb
Spice
Mustard
Parsley
Rosemary
Thyme
Vinegar
Sage
Saffron
Syrup
Baby food
Oat milk
Coconut water
Energy drink
Champagne
Cider
Cocktail
Cola drink
Liqueur
Gin
Carrot juice
Lemon juice
Grape juice
Tomato juice
Juice
Nectar
Cocoa
Rum
Sake
Red wine
Vodka
Whiskey
Fishes sandwiches
Chicken sandwiches
Vegetarian hamburgers
Cheeseburger
Sauerkraut
Crepe
Fajita
Falafel
Hamburger
Frankfurter
Lasagne
Egg rolls
Ravioli
Meats pizzas
Cheeses pizzas
Vegetable pizzas
Margherita pizzas
Lorraine quiches
Risotto
Stir-fried rice
Caesar salad
Coleslaw
Potato salad
Tuna salad
Soufflé
Vegetable soup
Mushroom soup
Lentil soup
Chicken soup
Minestrone soup
Split pea soup
Sushi
Tripe
Bamboo shoots
Plantain
Swiss chard
Morel mushrooms
Potato chip
Bok choy
Brussels sprouts
Kale
Kohlrabi
Butternut squashes
Squashes
Cress
Watercress
Shallot
Broad beans
Prickly pears
French fries
Passion fruits
Okra
Navy beans
Kidney red beans
Persimmon
Kumquat
Mixed vegetables
Flax seeds
Lychee
Cocktail fruits
Sweet corn
Macadamia
Pecans
Brazil nuts
Sorrel
Parsnip
Papaya
Marzipan
Dried peaches
Pine nuts
Split peas
Sweet pepper
Mashed potatoes
Dried apples
Prunes
Rhubarb
Arugula
Escarole
Elderberries
Tahini
Tamarind
Taro
Tomato paste
Sun-dried tomatoes
Sorbet
Ice pops
Frozen yogurt
Custard
Blue cheese
Soy sauce
Maple syrup
Bran
Brie cheese
Cheesecake
Chocolate cakes
Lemon cakes
Whipped cream
Edam cheese
Feta cheese
Fontina cheese
Cream cheese
Gorgonzola cheese
Gouda cheese
Gruyere cheese
Condensed milk
1% milk fat milk
Skim milk
3.25% milk fat milk
Kefir
Dry milk
Milkshake
Meringue
Muenster cheese
Neufchatel cheese
French toast
Provolone cheese
Roquefort cheese
Tiramisu
Chicken nuggets
Snapper
Surimi
Dry sausages
Chicken sausages
Turkey sausages
Salami
Dogfish
Beef kidney
Protein fortified soy
Pork belly
Pork chop
Pork loin
Pork shoulder
Pork roast
Pork spare rib
Breaded fishes
Guineafowls
Perch
Scallops
Pate
Pancetta
Omelet
Goose
Mullet
Mutton
Salted cod fishes
Mortadella
Grouper
Oyster
Smoked haddocks
Ground turkey
Ground chickens
Ground beef
Chicken liver
Pork liver
Beef liver
Lamb livers
Halibut
Pheasant
Smelts
Crab
Muesli
Cookies
Chocolate cookies
Gnocchi
Croutons
Spelt
Brioche
Brownies
Fruitcake
Doughnuts
Goat
Beef heart
Quail
Granulated sugar
Brown sugar
Molasses
Marshmallows
Jam
White chocolate
Hard candy
Lollipops
Greek yogurt
Rice noodles
Tortillas
Apple pies
Shortbread cookies
Buckwheat
Wild rice
Basmati rice
Popcorn
Pound cakes
Polenta
Phyllo
Puff pastry
Rye flour
Rice flour
Chickpea flour
Barley flour
Wheat flour
Corn flour
Couscous
Corn chips
Tortilla chips
Whole wheat
Bulgur
Bagels
Cornstarch
Amaranth
Cumin
Turmeric
Curry powder
Tarragon
Fennel seeds
Fenugreek seed
Dried marjoram
Fresh mint
Nutmeg
Dried oregano
Paprika
Poppyseed
Black peppercorn
Cayenne
Salad dressing
Chia seed
Light cream
Vegetable oil
Avocado oil
Cod liver oil
Herring oil
Corn oil
Hazelnut oil
Grapeseed oil
Sardine oil
Salmon oil
Sesame oil
Corn
English muffins
Blueberry muffins
Chocolate croissants
French bread
Rye bread
Gingerbread
Pita
Hamburger buns
Hot dog buns
Baguette
Pizza dough
Brown rice
Steak flanks
Beef rib
Beef sirloin
Round beef
Beef chuck
Beef short rib
Chicken wings
Chicken legs
Chicken breasts
Chicken drumsticks
Chicken wholes
Lamb legs
Lamb chops
Yellowfin tuna
Albacore tuna
"""

# Generate the response using the google cloud
response = model.generate_content([image_part, prompt_text, list_text])

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
