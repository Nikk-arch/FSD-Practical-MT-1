# MT1-LABEXAM — Online Food Ordering Web Application

A complete solution for the supplied Full Stack Development Node.js lab examination.

## Requirements covered

### Part A — Core Node.js HTTP + FS (`httpServer.js`, port 3000)
- Uses built-in `http` and `fs` modules; does not use Express.
- `GET /` — HTML welcome page.
- `GET /foods` — JSON array containing only foods where `availability` is `true`.
- `GET /about` — restaurant information.
- `GET /menu` — reads and serves `public/menu.html` using `fs.readFile()`.
- `POST /add-food` — accepts JSON and validates `id`, `foodName`, `category`, positive numeric `price`, and boolean `availability`.
- Returns 400 for invalid JSON/fields, 404 for unknown routes, and 500 if the menu file cannot be read.

### Part B — Express REST API (`expressApp.js`, port 4000)
- Uses `express.json()` and an in-memory JavaScript array (no database).
- `GET /foods`, `GET /foods/:id`, `POST /foods`, `PUT /foods/:id`, `DELETE /foods/:id`.
- Uses route parameters, JSON responses, validation, 201 on create, and 404 for missing items/routes.
- `PUT` expects the complete food object and requires its `id` to match the URL.

## Project setup

Install [Node.js](https://nodejs.org/) if it is not already installed. Open a terminal in this folder:

```bash
npm install
```

## Run the two servers

Open **two separate terminals** in the project folder.

Terminal 1 — HTTP server:

```bash
npm run start:http
```

Expected: `HTTP Server running at http://localhost:3000`

Terminal 2 — Express server:

```bash
npm run start:express
```

Expected: `Express Server running at http://localhost:4000`

## Browser checks (Part A)

- http://localhost:3000/
- http://localhost:3000/foods
- http://localhost:3000/about
- http://localhost:3000/menu

## Postman checks (Part B)

Import `postman/MT1-LABEXAM.postman_collection.json` into Postman. The collection includes GET all, GET by ID, POST, PUT, and DELETE requests.

Example POST body (Body → raw → JSON):

```json
{
  "id": 4,
  "foodName": "Cold Coffee",
  "category": "Beverage",
  "price": 120,
  "availability": true
}
```

Example PUT body for `/foods/1`:

```json
{
  "id": 1,
  "foodName": "Margherita Pizza",
  "category": "Fast Food",
  "price": 280,
  "availability": true
}
```

Recommended demonstration order: GET all → GET by ID → POST new item → GET the new ID → PUT an item → DELETE an item → GET all again.

## Submission screenshots

Save your own screenshots in `screenshots/` after running the project:
1. `http-server-running.png`
2. `http-menu-page.png`
3. `express-get-foods.png`
4. `express-post-food.png`
5. `express-put-food.png`
6. `express-delete-food.png`

The screenshots folder contains a checklist file. Screenshots are intentionally not fabricated; capture the actual running application on your computer.

## GitHub submission

The required repository name is `MT1-LABEXAM`. From this folder:

```bash
git init
git add .
git commit -m "Initial project setup"
git add httpServer.js public/menu.html
git commit -m "Implement Node HTTP routes and static menu serving"
git add expressApp.js
git commit -m "Implement Express food CRUD REST API"
git add README.md postman screenshots package.json
git commit -m "Add documentation and API testing collection"
```

Create a GitHub repository named `MT1-LABEXAM`, then connect and push (replace the URL with your own repository URL):

```bash
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/MT1-LABEXAM.git
git push -u origin main
```

## Important notes
- Data is stored in arrays, so it resets whenever either server restarts. This is expected because the exam explicitly says not to use a database.
- The two servers are independent and must be started separately.
