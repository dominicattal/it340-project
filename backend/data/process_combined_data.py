#!/usr/bin/env python3
import json
from difflib import SequenceMatcher
import re

def normalize_name(name):
    """Normalize product names for better matching across different stores"""
    original_name = name

    # Remove common grade prefixes (case insensitive)
    grade_prefixes = [
        r'^(entry grade|high grade|real grade|master grade|perfect grade)\s+',
        r'^(eg|hg|rg|mg|pg)\s+',
        r'^hg(ce|uc|if|ib|ibf|ibo|ibv|oo|oo2|st|twfm|wfm)?\s+',  # HG variants
        r'^mg\s+',
        r'^rg\s+',
        r'^pg\s+',
    ]

    for prefix in grade_prefixes:
        name = re.sub(prefix, '', name, flags=re.IGNORECASE)

    # Remove scale information (1/144, 1/100, etc.)
    name = re.sub(r'\d+/\d+\s+', '', name)

    # Remove model numbers (#03, No.03, etc.)
    name = re.sub(r'(^|\s+)(#|no\.?)\d+(\s+|$)', ' ', name, flags=re.IGNORECASE)

    # Remove common prefixes that vary by store
    prefixes_to_remove = [
        r'^hgwfm\s+',      # Newtype style
        r'^hgtwfm\s+',     # USA Gundam Store style
        r'^hg\s+',         # Gundam Planet style
        r'^mg\s+',
        r'^rg\s+',
        r'^pg\s+',
        r'^\d+\s+',        # Leading numbers
        r'^gundam\s+',     # Common "Gundam" prefix
    ]

    for prefix in prefixes_to_remove:
        name = re.sub(prefix, '', name, flags=re.IGNORECASE)

    # Clean up extra whitespace and special characters
    name = re.sub(r'[^\w\s]', ' ', name)  # Replace special chars with spaces
    name = re.sub(r'\s+', ' ', name)      # Normalize whitespace
    name = name.strip().lower()

    return name, original_name

def extract_variant_info(name):
    """Extract variant information that should be preserved for matching"""
    variants = []

    # Color variants
    if re.search(r'\b(red|blue|green|yellow|black|white|clear|metallic|chrome)\b', name, re.IGNORECASE):
        color_match = re.search(r'\b(red|blue|green|yellow|black|white|clear|metallic|chrome)\b', name, re.IGNORECASE)
        if color_match:
            variants.append(f"color_{color_match.group(1).lower()}")

    # Version indicators
    if re.search(r'\(rebuild\)|\(rg\)|\(mg\)|\(hg\)', name, re.IGNORECASE):
        version_match = re.search(r'\((rebuild|rg|mg|hg)\)', name, re.IGNORECASE)
        if version_match:
            variants.append(f"version_{version_match.group(1).lower()}")

    # Limited edition markers
    if re.search(r'\b(limited|le|exclusive|special|anniversary)\b', name, re.IGNORECASE):
        variants.append("limited_edition")

    return variants

def calculate_similarity_score(name1, name2, variants1=None, variants2=None):
    """Calculate similarity score considering both name and variant info"""
    # Base name similarity
    base_score = SequenceMatcher(None, name1, name2).ratio()

    # Variant similarity bonus
    variant_bonus = 0
    if variants1 and variants2:
        # If variants match exactly, give bonus
        if set(variants1) == set(variants2):
            variant_bonus = 0.2
        # If variants partially match, smaller bonus
        elif set(variants1) & set(variants2):
            variant_bonus = 0.1

    # Penalize if one has variants and other doesn't (likely different products)
    if (variants1 and not variants2) or (variants2 and not variants1):
        variant_bonus = -0.1

    return min(1.0, base_score + variant_bonus)

