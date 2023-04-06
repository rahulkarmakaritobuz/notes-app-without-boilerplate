const demo = () =>
  "Webpack Boilerplate v5.16.0 - SASS/PostCSS, ES6/7, browser sync, source code listing and more.";

// eslint-disable-next-line no-console
console.log(demo());

const addBox = document.querySelector(".add-box");
const popUpBox = document.querySelector(".popup-box");
const closeBox = document.querySelector(".fa-times");
const titleTag = document.querySelector("input");
const descriptionTag = document.querySelector("textarea");
const addButton = document.querySelector(".add");

let isUpdate = false;
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

const formData = () => {
  let title = titleTag.value;
  let description = descriptionTag.value;
  let currentDate = new Date(),
    month = months[currentDate.getMonth()],
    day = currentDate.getDate(),
    year = currentDate.getFullYear();
  const currDate = day + " " + month + ", " + year;
  console.log("formData:", title, description, currDate);
  const data = {
    heading: title,
    content: description,
    dateAndTime: currDate,
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
  console.log(notes);
  if (!notes) return;
  document.querySelectorAll(".note").forEach((li) => li.remove());
  notes.forEach((note, id) => {
    // let filterDesc = note.description.replaceAll("\n", "<br/>");
    // let filterDesc = notes[id].content;
    let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.heading}</p>
                            <span>${note.content}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.dateAndTime}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="menu-button fa fa-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateNote('${note._id}', '${note.heading}', '${note.content}')"><i class="fa-solid fa-pen"></i></i>Edit</li>
                                    <li onclick="deleteNote('${note._id}')"><i class="fa fa-trash" aria-hidden="true"></i>Delete</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
    addBox.insertAdjacentHTML("afterend", liTag);
  });
};

getData("http://localhost:8080/get-todo").then((res) => {
  showNotes(res);
});

const addData = async (note) => {
  // console.log(JSON.stringify(note));
  // console.log(title, description, currDate);
  await fetch("http://localhost:8080/add-todo", {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify(note),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
};

const deleteData = async (api) => {
  await fetch(api, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
    },
  });
  console.log("Resource deleted...");
};

const showMenu = (elem) => {
  console.log("hello");
  console.log(elem);
  elem.parentElement.classList.add("show");
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  });
};

const deleteNote = async (noteId) => {
  let api = "http://localhost:8080/delete/" + noteId;
  console.log(api);
  let confirmDel = confirm("Are you sure you want to delete this note?");
  if (!confirmDel) return;
  deleteData(api);
};

const updateNote = (noteId, title, desc) => {
  isUpdate = true;
  let api = "http://localhost:8080/todo/" + noteId;
  popUpBox.classList.add("show");
  titleTag.focus();
  titleTag.value = title;
  descriptionTag.value = desc;
  setTimeout(() => {
    deleteData("http://localhost:8080/delete/" + noteId);
  }, 3000);
};

// const updateNote = async (noteId, title, desc) => {
//   // let getApi = "http://localhost:8080/get-todo/" + noteId;
//   // getData(getApi).then(async (res) => {
//   //   console.log(res);
//   //   let updateApi = "http://localhost:8080/todo/" + noteId;
//   //   await fetch(api, {
//   //     method: "PUT",
//   //     body: JSON.stringify(res),
//   //     headers: {
//   //       "Content-type": "application/json; charset=UTF-8",
//   //     },
//   //   });
//   // });

//   let updateApi = "http://localhost:8080/todo/" + noteId;
//   await fetch(api, {
//     method: "PUT",
//     body: JSON.stringify(formData()),
//     headers: {
//       "Content-type": "application/json; charset=UTF-8",
//     },
//   });
// };

addBox.addEventListener("click", (e) => {
  console.log(e);
  popUpBox.classList.add("show");
  // document.querySelector("body").style.overflow = "hidden";
  titleTag.focus();
});
closeBox.addEventListener("click", () => {
  isUpdate = false;
  titleTag.value = descriptionTag.value = "";
  popUpBox.classList.remove("show");
  // document.querySelector("body").style.overflow = "auto";
});
addButton.addEventListener("click", (e) => {
  // let title = titleTag.value;
  // let description = descriptionTag.value;
  // let currentDate = new Date(),
  //   month = months[currentDate.getMonth()],
  //   day = currentDate.getDate(),
  //   year = currentDate.getFullYear();
  // const currDate = day + " " + month + ", " + year;
  const data = formData();
  addData(data);
  popUpBox.classList.remove("show");
});

// const showMenuButton = document.querySelector(".add-box .fa-ellipsis-h");
// console.log(showMenuButton);
