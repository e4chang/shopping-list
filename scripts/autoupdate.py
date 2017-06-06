import requests
import sqlite3

r = requests.get('https://www.padherder.com/api/evolutions/')
connection = sqlite3.connect('local.db')
c = connection.cursor()
c.close()

data = r.json()
print data['1']

