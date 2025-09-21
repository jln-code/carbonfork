from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import tempfile
from PIL import Image

import vertexai
from vertexai.generative_models import GenerativeModel, Part
import pandas as pd

import mimetypes

# Load environment variables
app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5001"],
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type"]
    }
})

vertexai.init(project="carbonfork", location="us-central1")

try:
    carbon_data = pd.read_csv('../longerEmissions.csv')
    # Drop the entity column because we don't need it
    carbon_data = carbon_data.drop('Entity', axis=1)
    
    # Process CO2e values to get middle point between ranges
    for index, row in carbon_data.iterrows():
        value = row["CO2e"]
        if isinstance(value, str) and "-" in value:
            value_parts = value.split('-')
            value_low = float(value_parts[0])
            value_high = float(value_parts[1])
            if value_high != value_low:
                value_new = value_high - ((value_high - value_low)/2)
            else:
                value_new = value_high
            carbon_data.at[index, "CO2e"] = value_new
    
    print("Carbon data loaded successfully!")
    print(carbon_data.head())
except Exception as e:
    print(f"Error loading carbon data: {e}")
    carbon_data = None

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

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = jsonify()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add('Access-Control-Allow-Headers', "Content-Type")
        response.headers.add('Access-Control-Allow-Methods', "GET,PUT,POST,DELETE,OPTIONS")
        return response

@app.route('/')
def home():
    return "Gemini Image Analysis API is running!"

def calculate_carbon_footprint(food_items, weights):
    """Calculate carbon footprint for given food items and weights"""
    if carbon_data is None:
        raise Exception("Carbon data not loaded")
    
    final_carbon = []
    food_details = []
    
    for i, item in enumerate(food_items):
        try:
            # Look for exact match first
            matching_rows = carbon_data[carbon_data['Name'].str.lower() == item.lower()]
            
            if matching_rows.empty:
                # Try partial match if exact match fails
                matching_rows = carbon_data[carbon_data['Name'].str.contains(item, case=False, na=False)]
            
            if not matching_rows.empty:
                carbon_index = matching_rows.index[0]
                carbon_value = carbon_data.at[carbon_index, 'CO2e']
                
                # Convert weight from grams to kg and calculate carbon footprint
                weight_kg = weights[i] / 1000.0
                carbon_footprint = weight_kg * float(carbon_value)
                
                final_carbon.append(carbon_footprint)
                food_details.append({
                    'food_item': item,
                    'weight_grams': weights[i],
                    'weight_kg': weight_kg,
                    'carbon_per_kg': float(carbon_value),
                    'carbon_footprint_kg': carbon_footprint
                })
            else:
                print(f"Warning: Could not find carbon data for {item}")
                # Use a default value or skip
                final_carbon.append(0)
                food_details.append({
                    'food_item': item,
                    'weight_grams': weights[i],
                    'weight_kg': weights[i] / 1000.0,
                    'carbon_per_kg': 0,
                    'carbon_footprint_kg': 0,
                    'note': 'Carbon data not found'
                })
                
        except Exception as e:
            print(f"Error processing {item}: {e}")
            final_carbon.append(0)
            food_details.append({
                'food_item': item,
                'weight_grams': weights[i],
                'error': str(e)
            })
    
    return final_carbon, food_details, sum(final_carbon)

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import tempfile
import vertexai
from vertexai.generative_models import GenerativeModel, Part
import pandas as pd
from PIL import Image # Import Pillow

# ... (rest of your existing code remains the same)

