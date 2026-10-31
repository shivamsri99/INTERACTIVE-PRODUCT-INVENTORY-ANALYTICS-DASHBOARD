"use strict";

const STORAGE_KEY = "stockroom.inventory.v1";
const SEED_PRODUCTS = [
  { id: "laptop", name: "Laptop", price: 800, added: "Today" },
  { id: "mouse", name: "Mouse", price: 25, added: "Today" }
];
let products = loadProducts();
let toastTimer;

const $ = (selector) => document.querySelector(selector);
const money = (amount) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(amount);
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
function categoryFor(price) {
  let priceBand;
  if (price < 50) priceBand = "entry";
  else if (price < 200) priceBand = "regular";
  else priceBand = "high";
  switch (priceBand) {
    case "entry": return "Budget";
    case "regular": return "Standard";
    default: return "Premium";
  }
}

function loadProducts() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved) && saved.every((item) => item && typeof item.name === "string" && Number.isFinite(item.price))) return saved;
  } catch (error) {
    console.warn("Saved inventory could not be read; loading sample data.", error);
  }
  return SEED_PRODUCTS.map((item) => ({ ...item }));
}

function saveProducts() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    $(".live-status").innerHTML = "<i></i> All changes saved locally";
  } catch (error) {
    $(".live-status").textContent = "Unable to save on this device";
    console.warn("Inventory could not be saved to local storage.", error);
  }
}

function render() {
  const query = $("#search-input").value.trim().toLowerCase();
  const chosenCategory = $("#category-filter").value;
  const visibleProducts = products.filter((product) => product.name.toLowerCase().includes(query) && (chosenCategory === "all" || categoryFor(product.price) === chosenCategory));
  const body = $("#inventory-body");
  body.innerHTML = visibleProducts.map((product, index) => {
    const category = categoryFor(product.price);
    const color = ["", "color-1", "color-2", "color-3", "color-4"][index % 5];
    const initial = escapeHTML(product.name.trim().charAt(0).toUpperCase() || "?");
    return `<tr><td><div class="product-cell"><span class="product-avatar ${color}">${initial}</span>${escapeHTML(product.name)}</div></td><td class="price-cell">${money(product.price)}</td><td><span class="badge badge-${category.toLowerCase()}">${category}</span></td><td>${escapeHTML(product.added || "Today")}</td><td><button class="row-action" data-delete="${escapeHTML(product.id)}" aria-label="Remove ${escapeHTML(product.name)}" title="Remove product">×</button></td></tr>`;
  }).join("");
  $("#empty-state").hidden = visibleProducts.length > 0;
  $("table").hidden = visibleProducts.length === 0;
  $("#table-summary").textContent = `Showing ${visibleProducts.length} of ${products.length} product${products.length === 1 ? "" : "s"}`;
  const total = products.reduce((sum, product) => sum + product.price, 0);
  const groups = { Budget: 0, Standard: 0, Premium: 0 };
  products.forEach((product) => { groups[categoryFor(product.price)] += product.price; });
  $("#metric-products").textContent = products.length;
  $("#metric-value").textContent = money(total);
  $("#metric-budget").textContent = products.filter((item) => categoryFor(item.price) === "Budget").length;
  $("#metric-premium").textContent = products.filter((item) => categoryFor(item.price) === "Premium").length;
  $("#nav-count").textContent = products.length;
  $("#chart-total").textContent = money(total);
  $("#donut-count").textContent = products.length;
  $("#legend-budget").textContent = money(groups.Budget);
  $("#legend-standard").textContent = money(groups.Standard);
  $("#legend-premium").textContent = money(groups.Premium);
  const safeTotal = total || 1;
  const budget = groups.Budget / safeTotal * 100;
  const standard = groups.Standard / safeTotal * 100;
  const premium = groups.Premium / safeTotal * 100;
  $("#donut-chart").style.background = `conic-gradient(#41aa7b 0% ${budget}%, #6878ed ${budget}% ${budget + standard}%, #e8a54b ${budget + standard}% ${budget + standard + premium}%, #e8eaf0 ${budget + standard + premium}% 100%)`;
  const highest = products.reduce((best, item) => !best || item.price > best.price ? item : best, null);
  $("#highest-item").textContent = highest ? `${highest.name} · ${money(highest.price)}` : "No products yet";
  $("#average-price").textContent = products.length ? money(total / products.length) : money(0);
  renderReport();
}

