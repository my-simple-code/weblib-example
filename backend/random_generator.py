import random
import datetime

def id_generator():
    i = 1
    while True:
        yield i
        i += 1

id = id_generator()

def employee_generator():
    minAge = 18 * 365
    maxAge = 65 * 365
    genders = ['m', 'w']
    names = ['Mueller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann',
                'Schaefer', 'Koch', 'Bauer', 'Richter', 'Klein', 'Wolf', 'Schroeder', 'Neumann', 'Schwarz', 'Zimmermann',
                'Braun', 'Krueger', 'Hofmann', 'Hartmann', 'Lange', 'Schmitt', 'Werner', 'Schmitz', 'Krause', 'Meier',
                'Lehmann', 'Schmid', 'Schulze', 'Maier', 'Koehler', 'Herrmann', 'Koenig', 'Walter', 'Mayer', 'Huber',
                'Kaiser', 'Fuchs', 'Peters', 'Lang', 'Scholz', 'Moeller', 'Weiss', 'Jung', 'Hahn', 'Schubert',
                'Vogel', 'Friedrich', 'Keller', 'Guenther', 'Frank', 'Berger', 'Winkler', 'Roth', 'Beck', 'Lorenz',
                'Baumann', 'Franke', 'Albrecht', 'Schuster', 'Simon', 'Ludwig', 'Boehm', 'Winter', 'Kraus', 'Martin',
                'Schumacher', 'Kraemer', 'Vogt', 'Stein', 'Jaeger', 'Otto', 'Sommer', 'Gross', 'Seidel', 'Heinrich',
                'Brandt', 'Haas', 'Schreiber', 'Graf', 'Schulte', 'Dietrich', 'Ziegler', 'Kuhn', 'Kuehn', 'Pohl',
                'Engel', 'Horn', 'Busch', 'Bergmann', 'Thomas', 'Voigt', 'Sauer', 'Arnold', 'Wolff', 'Pfeiffer']
    first_names_w = ['Julia', 'Lisa', 'Katharina', 'Anne', 'Sarah', 'Maria', 'Laura', 'Franziska', 'Vanessa', 'Jessica']
    first_names_m = ['Daniel', 'Alexander', 'Tobias', 'Christian', 'Kevin', 'Maximilian', 'Michael', 'Patrick', 'Philipp', 'Dennis']

    while True:
        gender = random.choice(genders)
        age_days = random.randint(minAge, maxAge)
        yield dict(
                id = next(id),
                gender = gender,
                name = random.choice(names),
                first_name = random.choice(first_names_w) if gender == 'w' else random.choice(first_names_m),
                birthday = (datetime.datetime.today() - datetime.timedelta(days=age_days)).strftime('%d.%m.%Y')
            )

employee = employee_generator()
