import random

while True:
    print("Gamble Machine BEEP BOOP 1 in 10 chance to win (Roll The Number 4)")
    number = random.randint(1, 10)
    print("You have rolled:", number)

    if number == 4:
        print("You win!")
    else:
        print("You lose!")

    user_input = input("Play again? (y/n): ")
    if user_input == "n":
        break
    elif user_input == "y":
        print("Okay, let's play again!")
        print("-----------------------------------------------------------")