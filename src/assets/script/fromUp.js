// let projects = JSON.parse(localStorage.getItem("projects")) || [];

// Map loping / render

// function renderProjects(data = projects) {
//     const container = document.getElementById("projectList");

//     const projectHtml = data.map((project, i) => {
//         return `
//             <div class="card-Projects">
//                     <img src="${project.image}" alt="">
//                     <h3>${project.nama}</h3>
//                         <div class="des-container">
//                         <p>${project.deskripsi}</p>
//                     </div>
//                     <p class="tech">${project.tech.join(". ")}</p>
//                     <div class="button-card-project">
//                         <button class="show-button" onclick="showProject(${i})">show<i class="fa-regular fa-eye"></i></button>
//                         <button onclick="deleteProject(${i})" class = "deleteProject">Delet</button>
//                     </div>
//             </div>
//             `;
//     }).join("");

//     container.innerHTML =  projectHtml;

// }

// renderProjects();

//  FIlter

// const searchInput = document.getElementById("searchProject");

// searchInput.addEventListener("input", function() {
    
//     const keyword = this.value.toLowerCase();

//     const filtered = projects.filter(project =>
//         project.nama.toLowerCase().includes(keyword) ||
//         project.deskripsi.toLowerCase().includes(keyword) ||
//         project.tech.join(" ").toLowerCase().includes(keyword)
//     );

//     renderProjects(filtered);
// });

// form

// const form = document.getElementById("projectForm");

// form.addEventListener('submit', function (event) {
//     event.preventDefault();

//     const name = document.getElementById("namaP").value;
//     const deskription = document.getElementById("deskripsiP").value;
//     const imageInput = document.getElementById("image").files[0];

//     let tech = [];

//     if (document.getElementById("nodeJs").checked) tech.push("Node Js");
//     if (document.getElementById("reactJs").checked) tech.push("React Js");
//     if (document.getElementById("nextJs").checked) tech.push("Next Js");
//     if (document.getElementById("typeSc").checked) tech.push("typeSc");


//     const reader = new FileReader();

//     reader.onload = function () {
//         const newProject = {
//             id: projects.length + 1,
//             nama: name,
//             deskripsi: deskription,
//             image: reader.result,
//             tech: tech
//         };

//         projects.push(newProject);
//         localStorage.setItem("projects", JSON.stringify(projects));

//         renderProjects();
//         form.reset();
//     }

//     reader.readAsDataURL(imageInput);
// });

// function deleteProject(index) {
//     projects.splice(index, 1);

//     localStorage.setItem("projects", JSON.stringify(projects));

//     renderProjects();
// }

// function showProject(index) {
//     const project = projects[index];

//     alert(
//         "Nama: " + project.nama + "\n" +
//         "Deskripsi: " + project.deskripsi + "\n" +
//         "Tech: " + (project.tech ? project.tech.join(", ") : "-")
//     );
// }

