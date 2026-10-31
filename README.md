# Shelfwise - Product Inventory & Analytics

**Student: Shivam Srivastava**

Shelfwise is a small inventory workspace built for the JavaScript curriculum. Its quiet green palette, compact product cards, and ledger-like inventory table give it a practical shop-tool feel. The browser dashboard is the main project; `capstone-console.js` provides the guide's console version, and `assignment-solutions.js` keeps each of the six practice exercises runnable on its own. Treat this as a learning draft: review the code, change examples or design choices to your own, and make sure you can explain each part before submitting it.

## Run the browser project

1. Open `index.html` in a current browser.
2. Use **Run capstone demo** and accept the suggested Monitor and $150 values to see the guide's sample report. You can enter your own values too.
3. Open **JavaScript lab** and run assignments 1-6. Assignments 2 and 3 ask for input with browser prompts. Open Developer Tools → Console to read their output.

The dashboard is plain HTML, CSS, and JavaScript. It does not need Node.js or an install step. To run the optional terminal capstone, install Node.js, open a terminal in this folder, and run `node capstone-console.js`. The VS Code Code Runner button may also try to run `app.js` with Node.js; open `index.html` in a browser to run the actual dashboard.

## Project contents

- `index.html` - dashboard structure, product form, analytics, and learning lab.
- `styles.css` - responsive Shelfwise visual design.
- `app.js` - dashboard behavior, local storage, categories, financial analytics, six learning exercises, and interactive capstone.
- `assignment-solutions.js` - standalone examples for assignments 1-6.
- `capstone-console.js` - standalone console capstone with validation, categories, totals, affordable-item filtering, and formatted output.

## Guide mapping

The six assignments demonstrate variable declarations and `typeof`, numeric input and operators, conditional grading, `for`/`while`/`do...while` loops, function defaults and block scope, and the `forEach`/`filter`/`map` array methods. The capstone starts with Laptop ($800) and Mouse ($25); adding Monitor ($150) yields the guide's $975 total. Prices below $50 are Budget, $50 to below $200 are Standard, and $200 or above are Premium.

## Dashboard features

- Add, search, filter, and remove products.
- View inventory totals, category breakdowns, average price, and highest priced item.
- Create an affordable-items report and adjust tax and discount assumptions.
- Keep changes in browser local storage on the current device.

## Upload to GitHub

Create a new empty repository on GitHub, then upload the files in this folder (`index.html`, `styles.css`, `app.js`, the two exercise/capstone scripts, this README, and `.gitignore`). You can use GitHub's **Add file → Upload files** page, or use Git from a terminal:

```bash
git init
git add .
git commit -m "Add Shelfwise inventory project"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the remote URL with the one GitHub gives your repository. To preview the site online, enable GitHub Pages for the `main` branch and the repository root.

This is a learning project. The sample prices use USD to match the supplied guide. No server or package installation is needed for the browser dashboard.
