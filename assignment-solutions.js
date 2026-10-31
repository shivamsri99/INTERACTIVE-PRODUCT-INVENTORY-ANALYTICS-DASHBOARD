"use strict";

/* Six small JavaScript curriculum exercises by Shivam Srivastava.
 * Run in a browser console or with Node. Exercises 2 and 3 need browser prompt().
 */

function assignment1() {
  var name = "Shivam Srivastava";
  let age = 25;
  const isEmployed = true;
  const skills = ["HTML", "CSS", "JavaScript"];
  console.log(`Name: ${name} (Type: ${typeof name})`);
  console.log(`Age: ${age} (Type: ${typeof age})`);
  console.log(`Is Employed: ${isEmployed} (Type: ${typeof isEmployed})`);
  console.log(`Skills: ${JSON.stringify(skills)} (Type: ${typeof skills})`);
}

function assignment2() {
  if (typeof prompt !== "function") {
    console.log("Run Assignment 2 in a browser so prompt() can collect the values.");
    return;
  }
  const subtotal = Number(prompt("Enter the bill amount", "100"));
  const tipPercent = Number(prompt("Enter the tip percentage", "15"));
  if (!Number.isFinite(subtotal) || subtotal < 0 || !Number.isFinite(tipPercent) || tipPercent < 0) {
    console.log("Please enter valid, non-negative numbers.");
    return;
  }
  const tip = subtotal * tipPercent / 100;
  let total = subtotal;
  total += tip;
  console.log(`Subtotal: $${subtotal}\nTip Percentage: ${tipPercent}%\nCalculated Tip: $${tip}\nTotal Amount to Pay: $${total}`);
}

function assignment3() {
  if (typeof prompt !== "function") {
    console.log("Run Assignment 3 in a browser so prompt() can collect the score.");
    return;
  }
  const score = Number(prompt("Enter a test score from 0 to 100", "85"));
  if (!Number.isFinite(score) || score < 0 || score > 100) {
    console.log("Enter a valid score from 0 to 100.");
    return;
  }
  if (score >= 90) var grade = "A";
  else if (score >= 80) grade = "B";
  else if (score >= 70) grade = "C";
  else if (score >= 60) grade = "D";
  else grade = "F";
  let letter;
  switch (grade) {
    case "A": letter = "A"; break;
    case "B": letter = "B"; break;
    case "C": letter = "C"; break;
    case "D": letter = "D"; break;
    default: letter = "F";
  }
  const status = score >= 60 ? "Passed" : "Failed";
  console.log(`Score: ${score}\nGrade: ${letter}\nStatus: ${status}`);
}

function assignment4() {
  console.log("-- Multiplication Table of 5 --");
  for (let i = 1; i <= 5; i += 1) console.log(`5 x ${i} = ${5 * i}`);
  console.log("-- First number > 10 divisible by 6 --");
  let candidate = 11;
  while (candidate <= 100) {
    if (candidate % 6 === 0) {
      console.log(`Found: ${candidate}`);
      break;
    }
    candidate += 1;
  }
  let number = 0;
  do {
    number += 1;
    if (number % 2 === 0) continue;
    console.log(`do...while kept: ${number}`);
  } while (number < 3);
}

function assignment5() {
  function rectangleArea(length = 5, width = 4) { return length * width; }
  const arrowArea = (length = 5, width = 4) => length * width;
  console.log(`Standard Function Area (Default 5x4): ${rectangleArea()}`);
  console.log(`Arrow Function Area (Custom 10x3): ${arrowArea(10, 3)}`);
  {
    let blockVar = "inside this block";
    console.log(`Scope inside block: ${blockVar}`);
  }
  try {
    console.log(blockVar);
  } catch (error) {
    console.log(`Scope Test Error: ${error.name}: blockVar is not defined (when accessed outside block)`);
  }
}

function assignment6() {
  const inventory = [
    { name: "Laptop", price: 800 },
    { name: "Mouse", price: 25 },
    { name: "Keyboard", price: 45 }
  ];
  console.log("-- All Products (forEach) --");
  inventory.forEach((item) => console.log(`Item: ${item.name} - Price: $${item.price}`));
  console.log("-- Filtered Products (Price < $50) --");
  console.log(inventory.filter((item) => item.price < 50));
  console.log("-- Mapped Product Tags (map) --");
  console.log(inventory.map((item) => `${item.name.toUpperCase()} costs $${item.price}`));
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { assignment1, assignment2, assignment3, assignment4, assignment5, assignment6 };
}
