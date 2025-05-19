# Code Comment Cleaner (CCC)

A powerful utility script designed to quickly remove comments from source code files across large codebases. Perfect for preparing code for deployment, reducing file sizes, or cleaning up before sharing with others.

## Features

- **Fast Processing**: Remove comments from large codebases in seconds
- **Multiple Languages**: Support for various programming languages
- **Backup Protection**: Creates backup files by default for safety
- **Recursive Processing**: Scan subdirectories with a single command
- **Smart Detection**: Automatically detects file types by extension

## Supported Languages

Currently supports comment removal for:
- Python (`.py`)
- HTML (`.html`, `.htm`)
- CSS (`.css`)
- JavaScript (`.js`)
- TypeScript (`.ts`)
- C (`.c`, `.h`)
- C++ (`.cpp`, `.hpp`, `.cc`, `.cxx`)
- Java (`.java`)
- Ruby (`.rb`)
- Go (`.go`)
- PHP (`.php`)
- SQL (`.sql`)
- Swift (`.swift`)
- Rust (`.rs`)
- Kotlin (`.kt`)
- Bash/Shell (`.sh`, `.bash`)
- PowerShell (`.ps1`)
- Lua (`.lua`)
- Perl (`.pl`, `.pm`)
- YAML (`.yaml`, `.yml`)
- Haskell (`.hs`)
- Dart (`.dart`)
- MATLAB (`.m`)
- R (`.r`, `.R`)
- C# (`.cs`)

*More languages will be added in future updates.*

## Installation

No installation required. Simply download the `ccc.py` script and run it using Python 3.

```bash
# Clone or download the script
python ccc.py --help
```

## Usage

Basic usage:

```bash
python ccc.py [file_pattern] [options]
```

Examples:

```bash
# Process all Python files in current directory
python ccc.py *.py

# Process JavaScript files in the src directory
python ccc.py src/*.js

# Process all C++ files without creating backups
python ccc.py *.cpp --no-backup

# Process all files in the project directory and subdirectories
python ccc.py *.* --recursive

# Process unknown file types
python ccc.py config.txt --force
```

## Command Line Options

- `file_pattern`: Pattern to match files (e.g., `*.py`, `src/*.js`)
- `--no-backup`: Skip creating backup files (use with caution)
- `--force`: Process files with unknown extensions
- `--recursive`: Process files in subdirectories

## Warning

Always run this script on a copy of your code or ensure you have proper version control in place. While the script creates backups by default, it's always better to be safe than sorry.

## Future Improvements

- Support for more programming languages
- Preserve important comments (like license headers)
- Option to only remove certain types of comments
- Performance optimizations for very large codebases

## License

Feel free to modify and distribute according to your needs.