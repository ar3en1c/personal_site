# Static Personal Site (GitHub Pages)

This is a static version of the personal site. It is served by **GitHub Pages** and reads all
its content from **CSV files** in the `data/` folder — so you can use **Excel as your admin panel**:
edit a CSV, save it, commit & push, and the live site updates.

## Layout
| Path | Purpose |
|------|---------|
| `index.html` | Home page (about, skills, samples, contact) |
| `resume.html` | Resume page (education, work, languages, certificates) |
| `sample.html` | Sample works page |
| `css/` | Stylesheets (Vazir font, page styles) |
| `js/app.js` | Renderer that reads the CSVs and builds the pages |
| `data/*.csv` | **The content you edit in Excel** |
| `img/` | Profile photo + icons |
| `media/` | Project / education / work images |

## The CSVs (edit these in Excel)
| File | Columns | Used on |
|------|---------|---------|
| `person.csv` | name, occupations, about, image | home + resume |
| `contact.csv` | mail, telegram, name | home + resume |
| `skills.csv` | name, percent | home |
| `samples.csv` | name, description, image, link, is_active | home + sample |
| `education.csv` | reshte, university, zaman, image | resume |
| `work.csv` | title, place, zaman, image | resume |
| `languages.csv` | name, percent | resume |
| `certificates.csv` | name, issuer, date, link | resume |

## Rules / gotchas
1. **Save CSVs as UTF-8 (with BOM)** so Persian text is read correctly in Excel *and* on the site.
   - In Excel: *File → Save As → CSV UTF-8 (Comma delimited)*.
2. **Do not rename the header row** (first line) — the site uses those column names.
3. `is_active` in `samples.csv`: `1` = show, `0` = hide.
4. Images are referenced by path relative to the site root, e.g. `media/sample_images/name.png`.
   Put new images into the matching folder under `media/` and reference them in the CSV.
5. If a description or any cell contains a comma, Excel will quote it automatically — keep it quoted.

## Run locally
Start a simple HTTP server from this folder (needed because `fetch()` of CSV won't work from
`file://`):
```powershell
py -m http.server 8000
# open http://localhost:8000
```
