///////////////////////////
//BAR CHART

const myCanvas = document.getElementById("myCanvas");
myCanvas.width = 300;
myCanvas.height = 300;

const ctx = myCanvas.getContext("2d");

function drawLine(ctx, startX, startY, endX, endY, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  ctx.restore();
}

function drawBar(
  ctx,
  upperLeftCornerX,
  upperLeftCornerY,
  width,
  height,
  color
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(upperLeftCornerX, upperLeftCornerY, width, height);
  ctx.restore();
}

const myVinyls = {
  Rohan: 30,
  Alex: 25,
  Sara: 15,
  Jay: 30,
};

const Barchart = function (options) {
  this.options = options;
  this.canvas = options.canvas;
  this.ctx = this.canvas.getContext("2d");
  this.colors = options.colors;

  this.draw = function () {
    let maxValue = 0;
    for (let categ in this.options.data) {
      maxValue = Math.max(maxValue, this.options.data[categ]);
    }
    const canvasActualHeight = this.canvas.height - this.options.padding * 2;
    const canvasActualWidth = this.canvas.width - this.options.padding * 2;

    //drawing the grid lines
    let gridValue = 0;
    while (gridValue <= maxValue) {
      const gridY =
        canvasActualHeight * (1 - gridValue / maxValue) + this.options.padding;
      drawLine(
        this.ctx,
        0,
        gridY,
        this.canvas.width,
        gridY,
        this.options.gridColor
      );

      //writing grid markers
      this.ctx.save();
      this.ctx.fillStyle = this.options.gridColor;
      this.ctx.font = "bold 10px Arial";
      this.ctx.fillText(gridValue, 10, gridY - 2);
      this.ctx.restore();

      gridValue += this.options.gridScale;
    }

    //drawing the bars
    let barIndex = 0;
    const numberOfBars = Object.keys(this.options.data).length;
    const barSize = canvasActualWidth / numberOfBars;

    for (categ in this.options.data) {
      const val = this.options.data[categ];
      const barHeight = Math.round((canvasActualHeight * val) / maxValue);
      //console.log(barHeight);
      drawBar(
        this.ctx,
        this.options.padding + barIndex * barSize,
        this.canvas.height - barHeight - this.options.padding,
        barSize,
        barHeight,
        this.colors[barIndex % this.colors.length]
      );

      barIndex++;
    }
  };
};

const myBarchart = new Barchart({
  canvas: myCanvas,
  padding: 10,
  gridScale: 5,
  gridColor: "#eeeeee",
  data: myVinyls,
  colors: ["#252A34", "#08D9D6", "#FF2E63", "#FFCD3C"],
});
myBarchart.draw();

/////////////////////////////////////////////////////////////////////////////////////////
//PIE CHART
const drawPieChart = function (data, colors) {
  const canvas = document.getElementById("pie");
  const ctx = canvas.getContext("2d");
  const x = canvas.width / 2;
  const y = canvas.height / 2;
  let color,
    startAngle,
    endAngle,
    total = getTotal(data);

  for (var i = 0; i < data.length; i++) {
    color = colors[i];
    startAngle = calculateStart(data, i, total);
    endAngle = calculateEnd(data, i, total);

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(x, y);
    ctx.arc(x, y, y - 100, startAngle, endAngle);
    ctx.fill();
    ctx.rect(canvas.width - 200, y - i * 30, 12, 12);
    ctx.fill();
    ctx.font = "18px sans-serif";
    ctx.fillText(
      data[i].label +
        " - " +
        data[i].value +
        " (" +
        calculatePercent(data[i].value, total) +
        "%)",
      canvas.width - 200 + 20,
      y - i * 30 + 10
    );
  }
};

const calculatePercent = function (value, total) {
  return ((value / total) * 100).toFixed(2);
};

const getTotal = function (data) {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i].value;
  }

  return sum;
};

const calculateStart = function (data, index, total) {
  if (index === 0) {
    return 0;
  }

  return calculateEnd(data, index - 1, total);
};

const calculateEndAngle = function (data, index, total) {
  const angle = (data[index].value / total) * 360;
  const inc = index === 0 ? 0 : calculateEndAngle(data, index - 1, total);

  return angle + inc;
};

const calculateEnd = function (data, index, total) {
  return degreeToRadians(calculateEndAngle(data, index, total));
};

const degreeToRadians = function (angle) {
  return (angle * Math.PI) / 180;
};

const data = [
  { label: "Aditya", value: 30 },
  { label: "Alex", value: 25 },
  { label: "Andrew", value: 15 },
  { label: "Sara", value: 30 },
];
var colors = ["#252a34", "#08d9d6", "#ff2e63", "#ffcd3c"];

drawPieChart(data, colors);
