# One-time migration helper: pull content from the old MySQL DB
# and write it into UTF-8 (with BOM) CSV files for the static site.
# The CSV files become the new source of truth (editable in Excel).
import csv
import os
import mysql.connector

CONN = dict(
    host='192.168.200.70',
    user='erfan',
    password='Torrent134134#',
    database='personal-django',
)
DATA = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static_site', 'data')
os.makedirs(DATA, exist_ok=True)


def write(name, headers, rows):
    path = os.path.join(DATA, name)
    with open(path, 'w', newline='', encoding='utf-8-sig') as f:
        w = csv.writer(f)
        w.writerow(headers)
        for r in rows:
            w.writerow(r)
    print('wrote', name, len(rows))


c = mysql.connector.connect(**CONN, connection_timeout=15)
cur = c.cursor()

cur.execute("SELECT name, occupations, about_us_text FROM mainPage_person ORDER BY id LIMIT 1")
p = cur.fetchone()
write('person.csv', ['name', 'occupations', 'about', 'image'],
      [[p[0], p[1], p[2], 'img/profile.jpg']])

cur.execute("SELECT mail, telegram_link FROM mainPage_contact ORDER BY id LIMIT 1")
ct = cur.fetchone()
write('contact.csv', ['mail', 'telegram', 'name'],
      [[ct[0], ct[1], 'عرفان قندی']])

cur.execute("SELECT name, percent FROM mainPage_skills ORDER BY percent DESC")
write('skills.csv', ['name', 'percent'],
      [[r[0], r[1]] for r in cur.fetchall()])

cur.execute("SELECT name, description, image, link, is_active FROM sample_samplelist ORDER BY id")
write('samples.csv', ['name', 'description', 'image', 'link', 'is_active'],
      [[r[0], r[1], 'media/' + r[2], r[3], r[4]] for r in cur.fetchall()])

cur.execute("SELECT name_reshte, name_university, zaman_tahsil, pic FROM resume_tahsilat ORDER BY id")
write('education.csv', ['reshte', 'university', 'zaman', 'image'],
      [[r[0], r[1], r[2], 'media/' + r[3]] for r in cur.fetchall()])

cur.execute("SELECT title_kari, mahl_kari, zaman_kar, pic FROM resume_savabeghkari ORDER BY id")
write('work.csv', ['title', 'place', 'zaman', 'image'],
      [[r[0], r[1], r[2], 'media/' + r[3]] for r in cur.fetchall()])

cur.execute("SELECT name_zaban, percent FROM resume_zaban ORDER BY id")
write('languages.csv', ['name', 'percent'],
      [[r[0], r[1]] for r in cur.fetchall()])

cur.execute("SELECT name_madrak, sader_konande, date, link FROM resume_madarek ORDER BY id")
write('certificates.csv', ['name', 'issuer', 'date', 'link'],
      [[r[0], r[1], r[2], r[3]] for r in cur.fetchall()])

c.close()
print('ALL DONE')
