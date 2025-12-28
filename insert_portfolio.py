import sys

# Read the original file
with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Read the new content to insert
with open('temp_portfolio_items.html', 'r', encoding='utf-8') as f:
    new_content = f.read()

# Find the line to insert before (line 240 is index 239)
# We want to insert before the closing tags of portfolio-grid
insert_line = 240

# Insert the new content
output_lines = lines[:insert_line] + [new_content] + lines[insert_line:]

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.writelines(output_lines)

print("Successfully inserted 4 new portfolio items!")
