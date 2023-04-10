const addBox = document.querySelector(".add-box");
const closeBox = document.querySelector(".close");
const addButton = document.querySelector(".add");
const popUpBox = document.querySelector(".popup-box");
const titleTag = document.querySelector("input");
const descriptionTag = document.querySelector("textarea");
const popupBackground = document.querySelector(".popup-background");
const warningContainer = document.querySelector(".delete-warning");
const warning = document.querySelectorAll(".confirm-button button");
const formButton = document.querySelector(".button-container button");

let updateId = "";
let buttonText = "";
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currDate = () => {
  let currentDate = new Date(),
    month = months[currentDate.getMonth()],
    day = currentDate.getDate(),
    year = currentDate.getFullYear();
  return day + " " + month + ", " + year;
};

const formData = () => {
  let title = titleTag.value;
  let description = descriptionTag.value;
  const data = {
    heading: title,
    content: description,
    dateAndTime: currDate(),
  };
  return data;
};

const getData = async (api) => {
  let result = await fetch(api).then((res) => {
    return res.json();
  });
  return result;
};

const showNotes = (notes) => {
  if (!notes) return;
  document.querySelectorAll(".note").forEach((li) => li.remove());
  notes.data.forEach((note, id) => {
    let liTag = `<li class="note" >
                        <div class="details">
                            <p>${note.heading}</p>
                            <span>${note.content}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.dateAndTime}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="menu-button fa fa-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateNote('${note._id}', '${note.heading}', '${note.content}')" class="update"><i class="fa-solid fa-pen"></i>Edit</li>
                                    <li onclick="deleteNote('${note._id}')" class="delete"><i class="fa fa-trash" aria-hidden="true"></i>Delete</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
    addBox.insertAdjacentHTML("afterend", liTag);
  });
};

const show = () => {
  getData("http://localhost:8080/get-note").then((res) => {
    showNotes(res);
  });
};
show();

const addData = async (newNoteData) => {
  const addNoteUrl = "http://localhost:8080/add-note";
  const response = await fetch(addNoteUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newNoteData),
  });
  show();
};

const showMenu = (elem) => {
  elem.parentElement.classList.add("show");
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  });
};

const updateNote = (noteId, title, desc) => {
  buttonText = "Edit";
  formButton.textContent = buttonText;
  popUpBox.classList.add("show");
  popupBackground.classList.add("show");
  titleTag.focus();
  titleTag.value = title;
  descriptionTag.value = desc;
  updateId = noteId;
};

const updateData = async (newNoteData) => {
  let api = "http://localhost:8080/note/" + updateId;
  const response = await fetch(api, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify(newNoteData),
  });
  show();
};

const deleteData = async (api) => {
  await fetch(api, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
    },
  });
  show();
};

const deleteNote = (noteId) => {
  let api = "http://localhost:8080/delete/" + noteId;
  warningContainer.classList.add("show");
  popupBackground.classList.add("show");
  warning.forEach((val) => {
    val.addEventListener("click", (e) => {
      if (val.value === "true") deleteData(api);
      warningContainer.classList.remove("show");
      popupBackground.classList.remove("show");
    });
  });
};

addBox.addEventListener("click", () => {
  buttonText = "Add Note";
  formButton.textContent = buttonText;
  popUpBox.classList.add("show");
  popupBackground.classList.add("show");
  titleTag.focus();
});
closeBox.addEventListener("click", () => {
  titleTag.value = descriptionTag.value = "";
  popUpBox.classList.remove("show");
  popupBackground.classList.remove("show");
});
addButton.addEventListener("click", (e) => {
  const data = formData();
  buttonText === "Add Note" ? addData(data) : updateData(data);
  popUpBox.classList.remove("show");
  popupBackground.classList.remove("show");
});
