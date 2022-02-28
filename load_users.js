const userApi = "https://randomuser.me/api/?results=1000&gender=male&nat=fr";
const state = {
  graph: null,
  rows: [],
};

const createTableRow = (user, tableId) => {
  const table = document.getElementById(tableId);
  const tr = document.createElement("tr");

  const td_name = document.createElement("td");
  td_name.innerText = `${user.name.first} ${user.name.last}`;

  const td_gender = document.createElement("td");
  td_gender.innerText = user.gender;

  const td_country = document.createElement("td");
  td_country.innerText = user.location.country;

  const td_birthdate = document.createElement("td");
  const date = new Date(user.dob.date);
  td_birthdate.innerText = new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "medium",
  }).format(date);

  tr.appendChild(td_name);
  tr.appendChild(td_gender);
  tr.appendChild(td_country);
  tr.appendChild(td_birthdate);

  state.rows.push(tr);

  table.appendChild(tr);
};

const removeRows = (tableId) => {
  const table = document.getElementById(tableId);

  state.rows.forEach((row) => table.removeChild(row));
  state.rows = [];
};

const createRows = (users, tableId) => {
  if (state.rows) removeRows(tableId);

  users.forEach((user) => createTableRow(user, tableId));
};

const createGraph = (config, canvasId) => {
  if (state.graph) {
    state.graph.destroy();
  }
  const canvas = document.getElementById(canvasId);
  state.graph = new Chart(canvas, config);
};

const createGraphConfig = ({ labels, values }) => {
  const data = {
    labels,
    datasets: [
      {
        label: "Liczba użytkowników",
        backgroundColor: "rgb(255, 99, 132)",
        data: values,
      },
    ],
  };

  const config = {
    type: "bar",
    data: data,
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: "Wiek",
          },
        },
      },
    },
  };

  return config;
};

const getAgeRange = (age) => {
  const tens = parseInt(age / 10);
  return `${tens}0-${tens}9`;
};

const parseUserData = (users) => {
  const data = users.reduce((previous, current) => {
    const age = getAgeRange(current.dob.age);
    const count = previous[age] ? previous[age] + 1 : 1;

    return { ...previous, [age]: count };
  }, {});

  const sortedData = Object.entries(data).sort((a, b) =>
    a[0].localeCompare(b[0])
  );
  const labels = sortedData.map((value) => value[0]);
  const values = sortedData.map((value) => value[1]);

  return { labels, values };
};

const getOldestUsers = (number, users) => {
  const sortedData = users.sort(
    (a, b) => new Date(a.dob.date) - new Date(b.dob.date)
  );

  return sortedData.slice(0, 10);
};

const handleLoadUser = async () => {
  document.querySelector(".placeholder").classList.toggle("loading");
  const canvasId = "age_graph";
  const tableId = "user_table";

  const users = await fetch(
    "https://randomuser.me/api/?results=1000&gender=male&nat=fr"
  ).then((response) => response.json());
  const data = parseUserData(users.results);

  createGraph(createGraphConfig(data), canvasId);
  createRows(getOldestUsers(10, users.results), tableId);
  document.querySelector(".placeholder").classList.toggle("loading");
};

document.getElementById("load_users").addEventListener("click", handleLoadUser);