function renderReport() {
  const affordable = products.filter((item) => item.price < 200);
  $("#affordable-report").innerHTML = affordable.length ? affordable.map((item) => `<span class="report-chip">${escapeHTML(item.name)} <strong>${money(item.price)}</strong></span>`).join("") : '<span class="report-chip">No matching items</span>';
  $("#formatted-report").textContent = JSON.stringify(products.map((item) => `${item.name.toUpperCase()}: ${money(item.price)}`), null, 2);
  const tax = Math.max(0, Number($("#tax-rate").value) || 0) / 100;
  const discount = Math.max(0, Number($("#discount-rate").value) || 0) / 100;
  const subtotal = products.reduce((sum, item) => sum + item.price, 0);
  $("#adjusted-total").textContent = money(subtotal * (1 - discount) * (1 + tax));
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
}

function openDialog() {
  $("#product-form").reset();
  $("#category-hint").textContent = "Category is assigned automatically based on price.";
  $("#product-dialog").showModal();
  $("#product-name").focus();
}

function saveNewProduct(event) {
  event.preventDefault();
  const name = $("#product-name").value.trim();
  const price = Number($("#product-price").value);
  if (!name || !Number.isFinite(price) || price <= 0) return;
  products.push({ id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`, name, price, added: "Today" });
  saveProducts();
  render();
  $("#product-dialog").close();
  $("#search-input").value = "";
  $("#category-filter").value = "all";
  showToast(`${name} added to inventory`);
}

function runExercise(number) {
  const sampleProducts = [{ name: "Laptop", price: 800 }, { name: "Mouse", price: 25 }, { name: "Keyboard", price: 45 }];
  console.group(`Assignment ${number}`);
  if (number === 1) {
    var userName = "Shivam Srivastava";
    let age = 25;
    const isEmployed = true;
    const skills = ["HTML", "CSS", "JavaScript"];
    console.log(`Name: ${userName} (Type: ${typeof userName})`);
    console.log(`Age: ${age} (Type: ${typeof age})`);
    console.log(`Is Employed: ${isEmployed} (Type: ${typeof isEmployed})`);
    console.log(`Skills: ${JSON.stringify(skills)} (Type: ${typeof skills})`);
  } else if (number === 2) {
    const subtotal = Number(window.prompt("Assignment 2: Enter a bill amount", "100"));
    const tipPercentage = Number(window.prompt("Assignment 2: Enter a tip percentage", "15"));
    if (!Number.isFinite(subtotal) || !Number.isFinite(tipPercentage)) console.warn("Please enter valid numbers for the bill and tip.");
    else { let total = subtotal; const tip = subtotal * tipPercentage / 100; total += tip; console.log(`Subtotal: ${money(subtotal)}\nTip Percentage: ${tipPercentage}%\nCalculated Tip: ${money(tip)}\nTotal Amount to Pay: ${money(total)}`); }
  } else if (number === 3) {
    const score = Number(window.prompt("Assignment 3: Enter a test score (0-100)", "85"));
    if (!Number.isFinite(score) || score < 0 || score > 100) console.warn("Enter a score from 0 to 100.");
    else { let grade; if (score >= 90) grade = "A"; else if (score >= 80) grade = "B"; else if (score >= 70) grade = "C"; else if (score >= 60) grade = "D"; else grade = "F"; let letter; switch (grade) { case "A": letter = "A"; break; case "B": letter = "B"; break; case "C": letter = "C"; break; case "D": letter = "D"; break; default: letter = "F"; } const status = score >= 60 ? "Passed" : "Failed"; console.log(`Score: ${score}\nGrade: ${letter}\nStatus: ${status}`); }
  } else if (number === 4) {
    console.log("-- Multiplication Table of 5 --");
    for (let i = 1; i <= 5; i += 1) console.log(`5 x ${i} = ${5 * i}`);
    console.log("-- First number > 10 divisible by 6 --");
    let candidate = 11;
    while (candidate <= 100) { if (candidate % 6 === 0) { console.log(`Found: ${candidate}`); break; } candidate += 1; }
    let skipped = 0; do { skipped += 1; if (skipped % 2 === 0) continue; } while (skipped < 3);
    console.log("do...while checked 1 and 3; even values were skipped with continue.");
  } else if (number === 5) {
    function rectangleArea(length = 5, width = 4) { return length * width; }
    const customArea = (length = 5, width = 4) => length * width;
    console.log(`Standard Function Area (Default 5x4): ${rectangleArea()}`);
    console.log(`Arrow Function Area (Custom 10x3): ${customArea(10, 3)}`);
    { let blockVar = "inside the block"; console.log(`Scope inside block: ${blockVar}`); }
    try { console.log(blockVar); } catch (error) { console.log(`Scope Test Error: ${error.name}: blockVar is not defined (when accessed outside block)`); }
  } else if (number === 6) {
    console.log("-- All Products (forEach) --");
    sampleProducts.forEach((item) => console.log(`Item: ${item.name} - Price: ${money(item.price)}`));
    console.log("-- Filtered Products (Price < $50) --");
    console.log(sampleProducts.filter((item) => item.price < 50));
    console.log("-- Mapped Product Tags (map) --");
    console.log(sampleProducts.map((item) => `${item.name.toUpperCase()} costs ${money(item.price)}`));
  }
  console.groupEnd();
}

function runCapstoneDemo() {
  const nameInput = window.prompt("Shivam, enter a product name", "Monitor");
  if (nameInput === null) return;
  const priceInput = window.prompt("Enter its price in dollars", "150");
  if (priceInput === null) return;
  const name = nameInput.trim();
  const price = Number(priceInput);
  if (!name || !Number.isFinite(price) || price <= 0) {
    showToast("Enter a product name and a price above zero");
    return;
  }
  products.push({ id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`, name, price, added: "Today" });
  $("#search-input").value = "";
  $("#category-filter").value = "all";
  saveProducts();
  render();
  const rosterLines = [];
  products.forEach((item) => rosterLines.push(`* Item: ${item.name} (${money(item.price)}) -> Category: ${categoryFor(item.price)}`));
  const lines = [
    "--- Initializing Inventory System ---",
    `[Prompt executed: User adds \"${name}\" at \"${money(price)}\"]`,
    "--- Processing Inventory Roster (forEach) ---",
    ...rosterLines,
    "--- Financial Analytics ---"
  ];
  lines.push(
    `Total Inventory Value: ${money(products.reduce((sum, item) => sum + item.price, 0))}`,
    `Filtered Affordable Items (Under $200): ${JSON.stringify(products.filter((item) => item.price < 200).map((item) => item.name))}`,
    `Formatted Report List: ${JSON.stringify(products.map((item) => `${item.name.toUpperCase()}: ${money(item.price)}`))}`
  );
  lines.forEach((line) => console.log(line));
  $("#capstone-output").textContent = lines.join("\n");
  $("#capstone-output").closest(".capstone-panel").hidden = false;
  $("#capstone-output").closest(".capstone-panel").scrollIntoView({ behavior: "smooth", block: "center" });
  showToast(`${name} added; capstone report is ready`);
}

