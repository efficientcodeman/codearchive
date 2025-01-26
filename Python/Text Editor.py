import sys

while True:
    text = "(PUT YOUR TEXT HERE)"
    print("WARNING! PROCEEDING WILL OVERWRITE YOUR TEXT FILE!")
    yor = input("Are you sure? (y/n): ")
    if yor == "y":
        break
    elif yor == "n":
        sys.exit()
    else:
        print("Invalid input. Try again.")
        continue
try:
    with open("C:/Users/(PUT LOCATION HERE", "w") as file:
        file.write(text)
        print("Text written successfully.")
except FileNotFoundError:
    print("An error occurred while writing to the file/not found.")
