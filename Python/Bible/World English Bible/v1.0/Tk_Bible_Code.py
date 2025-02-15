#       _ _                    _    _                         
# _ __ (_) | __ ___      _____| | _( )___                     
#| '_ \| | |/ _` \ \ /\ / / __| |/ /// __|                    
#| |_) | | | (_| |\ V  V /\__ \   <  \__ \                    
#| .__/|_|_|\__,_| \_/\_/ |___/_|\_\ |___/                    
#|_|__        _   _                      ____  _ _     _      
#|  _ \ _   _| |_| |__   ___  _ __      | __ )(_) |__ | | ___ 
#| |_) | | | | __| '_ \ / _ \| '_ \     |  _ \| | '_ \| |/ _ \
#|  __/| |_| | |_| | | | (_) | | | |    | |_) | | |_) | |  __/
#|_|    \__, |\__|_| |_|\___/|_| |_|    |____/|_|_.__/|_|\___|
#       |___/                                                 

#https://github.com/pilawsk/ScriptProjects

#    ////////////////////////////////////////
#    //     © 2025 Tk_Bible_Code.py        //
#    //       All rights reserved          //
#    ////////////////////////////////////////
#    //     This material may not be       //
#    //     reproduced, displayed,         //
#    //     modified, or distributed       //
#    //     without the express prior      //
#    //     written permission of the      //
#    //         copyright holder.          //
#    ////////////////////////////////////////
]]

import tkinter as tk
from tkinter import ttk
import requests


# Function to fetch Bible verses from the API
def fetch_verse(book, chapter, verse):
    url = f"https://bible-api.com/{book}+{chapter}:{verse}?translation=web"
    try:
        response = requests.get(url)
        response.raise_for_status()  # Check if the request was successful (status code 200)
        data = response.json()
        return data.get("text", "Verse not found.")
    except requests.exceptions.RequestException as e:
        return f"Error fetching verse: {e}"


# Function to display the selected verse
def display_verse():
    book = selected_book.get()
    chapter = selected_chapter.get()
    verse = selected_verse.get()

    # Make sure that chapter and verse are valid integers
    try:
        chapter = int(chapter)
        verse = int(verse)
    except ValueError:
        text_display.delete(1.0, tk.END)
        text_display.insert(tk.END, "Invalid chapter or verse number.")
        return

    verse_text = fetch_verse(book, chapter, verse)
    text_display.delete(1.0, tk.END)
    text_display.insert(tk.END, verse_text)


# Function to update the chapter and verse dropdowns based on the selected book
def update_chapters_and_verses(*args):
    book = selected_book.get()
    max_chapter = book_max_chapters_verses[book]["chapters"]
    max_verse = book_max_chapters_verses[book]["verses"]

    # Update chapter dropdown
    chapter_dropdown['values'] = list(range(1, max_chapter + 1))
    selected_chapter.set(1)

    # Update verse dropdown
    verse_dropdown['values'] = list(range(1, max_verse + 1))
    selected_verse.set(1)


# Create the main window
root = tk.Tk()
root.title("WEB Bible Viewer")