$("#add-item-top").addEventListener("click", openDialog);
$("#add-item-table").addEventListener("click", openDialog);
$("#empty-add").addEventListener("click", openDialog);
$("#dialog-close").addEventListener("click", () => $("#product-dialog").close());
$("#dialog-cancel").addEventListener("click", () => $("#product-dialog").close());
$("#product-form").addEventListener("submit", saveNewProduct);
$("#product-price").addEventListener("input", (event) => {
  const price = Number(event.target.value);
  $("#category-hint").textContent = Number.isFinite(price) && price > 0 ? `This product will be categorized as ${categoryFor(price)}.` : "Category is assigned automatically based on price.";
});
$("#inventory-body").addEventListener("click", (event) => {
  const button = event.target.closest("[data-delete]");
  if (!button) return;
  const removed = products.find((item) => item.id === button.dataset.delete);
  products = products.filter((item) => item.id !== button.dataset.delete);
  saveProducts(); render();
  if (removed) showToast(`${removed.name} removed from inventory`);
});
$("#search-input").addEventListener("input", render);
$("#category-filter").addEventListener("change", render);
$("#tax-rate").addEventListener("input", renderReport);
$("#discount-rate").addEventListener("input", renderReport);
$("#view-report").addEventListener("click", () => { $("#report-panel").hidden = false; $("#report-panel").scrollIntoView({ behavior: "smooth", block: "center" }); });
$("#close-report").addEventListener("click", () => { $("#report-panel").hidden = true; });
$("#reset-data").addEventListener("click", () => { products = SEED_PRODUCTS.map((item) => ({ ...item })); saveProducts(); render(); showToast("Sample inventory restored"); });
document.querySelectorAll("[data-exercise]").forEach((button) => button.addEventListener("click", () => runExercise(Number(button.dataset.exercise))));
$("#run-lab").addEventListener("click", () => { for (let exercise = 1; exercise <= 6; exercise += 1) runExercise(exercise); showToast("Exercises ran in the browser console"); });
$("#run-capstone").addEventListener("click", runCapstoneDemo);

render();
