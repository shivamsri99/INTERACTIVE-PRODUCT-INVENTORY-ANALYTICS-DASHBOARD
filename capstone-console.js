"use strict";

/* Console edition of the inventory capstone from the supplied guide. */
const readline = require("node:readline/promises");
const { stdin, stdout } = require("node:process");

const inventory = [
  { name: "Laptop", price: 800 },
  { name: "Mouse", price: 25 }
];

function categoryFor(price) {
  if (price < 50) return "Budget";
  if (price < 200) return "Standard";
  return "Premium";
}

function summarize(items, taxRate = 0, discountRate = 0) {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const discounted = subtotal * (1 - discountRate);
  return {
    subtotal,
    total: discounted * (1 + taxRate),
    affordable: items.filter((item) => item.price < 200).map((item) => item.name),
    formatted: items.map((item) => `${item.name.toUpperCase()}: $${item.price}`)
  };
}

async function main() {
  const terminal = readline.createInterface({ input: stdin, output: stdout });
  try {
    console.log("--- Initializing Inventory System ---");
    const nameInput = (await terminal.question("Product name to add (default Monitor): ")).trim();
    const priceInput = (await terminal.question("Product price (default 150): ")).trim();
    const name = nameInput || "Monitor";
    const price = priceInput === "" ? 150 : Number(priceInput);
    if (!name || !Number.isFinite(price) || price <= 0) {
      console.log("Please enter a product name and a price greater than zero.");
      return;
    }
    inventory.push({ name, price });

    console.log(`\n[Added: ${name} ($${price})]`);
    console.log("--- Processing Inventory Roster (forEach) ---");
    inventory.forEach((item) => console.log(`* Item: ${item.name} ($${item.price}) -> Category: ${categoryFor(item.price)}`));

    const report = summarize(inventory);
    console.log("--- Financial Analytics ---");
    console.log(`Total Inventory Value: $${report.subtotal}`);
    console.log(`Filtered Affordable Items (Under $200): ${JSON.stringify(report.affordable)}`);
    console.log(`Formatted Report List: ${JSON.stringify(report.formatted)}`);
    console.log("\nOptional custom calculation: enter percentages, or press Enter to use 0.");
    const taxInput = (await terminal.question("Tax percentage: ")).trim();
    const discountInput = (await terminal.question("Discount percentage: ")).trim();
    const taxPercent = taxInput === "" ? 0 : Number(taxInput);
    const discountPercent = discountInput === "" ? 0 : Number(discountInput);
    if (Number.isFinite(taxPercent) && taxPercent >= 0 && Number.isFinite(discountPercent) && discountPercent >= 0 && discountPercent <= 100) {
      const adjusted = summarize(inventory, taxPercent / 100, discountPercent / 100);
      console.log(`Adjusted total after ${discountPercent}% discount and ${taxPercent}% tax: $${adjusted.total.toFixed(2)}`);
    } else {
      console.log("Skipped adjusted total: percentages must be non-negative and discount cannot exceed 100%.");
    }
  } finally {
    terminal.close();
  }
}

main().catch((error) => {
  console.error("The inventory demo could not finish:", error.message);
  process.exitCode = 1;
});
