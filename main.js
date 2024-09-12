const editPage = document.getElementById("edit-page");
const homePage = document.getElementById("home-page");
const form = document.querySelector("#home-page > #form-wrapper");
const ascending = document.getElementById("ascending");
const descending = document.getElementById("descending");
const editForm = document.querySelector("#edit-page > #form-wrapper");

const Soldiers = getLocalStorage() || [];

const STATUS = {
  ACTIVE: "Active",
  RESERVE: "Reserve",
  RETIRED: "Retired",
};
function generateId() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
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
function showEditPage(soldier) {
  editPage.style.display = "flex";
  homePage.style.display = "none";
  editForm["Full-name"].value = soldier.fullName;
  editForm["rank"].value = soldier.rank;
  editForm["position"].value = soldier.position;
  editForm["platoon"].value = soldier.platoon;
  editForm["mission-time"].value = soldier.missionTime;
  editForm["status"].value = soldier.status;
}
function addSoldier(form) {
  const newSoldier = createSoldier(form);
  Soldiers.push(newSoldier);

  setLocalStorage();
  form.reset();
  refreshTable();
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

  newRow.append(fullName, rank, position, platoon, status, actions);
  return newRow;
}
function createActions(soldier, idx) {
  const newActions = document.createElement("td");

  const newButtonRemove = document.createElement("button");
  const newButtonMission = document.createElement("button");
  const newButtonEdit = document.createElement("button");

  newButtonRemove.textContent = "Remove";
  newButtonMission.textContent = "Mission";
  newButtonEdit.textContent = "Edit";

  setActionsEventListeners(
    { newButtonRemove, newButtonMission, newButtonEdit },
    soldier,
    idx
  );

  newActions.append(newButtonRemove, newButtonMission, newButtonEdit);
  return newActions;
}
function deleteSoldier(idx) {
  Soldiers.splice(idx, 1);
}

function setActionsEventListeners(actionButtons, soldier, idx) {
  actionButtons.newButtonRemove.addEventListener("click", () => {
    deleteSoldier(idx);
    setLocalStorage();
    refreshTable();
  });
  actionButtons.newButtonMission.addEventListener("click", () => {
    // יש להוסיף לוגיקה שתפעיל את המשימה ואח''כ תעדכן במקומות הצריכים
    // setLocalStorage();
    // refreshTable();
    // missionTime: 0,
    console.log(
      "יש להוסיף לוגיקה שתפעיל את המשימה ואח''כ תעדכן במקומות הצריכים"
    );
  });
  actionButtons.newButtonEdit.addEventListener("click", () => {
    showEditPage(soldier);
  });
}

function sortTableAsc() {
  Soldiers.sort((a, b) => a.fullName.localeCompare(b.fullName));
  refreshTable();
}
function sortTableDesc() {
  Soldiers.sort((a, b) => b.fullName.localeCompare(a.fullName));
  refreshTable();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  addSoldier(e.target);
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  editSoldier(e.target);
});

function editSoldier(form) {
  console.log("כאן צריך לוגיקה שתעדכן את פרטי החייל");
  showHomePage()
  setLocalStorage();
  form.reset();
  refreshTable();
}
ascending.addEventListener("click", sortTableAsc);
descending.addEventListener("click", sortTableDesc);

refreshTable();