@app.route('/api/analyze-image', methods=['POST'])
def analyze_image():
    temp_file_path = None
    converted_temp_path = None

    try:
        if 'image' not in request.files:
            return jsonify({'success': False, 'error': 'No image provided'}), 400
        
        image_file = request.files['image']
        
        if image_file.filename == '':
            return jsonify({'success': False, 'error': 'No image selected'}), 400
        
        finger_length = request.form.get('finger_length', 3)
        
        # Save the original image to a temporary file
        temp_file_path = tempfile.NamedTemporaryFile(delete=False).name
        image_file.save(temp_file_path)
        
        # Determine the MIME type from the file object
        mime_type = image_file.content_type
        
        # --- The Fix: Convert HEIC to JPEG if needed ---
        if mime_type == 'image/heic' or mime_type == 'image/heif':
            # Create a new temporary path for the converted file
            converted_temp_path = tempfile.NamedTemporaryFile(suffix='.jpeg', delete=False).name
            try:
                # Open the HEIC image using Pillow
                img = Image.open(temp_file_path)
                # Ensure it's in a format suitable for JPEG conversion (e.g., RGB)
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                # Save the converted image as JPEG
                img.save(converted_temp_path, 'JPEG')
                
                # Update the path and MIME type to use for the API call
                file_to_send = converted_temp_path
                mime_type = 'image/jpeg'
                
            except Exception as e:
                return jsonify({'success': False, 'error': f'Failed to convert HEIC image: {str(e)}'}), 500
        else:
            file_to_send = temp_file_path
        # --- End of Fix ---

        # Read the image data from the correct file path
        with open(file_to_send, "rb") as f:
            image_data = f.read()

        # Create Part with the correct MIME type
        image_part = Part.from_data(data=image_data, mime_type=mime_type)
        
        # ... (rest of your original code remains the same) ...
        prompt_text = f"""
I have a plate of food. Please identify the food items and estimate their portion sizes in grams, as well as looking at how much of the plate the food is taking up, and then estimate the volume of that specific food. If there is a hand in the picture, know that {finger_length} inches is the middle finger length. Otherwise use a standard plate size as refrence to the plate in the picture, or if you see other refrence points in the picture you think are more accurate, use those for scale as well. Provide the response as a JSON object with the keys 'food_item' and 'estimated_weight_grams' and 'volume_food'. When you are detecting the type of food and returning the JSON, have the food item string your returning be something on the more basic side so that we can use a known carbon dataset, for EX: instead of 'southwest vegtable mix' break down that mix into what you see 'black beans, corn,' ect as different food items. Same for things like Popcorn chicken, should be more basic like 'chicken nugget' or 'breaded chicken'. Also attached is a CSV of a food name list that once you identify the food on the plate, you should pick the closet one on the list to put on the JSON. HOWEVER STILL USE THE WEIGHT FROM YOUR INITIAL PREDICTION NOT THE NEW FOOD NAME
"""
        
        model = GenerativeModel("gemini-2.5-pro")
        response = model.generate_content([image_part, prompt_text, list_text])
        
        response_text = response.text.strip()
        print(f"Raw Gemini response: {response_text}")
        
        if "```json" in response_text:
            json_start = response_text.find("```json") + 7
            json_end = response_text.find("```", json_start)
            response_text = response_text[json_start:json_end].strip()
        elif "```" in response_text:
            json_start = response_text.find("```") + 3
            json_end = response_text.rfind("```")
            response_text = response_text[json_start:json_end].strip()
        
        try:
            ai_return_data = json.loads(response_text)
            
            if not isinstance(ai_return_data, list):
                raise ValueError("Response is not a list")
            
            food_items = [item.get("food_item", "") for item in ai_return_data]
            weights = [item.get("estimated_weight_grams", 0) for item in ai_return_data]
            
            print(f"Detected foods: {food_items}")
            print(f"Weights: {weights}")
            
            final_carbon, food_details, total_carbon = calculate_carbon_footprint(food_items, weights)
            
            return jsonify({
                'success': True,
                'detected_foods': ai_return_data,
                'carbon_analysis': {
                    'food_details': food_details,
                    'individual_carbon_footprints': final_carbon,
                    'total_carbon_footprint_kg': round(total_carbon, 4),
                    'total_carbon_footprint_g': round(total_carbon * 1000, 2)
                },
                'summary': f"Total CO2 equivalent: {round(total_carbon, 4)} kg ({round(total_carbon * 1000, 2)} grams)"
            })
            
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e}")
            print(f"Attempted to parse: {response_text}")
            return jsonify({
                'success': False, 
                'error': f'Failed to parse AI response as JSON: {str(e)}',
                'raw_response': response_text
            }), 500
        
    except Exception as e:
        print(f"Error in analyze_image: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500
    
    finally:
        # Clean up temporary files
        if temp_file_path and os.path.exists(temp_file_path):
            os.unlink(temp_file_path)
        if converted_temp_path and os.path.exists(converted_temp_path):
            os.unlink(converted_temp_path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)