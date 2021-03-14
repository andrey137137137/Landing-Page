monthes = {
  "january": 31,
  "february": 28,
  "march": 31,
  "april": 30,
  "may": 31,
  "june": 30,
  "jule": 31,
  "august": 31,
  "september": 30,
  "october": 31,
  "november": 30,
  "december": 31
}

month = input("Введите название месяца: ")
year = int(input("Введите год: "))

if (month == "february") and (year % 4 == 0):
  monthes[month] = 29

print("Количество дней: ", monthes[month])