def find_best_match(target_name, candidates, threshold=0.8):
    """Find the best matching product name using fuzzy matching"""
    best_match = None
    best_score = 0

    target_normalized, target_original = normalize_name(target_name)
    target_variants = extract_variant_info(target_original)

    for candidate in candidates:
        candidate_normalized, candidate_original = normalize_name(candidate['name'])
        candidate_variants = extract_variant_info(candidate_original)

        # Use enhanced similarity calculation
        score = calculate_similarity_score(target_normalized, candidate_normalized,
                                        target_variants, candidate_variants)

        if score > best_score and score >= threshold:
            best_match = candidate
            best_score = score

    return best_match, best_score

def combine_store_data():
    """Combine data from all three stores into unified format"""

    # Load the combined data file
    try:
        with open('data.json', 'r', encoding='utf-8') as f:
            all_data = json.load(f)
    except FileNotFoundError:
        print("Error: data.json not found.")
        return

    # Group products by grade and store
    grades = ['EG', 'HG', 'RG', 'MG', 'PG']
    combined_products = []

    for grade in grades:
        print(f"\nProcessing {grade} grade...")

        # Get products for this grade from each store
        newtype_products = [p for p in all_data['models'] if p.get('grade') == grade and p.get('store') == 'Newtype']
        usagundamstore_products = [p for p in all_data['models'] if p.get('grade') == grade and p.get('store') == 'USA Gundam Store']
        gundamplanet_products = [p for p in all_data['models'] if p.get('grade') == grade and p.get('store') == 'Gundam Planet']

        print(f"Newtype: {len(newtype_products)} products")
        print(f"USA Gundam Store: {len(usagundamstore_products)} products")
        print(f"Gundam Planet: {len(gundamplanet_products)} products")

        # Use newtype products as base and find matches in other stores
        for newtype_product in newtype_products:
            product_name = newtype_product['name']

            # Find matches in other stores
            usagundamstore_match, usa_score = find_best_match(product_name, usagundamstore_products)
            gundamplanet_match, gp_score = find_best_match(product_name, gundamplanet_products)

            # Build stores array with all available prices
            stores = []

            # Add Newtype store
            stores.append({
                "name": "Newtype",
                "price": newtype_product['price'],
                "url": newtype_product['link'],
                "lastUpdated": "2025-12-18T00:00:00.000Z"
            })

            # Add USA Gundam Store if match found
            if usagundamstore_match:
                stores.append({
                    "name": "USA Gundam Store",
                    "price": usagundamstore_match['price'],
                    "url": usagundamstore_match['link'],
                    "lastUpdated": "2025-12-18T00:00:00.000Z"
                })
                print(f"✓ Matched: {product_name[:50]}... with USA Gundam Store (score: {usa_score:.2f})")

            # Add Gundam Planet if match found
            if gundamplanet_match:
                stores.append({
                    "name": "Gundam Planet",
                    "price": gundamplanet_match['price'],
                    "url": gundamplanet_match['link'],
                    "lastUpdated": "2025-12-18T00:00:00.000Z"
                })
                print(f"✓ Matched: {product_name[:50]}... with Gundam Planet (score: {gp_score:.2f})")

            # Sort stores by price (lowest first)
            stores.sort(key=lambda x: x['price'])

            # Find lowest price and store
            lowest_price = min(store['price'] for store in stores)
            lowest_store = next(store['name'] for store in stores if store['price'] == lowest_price)

            # Create combined product
            combined_product = {
                "grade": grade,
                "name": product_name,
                "img": newtype_product['img'],  # Use newtype image as primary
                "lowestPrice": lowest_price,
                "lowestStore": lowest_store,
                "stores": stores
            }

            combined_products.append(combined_product)

    # Save combined data
    output_data = {
        "models": combined_products,
        "lastUpdated": "2025-12-18T00:00:00.000Z",
        "stores": ["Newtype", "USA Gundam Store", "Gundam Planet"]
    }

    with open('combined_price_data.json', 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Combined data saved to combined_price_data.json")
    print(f"Total products: {len(combined_products)}")

    # Print summary
    total_stores = sum(len(p['stores']) for p in combined_products)
    avg_stores_per_product = total_stores / len(combined_products) if combined_products else 0
    print(f"Average stores per product: {avg_stores_per_product:.1f}")
if __name__ == "__main__":
    combine_store_data()