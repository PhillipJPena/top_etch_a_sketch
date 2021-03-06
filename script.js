//utility functions
function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

function qsa(selector, parent = document) {
  return [...parent.querySelectorAll(selector)];
}

function addGlobalEventListener(
  type,
  selector,
  callback,
  options,
  parent = document
) {
  parent.addEventListener(
    type,
    e => {
      if (e.target.matches(selector)) callback(e);
    },
    options
  );
}

function createElement(type, options = {}) {
  const element = document.createElement(type);
  Object.entries(options).forEach(([key, value]) => {
    if (key === "class") {
      element.classList.add(value);
      return;
    }

    if (key === "dataset") {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      });
      return;
    }

    if (key === "text") {
      element.textContent = value;
      return;
    }

    element.setAttribute(key, value);
  });
  return element;
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

//DOM elements
let slider = qs("#slider");
let sliderLabel = qs("#slider-label");
let sketchArea = qs("#sketch-area");
let colorPicker = qs("#color-picker");
let rainbowBtn = qs("#rainbow");
let greyscaleBtn = qs("#greyscale");
let eraserBtn = qs("#eraser");
let clearBtn = qs("#clear");

//variable declarations
let gridLength = 32;
let inkState;

//app functions
function drawGrid(dimension) {
  sketchArea.style.gridTemplateColumns = `repeat(${dimension}, 1fr)`;
  let gridArea = dimension * dimension;

  if (sketchArea.firstChild) {
    removeAllChildNodes(sketchArea);
  }
  for (let i = 0; i < gridArea; i++) {
    let item = createElement("div", { class: "grid-item" });
    sketchArea.appendChild(item);
  }
}

function paint(e) {
  e.target.style.backgroundColor = ink(e);
}

function rainbowInk() {
  function randomHsl() {
    return "hsla(" + Math.random() * 360 + ", 100%, 50%, 1)";
  }
  return randomHsl();
}

function greyscaleInk(e) {
  return "gray";
}

function eraser() {
  return "white";
}

function clear() {
  qsa(".grid-item").forEach(item => (item.style.background = "white"));
}

function ink(e) {
  if (!qs(".active")) return colorPicker.value;
  if (inkState === "Rainbow") return rainbowInk();
  if (inkState === "Greyscale") return greyscaleInk(e);
  if (inkState === "Eraser") return eraser();
}
//window on load
drawGrid(gridLength);

//event listeners
addGlobalEventListener("click", ".tool", e => {
  if (qs(".active")) {
    qs(".active").classList.toggle("active");
  }
  e.target.classList.add("active");
  inkState = e.target.textContent;
});

addGlobalEventListener("mouseover", ".grid-item", e => paint(e));

slider.addEventListener("change", e => {
  gridLength = e.target.value;
  drawGrid(gridLength);
  sliderLabel.textContent = `${gridLength} x ${gridLength}`;
  console.log(gridLength);
});

colorPicker.addEventListener("click", e => {
  if (qs(".active")) {
    qs(".active").classList.toggle("active");
  }
});

clearBtn.addEventListener("click", () => {
  clear();
});
