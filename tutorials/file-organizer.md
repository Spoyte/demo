# File Organizer Tutorial

Learn how to use the File Organizer to intelligently organize files by content type.

## Overview

File Organizer analyzes file contents (with OCR for images/PDFs) and organizes them into a clean structure.

## Basic Usage

```bash
# Organize current directory
file-organizer

# Organize specific directory
file-organizer --input /path/to/messy/folder --output /path/to/organized

# Dry run (see what would happen)
file-organizer --dry-run

# Include OCR for images
file-organizer --ocr
```

## Example

```bash
# Before: messy folder with mixed files
$ ls ~/Downloads/
scan_001.pdf  IMG_2342.jpg  report.docx  notes.txt  screenshot.png

# After: organized by content type
$ file-organizer --input ~/Downloads --output ~/Organized
$ tree ~/Organized/
~/Organized/
├── Documents/
│   ├── report.docx
│   └── notes.txt
├── Images/
│   ├── IMG_2342.jpg
│   └── screenshot.png
└── Scanned/
    └── scan_001.pdf
```

## Tips

- Use `--dry-run` first to preview changes
- Enable `--ocr` to extract text from images for better categorization
- The tool preserves original files by default (copies instead of moves)
- Use `--move` to move instead of copy (faster but irreversible)
