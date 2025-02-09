import random

#Updated it a lil
while True:
    letters = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
        'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D',
        'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
        'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    ]
    numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    symbols = ['!', '#', '$', '%', '&', '(', ')', '*', '+']

    print("Welcome to pilawsk's Password Generator!")
    nr_letters = int(input("How many letters would you like in your password?\n"))
    nr_symbols = int(input(f"How many symbols would you like?\n"))
    nr_numbers = int(input(f"How many numbers would you like?\n"))

    password_list = []

    for _ in range(nr_letters):
        password_list.append(random.choice(letters))

    for _ in range(nr_symbols):
        password_list.append(random.choice(symbols))

    for _ in range(nr_numbers):
        password_list.append(random.choice(numbers))

    random.shuffle(password_list)

    password = ''.join(password_list)
    print(f"Your random password to use is: {password}")

    print("https://github.com/pilawsk/ScriptProjects is my GitHub code project page.")

    while True:
        user_input = input("Generate again? (y/n): ")
        if user_input == "n":
            print("Goodbye!")
            break  # Exit the inner loop and outer loop after this
        elif user_input == "y":
            print("Okay, let's make another password.\n---------------------------------------------------------------------------")
            break  # Exit the inner loop to start again
        else:
            print("Invalid input. Try again.")
            continue
    if user_input == "n":
        break  # Exit the outer loop