# Dictionary to store the maximum chapters and verses for each book
book_max_chapters_verses = {
# Old Testament
    "Genesis": {"chapters": 50, "verses": 1533},
    "Exodus": {"chapters": 40, "verses": 1213},
    "Leviticus": {"chapters": 27, "verses": 859},
    "Numbers": {"chapters": 36, "verses": 1288},
    "Deuteronomy": {"chapters": 34, "verses": 959},
    "Joshua": {"chapters": 24, "verses": 658},
    "Judges": {"chapters": 21, "verses": 618},
    "Ruth": {"chapters": 4, "verses": 85},
    "1 Samuel": {"chapters": 31, "verses": 810},
    "2 Samuel": {"chapters": 24, "verses": 695},
    "1 Kings": {"chapters": 22, "verses": 816},
    "2 Kings": {"chapters": 25, "verses": 719},
    "1 Chronicles": {"chapters": 29, "verses": 942},
    "2 Chronicles": {"chapters": 36, "verses": 822},
    "Ezra": {"chapters": 10, "verses": 280},
    "Nehemiah": {"chapters": 13, "verses": 406},
    "Esther": {"chapters": 10, "verses": 167},
    "Job": {"chapters": 42, "verses": 1070},
    "Psalms": {"chapters": 150, "verses": 2461},
    "Proverbs": {"chapters": 31, "verses": 915},
    "Ecclesiastes": {"chapters": 12, "verses": 222},
    "Song of Solomon": {"chapters": 8, "verses": 117},
    "Isaiah": {"chapters": 66, "verses": 1292},
    "Jeremiah": {"chapters": 52, "verses": 1364},
    "Lamentations": {"chapters": 5, "verses": 154},
    "Ezekiel": {"chapters": 48, "verses": 1273},
    "Daniel": {"chapters": 12, "verses": 357},
    "Hosea": {"chapters": 14, "verses": 197},
    "Joel": {"chapters": 3, "verses": 73},
    "Amos": {"chapters": 9, "verses": 146},
    "Obadiah": {"chapters": 1, "verses": 21},
    "Jonah": {"chapters": 4, "verses": 48},
    "Micah": {"chapters": 7, "verses": 105},
    "Nahum": {"chapters": 3, "verses": 47},
    "Habakkuk": {"chapters": 3, "verses": 56},
    "Zephaniah": {"chapters": 3, "verses": 53},
    "Haggai": {"chapters": 2, "verses": 38},
    "Zechariah": {"chapters": 14, "verses": 211},
    "Malachi": {"chapters": 4, "verses": 55},

    # New Testament
    "Matthew": {"chapters": 28, "verses": 1071},
    "Mark": {"chapters": 16, "verses": 678},
    "Luke": {"chapters": 24, "verses": 1151},
    "John": {"chapters": 21, "verses": 879},
    "Acts": {"chapters": 28, "verses": 1007},
    "Romans": {"chapters": 16, "verses": 433},
    "1 Corinthians": {"chapters": 16, "verses": 437},
    "2 Corinthians": {"chapters": 13, "verses": 257},
    "Galatians": {"chapters": 6, "verses": 149},
    "Ephesians": {"chapters": 6, "verses": 155},
    "Philippians": {"chapters": 4, "verses": 104},
    "Colossians": {"chapters": 4, "verses": 95},
    "1 Thessalonians": {"chapters": 5, "verses": 89},
    "2 Thessalonians": {"chapters": 3, "verses": 47},
    "1 Timothy": {"chapters": 6, "verses": 113},
    "2 Timothy": {"chapters": 4, "verses": 83},
    "Titus": {"chapters": 3, "verses": 46},
    "Philemon": {"chapters": 1, "verses": 25},
    "Hebrews": {"chapters": 13, "verses": 303},
    "James": {"chapters": 5, "verses": 108},
    "1 Peter": {"chapters": 5, "verses": 105},
    "2 Peter": {"chapters": 3, "verses": 61},
    "1 John": {"chapters": 5, "verses": 105},
    "2 John": {"chapters": 1, "verses": 13},
    "3 John": {"chapters": 1, "verses": 15},
    "Jude": {"chapters": 1, "verses": 25},
    "Revelation": {"chapters": 22, "verses": 404},
}

# List of Bible books
books = list(book_max_chapters_verses.keys())

# Variables to store the selected book, chapter, and verse
selected_book = tk.StringVar()
selected_chapter = tk.StringVar()
selected_verse = tk.StringVar()

# Create and place the book dropdown
book_label = ttk.Label(root, text="Book:")
book_label.grid(row=0, column=0, padx=10, pady=10)
book_dropdown = ttk.Combobox(root, textvariable=selected_book)
book_dropdown['values'] = books
book_dropdown.grid(row=0, column=1, padx=10, pady=10)
selected_book.set(books[0])  # Set default book
book_dropdown.bind('<<ComboboxSelected>>', update_chapters_and_verses)

# Create and place the chapter dropdown
chapter_label = ttk.Label(root, text="Chapter:")
chapter_label.grid(row=1, column=0, padx=10, pady=10)
chapter_dropdown = ttk.Combobox(root, textvariable=selected_chapter)
chapter_dropdown.grid(row=1, column=1, padx=10, pady=10)

# Create and place the verse dropdown
verse_label = ttk.Label(root, text="Verse:")
verse_label.grid(row=2, column=0, padx=10, pady=10)
verse_dropdown = ttk.Combobox(root, textvariable=selected_verse)
verse_dropdown.grid(row=2, column=1, padx=10, pady=10)

# Create and place the display button
display_button = ttk.Button(root, text="Display Verse", command=display_verse)
display_button.grid(row=3, column=0, columnspan=2, pady=10)

# Create and place the text display area
text_display = tk.Text(root, wrap=tk.WORD, width=50, height=10)
text_display.grid(row=4, column=0, columnspan=2, padx=10, pady=10)

# Initialize the chapter and verse dropdowns
update_chapters_and_verses()

# Start the Tkinter event loop
root.mainloop()
