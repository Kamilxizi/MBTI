const API = " http://localhost:3000/types";

const inpName = document.querySelector("#inpName");
const inpImage = document.querySelector("#inpImage");
const inpDesc = document.querySelector("#inpDesc");
const btnAdd = document.querySelector("#btnAdd");
const btnOpenForm = document.querySelector("#flush-collapseOne");
const section = document.querySelector("#section");
const mbtiSection = document.querySelector("#mbtiSection");

let searchValue = "";
// Переменные для кнопок пагинации
const LIMIT = 4;
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");

// переменные для пагинации
let currentPage = 1;
let countPage = 1;

btnAdd.addEventListener("click", () => {
  if (
    // проверка на заполнение
    !inpName.value.trim() ||
    !inpDesc.value.trim() ||
    !inpImage.value.trim()
  ) {
    return alert("Fill in all fields!");
  }

  const newMbti = {
    title: inpName.value,
    desc: inpDesc.value,
    image: inpImage.value,
  };

  createItem(newMbti);
  renderGoods();
});

async function createItem(product) {
  await fetch(API, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(product),
  });
  btnOpenForm.classList.toggle("show");
  inpName.value = "";
  inpDesc.value = "";
  inpImage.value = "";
}

async function renderGoods() {
  // http://localhost:3000/goods?_page=2&_limit=6
  let res;
  if (searchValue) {
    res = await fetch(
      `${API}?title=${searchValue}&_page=${currentPage}&_limit=${LIMIT}`
    );
  } else {
    res = await fetch(`${API}?_page=${currentPage}&_limit=${LIMIT}`);
  }

  const data = await res.json();
  console.log(data);

  section.innerHTML = "";
  data.forEach(({ title, desc, image, id }) => {
    section.innerHTML += `
    <div class="card" style="width: 20rem;">
    <img src="${image}" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">${title}</h5>
      <p class="card-text">${desc}</p>
      <a href="#" class="btn btn-dark">Introduction</a>
      <button class="btn btn-outline-danger btnDelete" id="${id}">
                         Delete
                     </button>
                     <button
                         class="btn btn-outline-warning btnEdit" id="${id}"
                        data-bs-target="#exampleModal"
                        data-bs-toggle="modal"
                     >
                       Edit
                    </button>
    </div>
  </div>
  
        `;
  });
  // data.forEach(({ title, desc, image, id }) => {
  //   section.innerHTML += `
  //           <div class="card m-4 cardBook" style="width: 18rem">
  //               <img id="${id}" src=${image} class="card-img-top detailsCard" style="heigth: 280px" alt="${title}"/>
  //               <div class="card-body">
  //                   <h5 class="card-title">${title}</h5>
  //                   <p class="card-text">${desc}</p>

  //                   <button class="btn btn-outline-danger btnDelete" id="${id}">
  //                       Delete
  //                   </button>
  //                   <button
  //                       class="btn btn-outline-warning btnEdit" id="${id}"
  //                       data-bs-target="#exampleModal"
  //                       data-bs-toggle="modal"
  //                   >
  //                       Edit
  //                   </button>
  //               </div>
  //           </div>
  //       `;
  // });
  pageFunc();
}

async function pageFunc() {
  const res = await fetch(API);
  const data = await res.json();

  countPage = Math.ceil(data.length / LIMIT);
  if (currentPage === countPage) {
    nextBtn.parentElement.classList.add("disabled");
  } else {
    nextBtn.parentElement.classList.remove("disabled");
  }

  if (currentPage === 1) {
    prevBtn.parentElement.classList.add("disabled");
  } else {
    prevBtn.parentElement.classList.remove("disabled");
  }
}

// ------delete
document.addEventListener("click", async ({ target: { classList, id } }) => {
  const delClass = [...classList];
  if (delClass.includes("btnDelete")) {
    try {
      await fetch(`${API}/${id}`, {
        method: "DELETE",
      });
      renderGoods();
    } catch (error) {
      console.log(error);
    }
  }
});

renderGoods();

//=========== EDIT =========

const editInpName = document.querySelector("#editInpName");
const editInpImage = document.querySelector("#editInpImage");
const editInpDesc = document.querySelector("#editInpDesc");
const editBtnSave = document.querySelector("#editBtnSave");

document.addEventListener("click", async ({ target: { classList, id } }) => {
  const classes = [...classList];
  if (classes.includes("btnEdit")) {
    const res = await fetch(`${API}/${id}`);
    const {
      title,
      description,
      image,
      price,
      id: productId,
    } = await res.json();
    editInpName.value = title;
    editInpDesc.value = description;
    editInpImage.value = image;
    editBtnSave.setAttribute("id", productId);
  }
});

editBtnSave.addEventListener("click", () => {
  const editedProduct = {
    title: editInpName.value,
    description: editInpDesc.value,
    image: editInpImage.value,
  };
  editProduct(editedProduct, editBtnSave.id);
});

async function editProduct(product, id) {
  try {
    await fetch(`${API}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(product),
    });
    renderGoods();
  } catch (error) {
    console.log(error);
  }
}

prevBtn.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage--;
  renderGoods();
});

nextBtn.addEventListener("click", () => {
  if (currentPage >= countPage) return;
  currentPage++;
  renderGoods();
});

// Search

const searchInp = document.querySelector("#inpSearch");
const searchBtn = document.querySelector("#searchBtn");

searchInp.addEventListener("input", ({ target: { value } }) => {
  // console.log(value);
  searchValue = value;
});

searchBtn.addEventListener("click", () => {
  renderGoods();
});
