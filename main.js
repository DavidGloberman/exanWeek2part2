const editPage = document.getElementById("edit-page");
const homePage = document.getElementById("home-page");
const createForm = document.querySelector("#home-page > #form-wrapper");
const editForm = document.querySelector("#edit-page > #form-wrapper");
const ascending = document.getElementById("ascending");
const descending = document.getElementById("descending");

const Soldiers = getLocalStorage() || [];

function getLocalStorage() {
  return JSON.parse(localStorage.getItem("Soldiers"));
}
function setLocalStorage() {
  localStorage.setItem("Soldiers", JSON.stringify(Soldiers));
}

function showHomePage() {
  editPage.style.display = "none";
  homePage.style.display = "block";
}
function showEditPage(soldier, index) {
  homePage.style.display = "none";
  editPage.style.display = "flex";
  editForm["Full-name"].value = soldier.fullName;
  editForm["rank"].value = soldier.rank;
  editForm["position"].value = soldier.position;
  editForm["platoon"].value = soldier.platoon;
  editForm["mission-time"].value = soldier.missionTime;
  editForm["status"].value = soldier.status;
  editForm["cancel"].addEventListener("click", showHomePage, { once: true });
  editForm.addEventListener(
    "submit",
    (e) => {
      e.preventDefault();
      editSoldier(e.target, index);
      showHomePage();
      setLocalStorage();
      refreshTable();
    },
    { once: true }
  );
}

function addSoldier(form) {
  const newSoldier = createSoldier(form);
  Soldiers.push(newSoldier);

  setLocalStorage();
  form.reset();
  refreshTable();
}
function createSoldier(form) {
  const newSoldier = {
    ID: generateId(),
    fullName: form["Full-name"].value,
    rank: form["rank"].value,
    position: form["position"].value,
    platoon: form["platoon"].value,
    status: form["status"].value,
    missionTime: form["mission-time"].value,
  };
  return newSoldier;
}
function generateId() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}
function editSoldier(form, index) {
  const newSoldier = {
    ID: Soldiers[index].ID,
    fullName: form["Full-name"].value,
    rank: form["rank"].value,
    position: form["position"].value,
    platoon: form["platoon"].value,
    status: form["status"].value,
    missionTime: form["mission-time"].value,
  };
  Soldiers[index] = newSoldier;
  form.reset(); //here a bag
}

function refreshTable() {
  clearTable();
  buildTable();
}
function clearTable() {
  const table = document.querySelector("table");
  const tableHeder = document.getElementById("heder");
  table.innerHTML = "";
  table.appendChild(tableHeder);
}
function buildTable() {
  const table = document.querySelector("table");
  Soldiers.forEach((soldier, index) => {
    const newRow = createSoldierElements(soldier, index);
    table.append(newRow);
  });
}

function createSoldierElements(soldier, index) {
  const newRow = document.createElement("tr");

  const fullName = document.createElement("td");
  const rank = document.createElement("td");
  const position = document.createElement("td");
  const platoon = document.createElement("td");
  const status = document.createElement("td");

  fullName.innerText = soldier.fullName;
  rank.innerText = soldier.rank;
  position.innerText = soldier.position;
  platoon.innerText = soldier.platoon;
  status.innerText = soldier.status;

  const actions = createActions(soldier, index);
  actions.classList.add("actions")

  newRow.append(fullName, rank, position, platoon, status, actions);
  return newRow;
}
function createActions(soldier, index) {
  const newActions = document.createElement("td");

  const newButtonRemove = document.createElement("button");
  const newButtonMission = document.createElement("button");
  const newButtonEdit = document.createElement("button");

  newButtonRemove.textContent = "Remove";
  soldier.missionTime > 0
    ? (newButtonMission.textContent = "Mission")
    : (newButtonMission.textContent = "Mission Completed!");
  newButtonEdit.textContent = "Edit";

  setActionsEventListeners(
    { newButtonRemove, newButtonMission, newButtonEdit },
    soldier,
    index
  );

  newActions.append(newButtonRemove, newButtonMission, newButtonEdit);
  return newActions;
}
function setActionsEventListeners(actionButtons, soldier, idx) {
  actionButtons.newButtonRemove.addEventListener("click", () => {
    deleteSoldier(idx);
    setLocalStorage();
    refreshTable();
  });
  actionButtons.newButtonMission.addEventListener("click", () => {
    startMission(actionButtons.newButtonMission, soldier);
  });
  actionButtons.newButtonEdit.addEventListener("click", () => {
    showEditPage(soldier, idx);
  });
}
function deleteSoldier(idx) {
  Soldiers.splice(idx, 1);
}
function startMission(buttonMission, soldier) {
  let timeToLeft = soldier.missionTime;
  const intervalId = setInterval(() => {
    if (timeToLeft <= 0) {
      soldier.missionTime = 0;
      setLocalStorage();
      buttonMission.textContent = "Mission Completed!";
      clearInterval(intervalId);
      return;
    }
    buttonMission.textContent = timeToLeft;
    timeToLeft--;
  }, 1000);
}

function sortTableAsc() {
  Soldiers.sort((a, b) => a.fullName.localeCompare(b.fullName));
  refreshTable();
}
function sortTableDesc() {
  Soldiers.sort((a, b) => b.fullName.localeCompare(a.fullName));
  refreshTable();
}

createForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addSoldier(e.target);
});

ascending.addEventListener("click", sortTableAsc);
descending.addEventListener("click", sortTableDesc);

refreshTable();
