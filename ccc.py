import os
import re
import sys
import glob
import shutil
import argparse

def identify_language(file_path):
    """Identify language based on file extension."""
    ext = os.path.splitext(file_path)[1].lower()
    if ext == '.py':
        return 'python'
    elif ext in ['.html', '.htm']:
        return 'html'
    elif ext == '.css':
        return 'css'
    elif ext == '.js':
        return 'javascript'
    elif ext in ['.c', '.h']:
        return 'c'
    elif ext in ['.cpp', '.hpp', '.cc', '.cxx']:
        return 'cpp'
    else:
        return 'unknown'

def remove_comments(content, language):
    """Remove comments based on language."""
    if language == 'python':
        # Remove multi-line comments (triple quotes)
        content = re.sub(r'"""[\s\S]*?"""', '', content)
        content = re.sub(r"'''[\s\S]*?'''", '', content)
        
        # Handle line comments
        result = []
        for line in content.split('\n'):
            if '#' in line:
                line = line.split('#')[0]
            result.append(line)
        
    elif language == 'html':
        # Handle HTML comments <!-- -->
        content = re.sub(r'<!--[\s\S]*?-->', '', content)
        result = content.split('\n')
        
    elif language in ['css', 'javascript', 'c', 'cpp']:
        # Handle C-style block comments /* */
        content = re.sub(r'/\*[\s\S]*?\*/', '', content)
        
        # Handle line comments for respective languages
        result = []
        for line in content.split('\n'):
            if language in ['javascript', 'css']:
                if '//' in line:
                    line = line.split('//')[0]
            elif language in ['c', 'cpp']:
                if '//' in line:
                    line = line.split('//')[0]
            result.append(line)
    else:
        # For unknown languages, return as is
        return content
    
    # Clean up the result
    cleaned = '\n'.join(line.rstrip() for line in result)
    
    # Remove excessive newlines
    cleaned = re.sub(r'\n\s*\n\s*\n', '\n\n', cleaned)
    
    return cleaned

def process_file(file_path, backup=True, force=False):
    """Process a file to remove comments."""
    language = identify_language(file_path)
    
    if language == 'unknown' and not force:
        print(f"Skipping {file_path}: Unknown file type. Use --force to process anyway.")
        return False
    
    print(f"Processing: {file_path} (detected as {language})")

    if backup:
        backup_path = file_path + '.bak'
        shutil.copy2(file_path, backup_path)
        print(f"  Backup created: {backup_path}")

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        cleaned = remove_comments(content, language)

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(cleaned)

        print(f"  Removed comments successfully")
        return True
    except Exception as e:
        print(f"  Error processing {file_path}: {e}")
        if backup:
            shutil.copy2(backup_path, file_path)
            print(f"  Restored from backup due to error")
        return False

def main():
    parser = argparse.ArgumentParser(description='Remove comments from code files.')
    parser.add_argument('file_pattern', help='File pattern to match (e.g., *.py, src/*.js)')
    parser.add_argument('--no-backup', action='store_true', help='Skip creating backup files')
    parser.add_argument('--force', action='store_true', help='Process unknown file types')
    parser.add_argument('--recursive', action='store_true', help='Process files recursively')
    
    args = parser.parse_args()
    
    # Handle recursive globbing
    if args.recursive and '**' not in args.file_pattern:
        file_pattern = os.path.join('**', args.file_pattern)
    else:
        file_pattern = args.file_pattern
    
    files = glob.glob(file_pattern, recursive=args.recursive)

    if not files:
        print(f"No files found matching pattern: {args.file_pattern}")
        return

    print(f"Found {len(files)} files matching {args.file_pattern}")
    success_count = 0
    
    for file_path in files:
        if process_file(file_path, backup=not args.no_backup, force=args.force):
            success_count += 1

    print(f"Done! Successfully processed {success_count} of {len(files)} files.")

if __name__ == "__main__":
    main()