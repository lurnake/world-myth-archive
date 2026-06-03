import csv
import os

# Define paths relative to the script location
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
RAW_DATA_FILE = os.path.join(SCRIPT_DIR, 'wikidata_deities_raw.csv')
OUTPUT_FILE = os.path.join(SCRIPT_DIR, '..', 'lexicons', 'deities.csv')
# Define the columns to keep from the raw data and their new names
COLUMN_MAPPING = {
    'itemLabel': 'name',
    'cultureLabel': 'culture',
    'genderLabel': 'gender',
    'item': 'wikidata_url' # Keep the URL which contains the ID
}

# Option to drop rows where culture is empty (as suggested in Readme)
DROP_EMPTY_CULTURE = True

def process_wikidata_deities():
    """
    Reads the raw CSV downloaded from Wikidata, processes it,
    and saves the result to the lexicons directory.
    """
    processed_rows = []
    try:
        with open(RAW_DATA_FILE, 'r', encoding='utf-8') as infile:
            reader = csv.DictReader(infile)
            headers = reader.fieldnames

            # Check if required columns exist
            missing_cols = [col for col in COLUMN_MAPPING.keys() if col not in headers]
            if missing_cols:
                print(f"Error: Missing required columns in {RAW_DATA_FILE}: {missing_cols}")
                return

            # Prepare headers for the output file
            output_headers = list(COLUMN_MAPPING.values())
            processed_rows.append(output_headers)

            for row in reader:
                # Apply filter
                if DROP_EMPTY_CULTURE and not row.get('cultureLabel', '').strip():
                    continue

                # Extract and rename columns
                processed_row = []
                for raw_col, new_col in COLUMN_MAPPING.items():
                    value = row.get(raw_col, '')
                    # Extract Wikidata ID from URL
                    if new_col == 'wikidata_url':
                         processed_row.append(value.split('/')[-1] if value else '') # Extract QID
                    else:
                        processed_row.append(value)

                processed_rows.append(processed_row)

    except FileNotFoundError:
        print(f"Error: Raw data file not found at {RAW_DATA_FILE}")
        print("Please download the results from Wikidata Query Service and save it as 'wikidata_deities_raw.csv' in the 'scripts' directory.")
        return
    except Exception as e:
        print(f"An error occurred during processing: {e}")
        return

    # Write processed data to the output file
    try:
        # Ensure the output directory exists
        os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

        with open(OUTPUT_FILE, 'w', newline='', encoding='utf-8') as outfile:
            writer = csv.writer(outfile)
            writer.writerows(processed_rows)
        print(f"Successfully processed data and saved to {OUTPUT_FILE}")
        print(f"Total rows processed (including header): {len(processed_rows)}")

    except Exception as e:
        print(f"An error occurred while writing the output file: {e}")

if __name__ == "__main__":
    process_wikidata_deities() 