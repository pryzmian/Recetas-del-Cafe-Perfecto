function buscarReceta() {
  const cafe = document.getElementById("cafe").value;
  fetch(`/api/recetas?cafe=${encodeURIComponent(cafe)}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Receta no encontrada");
      }
      return response.json();
    })
    .then((data) => {
      mostrarReceta(data);
    })
    .catch((error) => {
      mostrarError(error.message);
    });
}

function buscarEnTiempoReal() {
  const busqueda = document.getElementById("busqueda").value;
  fetch(`/api/recetas?cafe=${encodeURIComponent(busqueda)}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Receta no encontrada");
      }
      return response.json();
    })
    .then((data) => {
      mostrarReceta(data);
    })
    .catch((error) => {
      mostrarError(error.message);
    });
}

function mostrarReceta(receta) {
    const resultado = document.getElementById("resultado");
    resultado.innerHTML = `
      <div id="resultado" class="resume-widget">
          <div class="resume-item wow fadeInRight" data-wow-delay=".5s"style="visibility: visible; animation-delay: 0.5s; animation-name: fadeInRight;">
          <h3 class="resume-title">${receta.nombre}</h3>
          <div class="institute mb-2"><strong>Descripcion:</strong> ${Array.isArray(receta.descripcion) ? receta.descripcion.join(", ") : receta.descripcion}</div>         
          <div class="institute mb-2"><strong>Ingredientes:</strong> ${receta.ingredientes.join(", ")}</div>
          <div class="institute"><strong>Instrucciones:</strong> ${receta.instrucciones.join("\n")}</div>
          </div>
      </div>`;
  }  

function mostrarError(error) {
  const resultado = document.getElementById("resultado");
  resultado.innerHTML = `<p>${error}</p>`;
}

function agregarReceta() {
  var nuevoCafe = document.getElementById("nuevoCafe").value.trim();
  var descripcion = document.getElementById("descripcion").value.trim();
  var ingredientes = document.getElementById("ingredientes").value.trim();
  var instrucciones = document.getElementById("instrucciones").value.trim();

  if (nuevoCafe === "" || ingredientes === "" || instrucciones === "") {
    alert("Por favor, complete todos los campos.");
    return;
  }

  var nuevaReceta = {
    nombre: nuevoCafe,
    descripcion: descripcion.split(",").map((item) => item.trim()),
    ingredientes: ingredientes.split(",").map((item) => item.trim()),
    instrucciones: instrucciones.split("\n").map((item) => item.trim()),
  };

  fetch("/api/agregar-receta", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nuevaReceta),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("No se pudo agregar la receta");
      }
      alert("Receta agregada correctamente");
    })
    .catch((error) => {
      alert(error.message);
    });
}
