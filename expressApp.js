import express from "express";

const app = express();
const PORT = 4000;

app.use(express.json());

let foods = [
  { id: 1, foodName: "Pizza", category: "Fast Food", price: 250, availability: true },
  { id: 2, foodName: "Burger", category: "Fast Food", price: 120, availability: true },
  { id: 3, foodName: "Cold Coffee", category: "Beverage", price: 100, availability: false }
];

const requiredFields = ["id", "foodName", "category", "price", "availability"];

function validateFood(food) {
  if (!food || typeof food !== "object" || Array.isArray(food)) {
    return "Request body must be a JSON object.";
  }
  for (const field of requiredFields) {
    if (!(field in food)) return `Missing required field: ${field}.`;
  }
  if (food.id === null || food.id === "") return "id must not be empty.";
  if (typeof food.foodName !== "string" || !food.foodName.trim()) return "foodName must be a non-empty string.";
  if (typeof food.category !== "string" || !food.category.trim()) return "category must be a non-empty string.";
  if (typeof food.price !== "number" || !Number.isFinite(food.price) || food.price <= 0) {
    return "price must be a positive number.";
  }
  if (typeof food.availability !== "boolean") return "availability must be true or false.";
  return null;
}

// GET /foods - retrieve all food items
app.get("/foods", (req, res) => {
  res.status(200).json(foods);
});

// GET /foods/:id - retrieve one food item
app.get("/foods/:id", (req, res) => {
  const food = foods.find(item => String(item.id) === req.params.id);
  if (!food) return res.status(404).json({ error: "Food item not found." });
  res.status(200).json(food);
});

// POST /foods - add a food item
app.post("/foods", (req, res) => {
  const validationError = validateFood(req.body);
  if (validationError) return res.status(400).json({ error: validationError });

  if (foods.some(item => String(item.id) === String(req.body.id))) {
    return res.status(400).json({ error: "A food item with this id already exists." });
  }

  const newFood = {
    id: req.body.id,
    foodName: req.body.foodName.trim(),
    category: req.body.category.trim(),
    price: req.body.price,
    availability: req.body.availability
  };
  foods.push(newFood);
  res.status(201).json({ message: "Food item added successfully", food: newFood });
});

// PUT /foods/:id - update an existing food item
app.put("/foods/:id", (req, res) => {
  const index = foods.findIndex(item => String(item.id) === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Food item not found." });

  const validationError = validateFood(req.body);
  if (validationError) return res.status(400).json({ error: validationError });

  if (String(req.body.id) !== req.params.id) {
    return res.status(400).json({ error: "The body id must match the id in the URL." });
  }

  foods[index] = {
    id: req.body.id,
    foodName: req.body.foodName.trim(),
    category: req.body.category.trim(),
    price: req.body.price,
    availability: req.body.availability
  };
  res.status(200).json({ message: "Food item updated successfully", food: foods[index] });
});

// DELETE /foods/:id - delete an existing food item
app.delete("/foods/:id", (req, res) => {
  const index = foods.findIndex(item => String(item.id) === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Food item not found." });

  const deletedFood = foods.splice(index, 1)[0];
  res.status(200).json({ message: "Food item deleted successfully", food: deletedFood });
});

// Malformed JSON sent to express.json()
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON request body." });
  }
  next(err);
});

// Invalid routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
