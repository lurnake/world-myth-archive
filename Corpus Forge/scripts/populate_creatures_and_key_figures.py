import os
import csv
import google.generativeai as genai
from dotenv import load_dotenv
import re  # Add re module for regular expression matching

# --- Configuration & Setup ---

def load_api_key():
    """Loads the Gemini API key from .env.local"""
    load_dotenv(dotenv_path=os.path.join(os.getcwd(), ".env.local"))
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY not found in .env.local. Please ensure it's set.")
        exit()
    genai.configure(api_key=api_key)
    return api_key

def extract_doc_id(work_content):
    """Extracts the doc_id from the YAML frontmatter of the work file."""
    # Look for a line matching the pattern doc_id: VALUE in the frontmatter
    doc_id_match = re.search(r'doc_id:\s*([^\s#]+)', work_content)
    if doc_id_match:
        return doc_id_match.group(1).strip()
    else:
        print("Warning: No doc_id found in work file. Using filename as fallback.")
        return None

def get_work_to_analyze():
    """Asks the user for the name of the work file to analyze."""
    while True:
        work_folder = os.path.join(os.getcwd(), "Corpus Forge", "works")
        if not os.path.isdir(work_folder):
            print(f"Error: The directory '{work_folder}' does not exist. Please create it and add your work files there.")
            exit()
        
        print("\nAvailable works in 'Corpus Forge/works':")
        available_files = [f for f in os.listdir(work_folder) if os.path.isfile(os.path.join(work_folder, f))]
        if not available_files:
            print("No files found in 'Corpus Forge/works'. Please add your text files there.")
            exit()
        
        for i, filename in enumerate(available_files):
            print(f"{i+1}. {filename}")

        try:
            choice = input(f"Please enter the number of the work you want to analyze (or 'q' to quit): ")
            if choice.lower() == 'q':
                exit()
            choice_num = int(choice)
            if 1 <= choice_num <= len(available_files):
                selected_file = available_files[choice_num-1]
                return os.path.join(work_folder, selected_file)
            else:
                print("Invalid selection. Please try again.")
        except ValueError:
            print("Invalid input. Please enter a number.")

def read_file_content(file_path):
    """Reads the entire content of a file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        print(f"Error: File not found at {file_path}")
        return None
    except Exception as e:
        print(f"Error reading file {file_path}: {e}")
        return None

# --- Gemini Interaction ---

def call_gemini_api(prompt_text, entity_type):
    """
    Calls the Gemini API with the provided prompt.
    Specifies a CSV-like output format for easy parsing.
    """
    model = genai.GenerativeModel('gemini-2.5-flash-preview-04-17') # for this task, 2.5-flash is good enough - no need to use 2.5-pro
    
    # Define CSV headers based on entity type from READMEs
    if entity_type == "key_figure":
        # From key_figures_readme.md: figure_id,preferred_name,figure_type,culture_group,domains,alternate_names,description_brief,notes
        csv_header = "figure_id,preferred_name,figure_type,culture_group,domains,alternate_names,description_brief,notes"
        entity_name_plural = "key figures"
        entity_name_singular = "key figure"
        expected_prefix = "FIG_"
    elif entity_type == "creature":
        # From creatures_readme.md: creature_id,preferred_name,culture_group,creature_type,description_brief,symbolism_roles,alternate_names,notes
        csv_header = "creature_id,preferred_name,culture_group,creature_type,description_brief,symbolism_roles,alternate_names,notes"
        entity_name_plural = "creatures"
        entity_name_singular = "creature"
        expected_prefix = "CRT_"
    else:
        print(f"Unknown entity type: {entity_type}")
        return None

    # First build prompt in parts to avoid linter issues with quotes
    header_part = f"""
We are building a lexicon of {entity_name_plural} for a work of literature. This task is part of a larger project called World Myth Archive. Your output will be used as part of a list that will eventually list all the {entity_name_plural} mentioned in all written works of world mythology.
    
Your task is to identify all {entity_name_plural} mentioned in the provided work.
Return your response as a list of {entity_name_plural}, with each {entity_name_singular} on a new line.
Format each line as a CSV string with the following headers:
{csv_header}

IMPORTANT: All {entity_name_singular} IDs MUST start with '{expected_prefix}' - do not use any other prefix.
For example, use '{expected_prefix}NAME_CULTURE' format.
"""

    # Use raw string for format part to avoid escaping issues
    format_part = r"""
