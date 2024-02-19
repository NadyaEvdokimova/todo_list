import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'permalist',
  password: 'LtCfM23b06%p',
  port: 5432,
});
db.connect();

async function checkToDoList() {
  const result = await db.query("SELECT * FROM items");
  const itemsResult = result.rows;
  let items = [];
  itemsResult.forEach((item) => {
    items.push(item);
  });
  return items;
}

app.get("/", async (req, res) => {
  let items = await checkToDoList();
  console.log(items);
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
  try {
    await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
  } catch(err) {
    console.log(err);
  };
  res.redirect("/");
});

app.post("/edit", async(req, res) => {
  let currentId = req.body.updatedItemId;
  let updatedTitle = req.body.updatedItemTitle;
  try {
    await db.query('UPDATE items SET title = ($1) WHERE id = ($2)', [updatedTitle, currentId])
  } catch(err) {
    console.log(err);
  }
  res.redirect("/");
});

app.post("/delete", async(req, res) => {
   let currentId = req.body.deleteItemId;
   try {
    await db.query('DELETE FROM items WHERE id = ($1)', [currentId]);
   } catch(err) {
    console.log(err);
   }
   res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
