// =====================================
// NYC AFTER HOURS
// Week 11 — CSV data + array methods
// =====================================

// Grab the elements we need from the page
const boroughSelect = document.getElementById("borough-select");
const chart = document.getElementById("chart");
const statusText = document.getElementById("status");
const chartTitle = document.getElementById("chart-title");

// The CSV file saved in this folder
const CSV_FILE = "nyc-311.csv";

// This will hold every row from the CSV once it loads
let allRequests = [];


// -------------------------------------
// 1. Load the CSV with Papa Parse
// -------------------------------------
Papa.parse(CSV_FILE, {
  download: true,      // fetch the file from the folder
  header: true,        // use the first row as property names
  skipEmptyLines: true,

  complete: function (results) {
    // results.data is an array of objects, like:
    // { complaint_type: "Graffiti", created_date: "...", borough: "BROOKLYN" }

    // Keep only rows that actually have a complaint type
    allRequests = results.data.filter(function (row) {
      return row.complaint_type;
    });

    if (allRequests.length === 0) {
      showError("The CSV loaded, but it didn't have any rows.");
      return;
    }

    // Draw the chart for the first time
    drawChart();
  },

  error: function () {
    showError("Couldn't load nyc-311.csv. Are you running this with Live Server?");
  }
});


// -------------------------------------
// 2. Redraw the chart when a borough is picked
// -------------------------------------
boroughSelect.addEventListener("change", drawChart);


// -------------------------------------
// 3. Build the chart
// -------------------------------------
function drawChart() {
  const selectedBorough = boroughSelect.value;
  const boroughName = boroughSelect.options[boroughSelect.selectedIndex].text;

  // filter(): keep only the rows for the chosen borough
  // ("ALL" means keep everything)
  const filteredRequests = allRequests.filter(function (row) {
    return selectedBorough === "ALL" || row.borough === selectedBorough;
  });

  // Count how many requests each complaint type has.
  // The result is an object like { "Graffiti": 120, "Noise - Residential": 340, ... }
  const counts = {};

  for (let i = 0; i < filteredRequests.length; i++) {
    const type = filteredRequests[i].complaint_type;

    if (counts[type]) {
      // We've seen this type before, so add 1
      counts[type] = counts[type] + 1;
    } else {
      // First time seeing this type, so start at 1
      counts[type] = 1;
    }
  }

  // Turn the counts object into a list we can sort,
  // like [{ type: "Graffiti", count: 120 }, ...]
  const complaintList = [];

  for (const type in counts) {
    complaintList.push({ type: type, count: counts[type] });
  }

  // sort(): biggest count first
  complaintList.sort(function (a, b) {
    return b.count - a.count;
  });

  // slice(): keep only the top 10
  const topTen = complaintList.slice(0, 10);

  // The list is sorted biggest first, so the first item has the largest count.
  // We use it to size the bars.
  let maxCount = 1;
  if (topTen.length > 0) {
    maxCount = topTen[0].count;
  }

  // Update the title and the record count
  chartTitle.textContent = "Top 10 complaints · " + boroughName;
  statusText.classList.remove("error");
  statusText.textContent =
    "Analyzing " + filteredRequests.length.toLocaleString() + " requests ✿";

  // Clear out the old bars before drawing new ones
  chart.innerHTML = "";

  // forEach(): create one row for each complaint type
  topTen.forEach(function (item, index) {
    // Bar width as a percentage of the biggest bar
    const percent = (item.count / maxCount) * 100;

    const row = document.createElement("div");
    row.classList.add("chart-row");

    row.innerHTML = `
      <span class="rank">${index + 1}</span>
      <span class="label">${item.type}</span>
      <div class="bar-track">
        <div class="bar" style="width: ${percent}%"></div>
      </div>
      <span class="count">${item.count}</span>
    `;

    chart.appendChild(row);
  });
}


// -------------------------------------
// 4. Show an error message
// -------------------------------------
function showError(message) {
  statusText.textContent = "Oh no! " + message;
  statusText.classList.add("error");
  chart.innerHTML = "";
}