VERY IMPORTANT CSV FORMATTING INSTRUCTIONS:
1. ANY field that contains a comma MUST be enclosed in double quotes (").
2. This is especially critical for the 'notes' field which often contains commas.
3. If a field contains double quotes, each quote must be doubled to escape it.
4. All fields must be properly delimited to ensure exactly 8 columns total per row.
5. When mentioning locations, relationships, or detailed descriptions in the notes field, always enclose the entire field in quotes.

Examples of properly quoted notes fields:
- "Son of Anu, appears in divine assembly."
- "Appointed by Enlil. Also called Huwawa in some texts."

Follow the definitions, examples, and formatting instructions from the initial guidance.
Ensure each field is correctly populated. If a field is not applicable or the information is not present in the text,
leave it empty but maintain the comma delimiters.
For empty fields, use either nothing between commas (,,) or empty quotes ("").

DO NOT INCLUDE the header row in your output, only the data rows. Please make sure you cover every single entity in the work that fits this particular lexicon! If doing key figures, make sure to add all key figures. If doing creatures, please make sure you include all the creatures that fit the instructions.
"""

    # Use raw string for examples to avoid escaping issues
    example_part = r"""
Example for a key figure:
FIG_EXAMPLE_XYZ,Example Name,Deity,ExampleCulture,"Sky,Thunder","",Brief description.,"This is a complex notes field, with multiple commas, which must be quoted."

Example for a creature:
CRT_EXCREATURE_XYZ,Example Creature,ExampleCulture,"Mythical Beast","A brief description of this example creature.","Symbol1; Symbol2","","Notes containing information about other characters, locations, and relationships should all be in quotes."
"""

    # Combine all parts
    full_prompt = prompt_text + header_part + format_part + example_part
    
    print(f"\n--- Sending prompt to Gemini for {entity_type} ---")
    
    try:
        response = model.generate_content(full_prompt)
        return response.text
    except Exception as e:
        print(f"Error calling Gemini API for {entity_type}: {e}")
        return None

# --- CSV Handling ---

def read_existing_ids(csv_file_path):
    """
    Read existing entity IDs from a CSV file to prevent duplicates.
    Returns a set of IDs already in the file.
    """
    existing_ids = set()
    if os.path.isfile(csv_file_path):
        try:
            with open(csv_file_path, 'r', encoding='utf-8') as f:
                reader = csv.reader(f)
                # Skip header
                next(reader, None)
                for row in reader:
                    if row and len(row) > 0:
                        # First column is the ID
                        existing_ids.add(row[0])
        except Exception as e:
            print(f"Warning: Error reading existing IDs from {csv_file_path}: {e}")
    return existing_ids

def append_to_csv(csv_file_path, data_string, expected_headers, entity_type, work_doc_id=None):
    """
    Appends data from a string (assuming each line is a CSV row) to a CSV file.
    Creates the file with headers if it doesn't exist.
    Validates the number of columns for each row.
    Prevents duplicate entries based on entity ID.
    Ensures entries have the correct ID prefix for the file type.
    """
    file_exists = os.path.isfile(csv_file_path)
    
    # Get existing IDs to prevent duplicates
    existing_ids = read_existing_ids(csv_file_path)
    
    # Prepare rows for CSV writer
    parsed_rows = []
    skipped_duplicates = 0
    parsing_errors = 0
    wrong_prefix_count = 0
    
    # Determine the expected prefix for this entity type
    expected_prefix = ""
    if entity_type == "key_figure":
        expected_prefix = "FIG_"
    elif entity_type == "creature":
        expected_prefix = "CRT_"
    
    if data_string:
        total_lines = len(data_string.strip().split('\n'))
        print(f"Parsing {total_lines} response lines from Gemini...")
        
        lines = data_string.strip().split('\n')
        for line_idx, line_string in enumerate(lines): # Renamed 'line' to 'line_string' for clarity
            if line_string.strip(): # Ensure line is not empty
                try:
                    # Use csv.reader to properly handle commas within quoted fields
                    # We wrap the single line_string in a list to feed it to csv.reader
                    reader = csv.reader([line_string])
                    for parsed_row_fields in reader: # This will yield one list of fields (the row)
                        # Skip empty or nearly empty rows
                        if not any(field.strip() for field in parsed_row_fields):
                            continue
                            
                        # Check for duplicates using the ID (first field)
                        if parsed_row_fields and parsed_row_fields[0].strip():
                            entity_id = parsed_row_fields[0].strip()
                            
                            # Check if this entity has the correct prefix for this file
                            if not entity_id.startswith(expected_prefix):
                                wrong_prefix_count += 1
                                print(f"Skipping ID with wrong prefix: {entity_id} (expected {expected_prefix})")
                                continue
                                
                            if entity_id in existing_ids:
                                skipped_duplicates += 1
                                print(f"Skipping duplicate ID: {entity_id}")
                                continue
                            
                        # Fix common issues with the row
                        processed_row = process_row(parsed_row_fields, expected_headers)
                        
                        if len(processed_row) == len(expected_headers) - 1:  # -1 because works_appeared_in will be added
                            # The csv module handles unquoting fields, but let's ensure surrounding whitespace is stripped
                            processed_row = [field.strip() for field in processed_row]
                            
                            # Add the work_doc_id as the last column
                            if work_doc_id:
                                processed_row.append(work_doc_id)
                            else:
                                processed_row.append("")  # Empty if no doc_id provided
                                
                            parsed_rows.append(processed_row)
                            
                            # Add to existing IDs to prevent duplicates in same batch
                            if processed_row[0].strip():
                                existing_ids.add(processed_row[0].strip())
                        else:
                            # Try to fix the row if possible
                            fixed_row = attempt_to_fix_row(parsed_row_fields, expected_headers)
                            if fixed_row and len(fixed_row) == len(expected_headers) - 1:  # -1 because works_appeared_in will be added
                                fixed_row = [field.strip() for field in fixed_row]
                                
                                # Add the work_doc_id as the last column
                                if work_doc_id:
                                    fixed_row.append(work_doc_id)
                                else:
                                    fixed_row.append("")  # Empty if no doc_id provided
                                    
                                parsed_rows.append(fixed_row)
                                print(f"Fixed row with ID: {fixed_row[0]}")
                                # Add to existing IDs to prevent duplicates in same batch
                                if fixed_row[0].strip():
                                    existing_ids.add(fixed_row[0].strip())
                            else:
                                parsing_errors += 1
                                print(f"Warning: Skipping row due to mismatched column count after CSV parsing. Expected {len(expected_headers) - 1}, got {len(parsed_row_fields)}. Row: '{line_string}'")
                        
                        break # We only expect one row from reader([line_string])
                except csv.Error as e:
                    parsing_errors += 1
                    print(f"Warning: CSV parsing error for row: '{line_string}'. Error: {e}. Skipping row.")
    
    if not parsed_rows:
        print(f"No valid data rows to append to {os.path.basename(csv_file_path)}.")
        return
    
    print(f"Successfully parsed {len(parsed_rows)} rows, skipped {skipped_duplicates} duplicates, skipped {wrong_prefix_count} with wrong prefix, encountered {parsing_errors} parsing errors.")

    try:
        with open(csv_file_path, 'a', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            if not file_exists or os.path.getsize(csv_file_path) == 0:
                writer.writerow(expected_headers)
                print(f"Created {csv_file_path} with headers.")
            
            writer.writerows(parsed_rows)
            print(f"Appended {len(parsed_rows)} rows to {os.path.basename(csv_file_path)}.")

    except Exception as e:
        print(f"Error writing to CSV file {csv_file_path}: {e}")

def process_row(row_fields, expected_headers):
    """Process fields in a row to fix common issues."""
    # Normalize empty fields
    return [field.strip() if field.strip() else "" for field in row_fields]

def attempt_to_fix_row(row_fields, expected_headers):
    """
    Attempts to fix rows with mismatched column counts.
    This handles some common patterns in the API response.
    """
    # If we have more fields than expected, try to detect if we need to merge some
    if len(row_fields) > len(expected_headers):
        # Try to identify potential field-spanning content by looking at quoted sections
        merged_fields = []
        skip_next = False
        for i in range(len(row_fields)):
            if skip_next:
                skip_next = False
                continue
                
            current_field = row_fields[i]
            
            # If this isn't the last field and the current field is missing a closing quote
            # while the next has no opening quote, merge them
            if (i < len(row_fields) - 1 and 
                current_field.count('"') % 2 == 1 and 
                not row_fields[i+1].startswith('"')):
                merged_fields.append(current_field + "," + row_fields[i+1])
                skip_next = True
            else:
                merged_fields.append(current_field)
        
        # If we've fixed the problem, return the result
        if len(merged_fields) == len(expected_headers):
            return merged_fields
        
        # Another issue: Sometimes the notes field accidentally gets split
        # If we have one extra field and we're dealing with the note field (last field)
        if len(row_fields) == len(expected_headers) + 1:
            result = row_fields[:-2] + [row_fields[-2] + " " + row_fields[-1]]
            return result
    
    # If we have fewer fields than expected, try to add empty fields
    if len(row_fields) < len(expected_headers):
        # Add empty strings for missing fields
        return row_fields + [""] * (len(expected_headers) - len(row_fields))
    
    return None  # Couldn't fix it

# --- Main Execution ---

def main():
    """Main function to orchestrate the script."""
    print("Starting myth data population script...")
    
    try:
        load_api_key()
    except Exception as e:
        print(f"Error loading API key: {e}")
        print("Please ensure your .env.local file is set up correctly with GEMINI_API_KEY=your_key")
        return

    # Define paths
    base_dir = os.path.join(os.getcwd(), "Corpus Forge", "lexicons")
    key_figures_readme_path = os.path.join(base_dir, "key_figures_readme.md")
    key_figures_csv_path = os.path.join(base_dir, "key_figures.csv")
    creatures_readme_path = os.path.join(base_dir, "creatures_readme.md")
    creatures_csv_path = os.path.join(base_dir, "creatures.csv")
    
    # Track processing statistics
    stats = {
        "works_processed": 0,
        "key_figures_added": 0,
        "creatures_added": 0,
        "key_figures_errors": 0,
        "creatures_errors": 0
    }
    
    # Process works until user wants to quit
    continue_processing = True
    while continue_processing:
        # Get the work to analyze
        work_file_path = get_work_to_analyze()
        if not work_file_path:
            break
        
        work_content = read_file_content(work_file_path)
        if not work_content:
            print(f"Could not read content from {work_file_path}. Skipping.")
            continue
        
        work_name = os.path.basename(work_file_path)
        print(f"\n--- Processing work: {work_name} ---")
        
        # Extract the doc_id from the work content
        work_doc_id = extract_doc_id(work_content)
        if work_doc_id:
            print(f"Extracted document ID: {work_doc_id}")
        else:
            # Fallback to using the filename without extension if no doc_id found
            work_doc_id = os.path.splitext(work_name)[0]
            print(f"Using filename as document ID: {work_doc_id}")
        
        # 1. Process Key Figures
        print("\n--- Processing Key Figures ---")
        key_figures_instructions = read_file_content(key_figures_readme_path)
        key_figures_count_before = count_rows_in_csv(key_figures_csv_path)
        
        if not key_figures_instructions:
            print(f"Could not read key figures instructions from {key_figures_readme_path}. Skipping key figures.")
            stats["key_figures_errors"] += 1
        else:
            key_figures_prompt = f"""Here are the instructions for identifying and formatting key figures:
<instructions>
{key_figures_instructions}
</instructions>

Here is the work you need to analyze:
<work_content>
{work_content}
</work_content>
"""
            key_figures_response = call_gemini_api(key_figures_prompt, "key_figure")
            if key_figures_response:
                kf_headers = ["figure_id","preferred_name","figure_type","culture_group","domains","alternate_names","description_brief","notes","works_appeared_in"]
                append_to_csv(key_figures_csv_path, key_figures_response, kf_headers, "key_figure", work_doc_id)
                key_figures_count_after = count_rows_in_csv(key_figures_csv_path)
                stats["key_figures_added"] += (key_figures_count_after - key_figures_count_before)
            else:
                print("No response or error from Gemini for key figures.")
                stats["key_figures_errors"] += 1

        # 2. Process Creatures
        print("\n--- Processing Creatures ---")
        creatures_instructions = read_file_content(creatures_readme_path)
        creatures_count_before = count_rows_in_csv(creatures_csv_path)
        
        if not creatures_instructions:
            print(f"Could not read creatures instructions from {creatures_readme_path}. Skipping creatures.")
            stats["creatures_errors"] += 1
        else:
            creatures_prompt = f"""Here are the instructions for identifying and formatting creatures:
<instructions>
{creatures_instructions}
</instructions>

Here is the work you need to analyze:
<work_content>
{work_content}
</work_content>
"""
            creatures_response = call_gemini_api(creatures_prompt, "creature")
            if creatures_response:
                c_headers = ["creature_id","preferred_name","culture_group","creature_type","description_brief","symbolism_roles","alternate_names","notes","works_appeared_in"]
                append_to_csv(creatures_csv_path, creatures_response, c_headers, "creature", work_doc_id)
                creatures_count_after = count_rows_in_csv(creatures_csv_path)
                stats["creatures_added"] += (creatures_count_after - creatures_count_before)
            else:
                print("No response or error from Gemini for creatures.")
                stats["creatures_errors"] += 1
        
        stats["works_processed"] += 1
        
        # Ask if the user wants to process another work
        process_another = input("\nDo you want to process another work? (y/n): ")
        continue_processing = process_another.lower().startswith('y')
    
    # Print summary
    print("\n------------------------------")
    print("Processing Summary:")
    print(f"Works processed: {stats['works_processed']}")
    print(f"Key figures added: {stats['key_figures_added']}")
    print(f"Creatures added: {stats['creatures_added']}")
    if stats["key_figures_errors"] > 0 or stats["creatures_errors"] > 0:
        print(f"Errors encountered: Key figures: {stats['key_figures_errors']}, Creatures: {stats['creatures_errors']}")
    print("------------------------------")
    print("\nScript finished.")

def count_rows_in_csv(csv_file_path):
    """Count the number of rows in a CSV file, excluding the header."""
    if not os.path.isfile(csv_file_path):
        return 0
    
    try:
        with open(csv_file_path, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            # Skip header
            next(reader, None)
            return sum(1 for _ in reader)
    except Exception as e:
        print(f"Error counting rows in {csv_file_path}: {e}")
        return 0

if __name__ == "__main__":
    main() 