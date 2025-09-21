from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import tempfile
from PIL import Image

from werkzeug.utils import secure_filename
from io import BytesIO

# Optional HEIC support (install: pip install pillow-heif)
try:
    import pillow_heif
    pillow_heif.register_heif_opener()
except Exception:
    pass  # If not installed, we'll still handle most cases via Pillow



import vertexai
from vertexai.generative_models import GenerativeModel, Part
import pandas as pd

import mimetypes

# Load environment variables
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})


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

ALLOWED_MODEL_MIMES = {"image/jpeg", "image/png"}

def normalize_image_to_model_supported(image_file) -> tuple[bytes, str]:
    """
    Returns (image_bytes, mime) suitable for Vertex Gemini.
    We convert anything that isn't a clean JPEG/PNG into JPEG.
    """
    filename = secure_filename(image_file.filename or "upload")
    raw_bytes = image_file.read()
    image_file.seek(0)  # reset for safety if needed elsewhere

    if not raw_bytes or len(raw_bytes) == 0:
        raise ValueError("Uploaded image is empty (0 bytes).")

    # Try to open via Pillow; this also fixes many incorrect content-types
    try:
        img = Image.open(BytesIO(raw_bytes))
        # If the format is already JPEG or PNG, re-encode to clean bytes to avoid oddities
        fmt = (img.format or "").upper()
        if fmt in {"JPEG", "JPG"}:
            out = BytesIO()
            if img.mode not in ("RGB", "L"):
                img = img.convert("RGB")
            img.save(out, format="JPEG", quality=92)
            return out.getvalue(), "image/jpeg"
        elif fmt == "PNG":
            out = BytesIO()
            # Preserve alpha by staying PNG
            img.save(out, format="PNG", optimize=True)
            return out.getvalue(), "image/png"
        else:
            # Anything else (HEIC/WEBP/GIF/TIFF/unknown) -> convert to JPEG
            if img.mode not in ("RGB", "L"):
                img = img.convert("RGB")
            out = BytesIO()
            img.save(out, format="JPEG", quality=92)
            return out.getvalue(), "image/jpeg"
    except Exception as e:
        # If Pillow couldn't open it, try a last-resort: assume JPEG bytes
        # (This covers rare cases where the file is valid but not recognized)
        if raw_bytes[:2] == b"\xff\xd8":
            # Looks like a JPEG magic header; pass through
            return raw_bytes, "image/jpeg"
        raise ValueError(f"Could not decode the uploaded image: {e}")


@app.route('/api/analyze-image', methods=['POST'])
def analyze_image():
    # --- DEBUG: do NOT consume the stream here ---
    try:
        print("=== /api/analyze-image DEBUG ===")
        print("Content-Type:", request.headers.get("Content-Type"))
        print("Request method:", request.method)
        print("Files keys:", list(request.files.keys()))
        print("Form keys:", list(request.form.keys()))
        print("Content-Length:", request.content_length)
        print("================================")
    except Exception as _dbg_e:
        print("DEBUG logging failed:", _dbg_e)

    temp_file_path = None
    converted_temp_path = None

    try:
        # Allow optional finger length (inches) from form; default to 3.0
        try:
            finger_length = float(request.form.get("finger_length", "3.0"))
        except Exception:
            finger_length = 3.0

        image_part = None
        image_file = (
            request.files.get("image")
            or request.files.get("file")
            or request.files.get("photo")
            or request.files.get("picture")
        )

        if image_file:
            if getattr(image_file, "filename", "") == "":
                return jsonify({'success': False, 'error': 'No image selected'}), 400

            try:
                image_bytes, mime_type = normalize_image_to_model_supported(image_file)
            except ValueError as ve:
                return jsonify({'success': False, 'error': str(ve)}), 400

            if mime_type not in ALLOWED_MODEL_MIMES:
                # Force JPEG if Pillow produced something else
                try:
                    img = Image.open(BytesIO(image_bytes))
                    if img.mode not in ("RGB", "L"):
                        img = img.convert("RGB")
                    out = BytesIO()
                    img.save(out, format="JPEG", quality=92)
                    image_bytes = out.getvalue()
                    mime_type = "image/jpeg"
                except Exception as e:
                    return jsonify({'success': False, 'error': f'Could not convert image: {e}'}), 400

            image_part = Part.from_data(data=image_bytes, mime_type=mime_type)

        else:
            # Fallback: raw body with image/* Content-Type
            ct = request.headers.get("Content-Type", "")
            if ct.startswith("image/"):
                raw = request.get_data(cache=True)  # cache=True so we don't lose it later
                if not raw:
                    return jsonify({'success': False, 'error': 'Raw image body is empty'}), 400
                try:
                    img = Image.open(BytesIO(raw))
                    if img.mode not in ("RGB", "L"):
                        img = img.convert("RGB")
                    out = BytesIO()
                    out_format = "PNG" if img.mode == "L" and hasattr(img, "info") and img.info.get("transparency") else "JPEG"
                    if out_format == "PNG":
                        img.save(out, format="PNG", optimize=True)
                        mime_type = "image/png"
                    else:
                        img.save(out, format="JPEG", quality=92)
                        mime_type = "image/jpeg"
                    image_bytes = out.getvalue()
                    image_part = Part.from_data(data=image_bytes, mime_type=mime_type)
                except Exception as e:
                    return jsonify({"success": False, "error": f"Raw image body could not be decoded: {e}"}), 400
            else:
                return jsonify({
                    "success": False,
                    "error": "No image provided",
                    "debug": {
                        "content_type": request.headers.get("Content-Type"),
                        "files_keys": list(request.files.keys()),
                        "form_keys": list(request.form.keys()),
                    },
                }), 400

        # --- Prompt & model ---
        prompt_text = f"""
I have a plate of food. Please identify the food items and estimate their portion sizes in grams, and also estimate the volume of each item.
If there is a hand in the picture, assume a middle finger length of {finger_length} inches for scale. Otherwise, use standard plate size or other visible references.
Return a JSON array where each element has keys: 'food_item', 'estimated_weight_grams', 'volume_food'.

IMPORTANT:
- Use basic/generic names to match a carbon dataset (e.g., 'chicken nugget' instead of 'popcorn chicken'; split mixes like 'black beans, corn' etc.).
- After you identify the food, map its name to the closest item in the attached list, but KEEP your original weight estimate.
"""

        model = GenerativeModel("gemini-2.5-pro")
        response = model.generate_content([image_part, prompt_text, list_text])

        response_text = (response.text or "").strip()
        print(f"Raw Gemini response: {response_text}")

        # Strip code fences if present
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
        if temp_file_path and os.path.exists(temp_file_path):
            os.unlink(temp_file_path)
        if converted_temp_path and os.path.exists(converted_temp_path):
            os.unlink(converted_temp_path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)