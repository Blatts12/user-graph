const unloadHandler = () => {
  const count = parseInt(window.localStorage.getItem("refreshCount") || 0);
  window.localStorage.setItem("refreshCount", count + 1);
};

window.addEventListener("beforeunload", unloadHandler);

const loadColored = () => {
  const count = window.localStorage.getItem("refreshCount") || 0;

  if (count % 5 === 0) {
    document.getElementById("colored").classList.toggle("colored-bg");
  }
};

loadColored();
