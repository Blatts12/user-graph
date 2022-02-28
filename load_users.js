const userApi = "https://randomuser.me/api/?results=1000&gender=male&nat=fr";
const state = {
  graph: null,
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
        label: "Number of man",
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
            text: "Age",
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

const handleLoadUser = async () => {
  const canvasId = "age_graph";

  const users = await fetch(
    "https://randomuser.me/api/?results=1000&gender=male&nat=fr"
  ).then((response) => response.json());
  const data = parseUserData(users.results);

  createGraph(createGraphConfig(data), canvasId);
};

document.getElementById("load_users").addEventListener("click", handleLoadUser);
