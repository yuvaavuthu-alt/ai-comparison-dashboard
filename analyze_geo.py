import os
import json
import re
import glob

def analyze_markdown(content):
    # Split into sections to focus on the response part
    parts = content.split('## AI Response')
    if len(parts) > 1:
        response_text = parts[1]
    else:
        response_text = content

    # Basic Metrics
    word_count = len(response_text.split())
    
    # --- Standard Markdown Structure ---
    headers = len(re.findall(r'^#+\s', response_text, re.MULTILINE))
    bullet_points = len(re.findall(r'^\s*[-*+]\s', response_text, re.MULTILINE))
    bold_phrases = len(re.findall(r'\*\*[^*]+\*\*|__[^_]+__', response_text))
    
    # --- Heuristic / Implicit Structure Detection ---
    # Detect "visual" bullets that didn't copy as markdown (e.g. unicode bullets or just lines)
    # Look for lines starting with unicode bullets
    unicode_bullets = len(re.findall(r'^\s*[•⁃▪‣]\s', response_text, re.MULTILINE))
    
    # Look for "implicit lists": blocks of 3+ lines that are relatively short (< 40 words) 
    # and look like distinct items, not just wrapped text.
    lines = [line.strip() for line in response_text.split('\n') if line.strip()]
    implicit_list_items = 0
    consecutive_short_lines = 0
    
    for line in lines:
        # Check if line is short enough to be a list item but long enough to be content
        words = len(line.split())
        if 3 < words < 40: 
            consecutive_short_lines += 1
        else:
            if consecutive_short_lines >= 3:
                implicit_list_items += consecutive_short_lines
            consecutive_short_lines = 0
    # Catch trailing group
    if consecutive_short_lines >= 3:
        implicit_list_items += consecutive_short_lines

    # Total effective bullets (standard + unicode + implicit)
    # We take the max of standard vs implicit to avoid double counting if standard bullets are short lines
    effective_bullets = max(bullet_points, unicode_bullets, implicit_list_items)

    # Detect "implicit headers": Short lines (< 10 words) that are not list items
    # often followed by a blank line or longer text.
    implicit_headers = 0
    for i, line in enumerate(lines):
        words = len(line.split())
        # Heuristic: Short, no end punctuation (or ends in colon), not a bullet
        if 0 < words < 10 and not re.match(r'^[-*+•⁃▪‣]', line):
            if not line.endswith('.') or line.endswith(':'):
                # Check if it looks like a header (e.g. all caps or title case)
                if line[0].isupper():
                    implicit_headers += 1
    
    # Effective headers
    effective_headers = max(headers, implicit_headers)

    # Key Terms
    keywords = ['Verizon', 'Unlimited', '5G', 'Plan', 'Fios', 'Welcome', 'Ultimate', 'Plus', 'Play', 'Do More', 'Get More']
    keyword_counts = {kw: len(re.findall(r'\b' + re.escape(kw) + r'\b', response_text, re.IGNORECASE)) for kw in keywords}
    total_keywords = sum(keyword_counts.values())
    
    # Readability
    # Split by . ! ? but handle common abbreviations if possible (simple split for now)
    sentences = re.split(r'[.!?]+', response_text)
    sentences = [s.strip() for s in sentences if s.strip()]
    avg_sentence_length = word_count / len(sentences) if sentences else 0
    
    # --- GEO Score Calculation (0-100) ---
    
    # 1. Structure Score (40 points)
    # Reward explicit markdown heavily, but give partial credit for implicit structure
    # Ideal: 5+ headers, 5+ bullets
    
    header_score = min(20, (headers * 4) + (implicit_headers * 2))
    bullet_score = min(20, (bullet_points * 2) + (unicode_bullets * 2) + (implicit_list_items * 1))
    structure_score = min(40, header_score + bullet_score)
    
    # 2. Content Density (40 points)
    # Keywords per 100 words. Target ~5-8% density.
    density = (total_keywords / word_count) * 100 if word_count > 0 else 0
    density_score = min(40, density * 6) 
    
    # 3. Formatting/Emphasis (20 points)
    # Bold text is key for scanning.
    formatting_score = min(20, bold_phrases * 2)
    
    # Bonus: If structure is purely implicit, cap the score slightly to encourage better formatting
    total_score = int(structure_score + density_score + formatting_score)
    
    # Formatting Warning Flag
    formatting_issues = []
    if headers == 0 and implicit_headers > 0:
        formatting_issues.append("Implicit Headers")
    if bullet_points == 0 and (unicode_bullets > 0 or implicit_list_items > 0):
        formatting_issues.append("Implicit Lists")
    if bold_phrases == 0:
        formatting_issues.append("No Bold Text")

    return {
        "word_count": word_count,
        "structure": {
            "headers": headers,
            "effective_headers": effective_headers,
            "bullet_points": bullet_points,
            "effective_bullets": effective_bullets,
            "bold_phrases": bold_phrases
        },
        "keywords": keyword_counts,
        "readability": {
            "avg_sentence_length": round(avg_sentence_length, 1),
            "sentence_count": len(sentences)
        },
        "geo_score": min(100, total_score),
        "formatting_issues": formatting_issues
    }

def main():
    data_dir = 'data/details'
    output_file = 'data/geo_analysis.json'
    
    analysis_results = {}
    
    files = glob.glob(os.path.join(data_dir, '*.md'))
    print(f"Found {len(files)} markdown files.")
    
    for file_path in files:
        filename = os.path.basename(file_path)
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                analysis = analyze_markdown(content)
                analysis_results[filename] = analysis
        except Exception as e:
            print(f"Error processing {filename}: {e}")
            
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(analysis_results, f, indent=2)
        
    print(f"Analysis saved to {output_file}")

if __name__ == "__main__":
    main()
