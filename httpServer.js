import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;

let foods = [
  { id: 1, foodName: "Pizza", category: "Fast Food", price: 250, availability: true },
  { id: 2, foodName: "Burger", category: "Fast Food", price: 120, availability: true },
  { id: 3, foodName: "Cold Coffee", category: "Beverage", price: 100, availability: false }
];

function send(res, statusCode, contentType, data) {
  res.writeHead(statusCode, { "Content-Type": contentType });
  res.end(data);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 1e6) {
        reject(new Error("Request body is too large."));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!body.trim()) return reject(new Error("Request body is required."));
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON in request body."));
      }
    });
    req.on("error", reject);
  });
}

function hasRequiredFoodFields(food) {
  return food && typeof food === "object" &&
    food.id !== undefined && food.id !== null &&
    typeof food.foodName === "string" && food.foodName.trim() !== "" &&
    typeof food.category === "string" && food.category.trim() !== "" &&
    typeof food.price === "number" && Number.isFinite(food.price) && food.price > 0 &&
    typeof food.availability === "boolean";
}

const server = http.createServer(async (req, res) => {
  const pathname = new URL(req.url, `http://${req.headers.host || "localhost"}`).pathname;

  if (req.method === "GET" && pathname === "/") {
    return send(res, 200, "text/html; charset=utf-8",
      `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Food Ordering</title></head>
      <body><h1>Welcome to Food Ordering</h1><p>Explore our menu and order your favourite food.</p>
      <p><a href="/foods">View available foods</a> | <a href="/menu">Open menu</a> | <a href="/about">About us</a></p></body></html>`);
  }

  if (req.method === "GET" && pathname === "/foods") {
    const availableFoods = foods.filter(food => food.availability === true);
    return send(res, 200, "application/json; charset=utf-8", JSON.stringify(availableFoods, null, 2));
  }

  if (req.method === "GET" && pathname === "/about") {
    return send(res, 200, "text/html; charset=utf-8",
      "<!DOCTYPE html><html><body><h1>About Our Restaurant</h1><p>We serve fresh, delicious food and beverages.</p></body></html>");
  }

  if (req.method === "GET" && pathname === "/menu") {
    const menuPath = path.join(__dirname, "public", "menu.html");
    return fs.readFile(menuPath, "utf8", (error, content) => {
      if (error) {
        return send(res, 500, "application/json; charset=utf-8",
          JSON.stringify({ error: "Unable to read the menu file." }));
      }
      send(res, 200, "text/html; charset=utf-8", content);
    });
  }

  if (req.method === "POST" && pathname === "/add-food") {
    try {
      const newFood = await readJsonBody(req);
      if (!hasRequiredFoodFields(newFood)) {
        return send(res, 400, "application/json; charset=utf-8",
          JSON.stringify({ error: "Required fields: id, foodName, category, positive price, availability (boolean)." }));
      }
      if (foods.some(food => String(food.id) === String(newFood.id))) {
        return send(res, 400, "application/json; charset=utf-8",
          JSON.stringify({ error: "A food item with this id already exists." }));
      }
      foods.push(newFood);
      return send(res, 201, "application/json; charset=utf-8",
        JSON.stringify({ message: "Food item added successfully", food: newFood }));
    } catch (error) {
      return send(res, 400, "application/json; charset=utf-8", JSON.stringify({ error: error.message }));
    }
  }

  return send(res, 404, "application/json; charset=utf-8",
    JSON.stringify({ error: "Route not found." }));
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
