import { Leon, Lobo, Oso, Serpiente, Aguila } from "./classes.js";

// Define un módulo IIFE (Immediately Invoked Function Expression) para encapsular el código
// y evitar la contaminación del espacio global.
const moduloAnimal = (function () {
  let state = {
    instancias: [],
    animales: [],
  };
  // Array para almacenar el HTML de las tarjetas de animales.
  const card_deck_html = [];

  // Obtiene referencias a elementos del DOM que se utilizarán posteriormente.
  const div_animales = document.querySelector("#Animales");
  const tipo_animal = document.querySelector("#animal");
  const btn_registrar = document.querySelector("#btnRegistrar");
  const preview_animal = document.querySelector("#preview");
  const modal_animal = document.querySelector(".contenido-animal");
  const modal_audio = document.querySelector(".contenido-audio");

  // Agrega listeners de eventos a elementos del DOM.
  tipo_animal.addEventListener("change", chageHandler);
  btn_registrar.addEventListener("click", clickHandler);

  // Configura eventos para los modales de Bootstrap.
  $("#exampleModal").on("show.bs.modal", beforeModalShow);
  $("#audiomodal").on("show.bs.modal", beforeAudioModalShow);
  $("#audiomodal").on("hide.bs.modal", afterAudioModalShow);

  // Función asincrónica para inicializar el módulo.
  async function init() {
    const json = await getAnimal();
    state.animales = json;
  }
  // Manejador de eventos para el cambio en el select de tipo de animal.
  function chageHandler(e) {
    e.preventDefault();
    const animal_select = filtarAnimal(state.animales, this.value);
    preview_animal.innerHTML = `<img class="ajustado" src="./assets/imgs/${animal_select.imagen}" alt="">`;
  }

  // Manejador de eventos para el clic en el botón de registrar animal.
  function clickHandler(e) {
    e.preventDefault();

    const edad_animal = document.querySelector("#edad");
    const tipo = document.querySelector("#animal");
    const comentario = document.querySelector("#comentarios");

    // Valida que todos los campos del formulario estén completos.
    if (
      edad_animal.value !== "Debe seleccionar rango de edad" &&
      tipo.value !== "Elija un animal" &&
      comentario.value !== ""
    ) {
      const animal_fil = filtarAnimal(state.animales, tipo.value);
      const obj_animal = instanciarAnimal(
        tipo.value,
        edad_animal.value,
        comentario.value,
        animal_fil
      );
      state.instancias.push(obj_animal);
      // Renderiza la tarjeta del animal en el DOM.
      div_animales.innerHTML = renderTarjeta(
        obj_animal,
        state.instancias.length - 1
      );

      // Reinicia los valores de los campos del formulario.
      edad_animal.selectedIndex = 0;
      tipo.selectedIndex = 0;
      comentario.value = "";
    } else {
      alert("Complete los campos para añadir animales");
    }
  }
  // Función asincrónica para obtener la información de los animales desde el archivo JSON.
  async function getAnimal() {
    const animales = await fetchAnimal();
    return animales.animales;
  }

  // Función asincrónica para obtener los datos de los animales desde el archivo JSON.
  async function fetchAnimal() {
    try {
      // Realiza una solicitud fetch al archivo JSON y maneja errores.
      const response = await fetch("./animales.json");
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  }
  // Función para filtrar un animal del array de animales por su nombre.
  function filtarAnimal(animales, tipo) {
    return animales.find((animal) => animal.name === tipo);
  }
  // Función para crear una instancia de la clase de animal correspondiente.
  function instanciarAnimal(tipo_animal, edad_animal, comentario, animal) {
    switch (tipo_animal) {
      case "Leon":
        return new Leon(
          tipo_animal,
          edad_animal,
          animal.imagen,
          comentario,
          animal.sonido
        );
      case "Lobo":
        return new Lobo(
          tipo_animal,
          edad_animal,
          animal.imagen,
          comentario,
          animal.sonido
        );
      case "Serpiente":
        return new Serpiente(
          tipo_animal,
          edad_animal,
          animal.imagen,
          comentario,
          animal.sonido
        );
      case "Oso":
        return new Oso(
          tipo_animal,
          edad_animal,
          animal.imagen,
          comentario,
          animal.sonido
        );
      case "Aguila":
        return new Aguila(
          tipo_animal,
          edad_animal,
          animal.imagen,
          comentario,
          animal.sonido
        );
      default:
        // Lanza un error si el tipo de animal no se reconoce.
        throw new Error("Tipo de animal no reconocido");
    }
  }

 // Función para renderizar la tarjeta de un animal en el DOM.
function renderTarjeta(obj_animal, index = 0) {
  const html = `<div data-toggle="modal" data-target="#exampleModal" data-index="${index}" class="m-2 card col-sm-12 col-md-6 col-lg-4 p-0"> 
                      <img class="tarjeta" src="assets/imgs/${obj_animal.getImg()}" class="card-img-top" alt="${obj_animal.getNombre()}">
                      <div class="bg-dark card-body text-center d-flex justify-content-center align-items-center">
                          <button data-toggle="modal" data-target="#audiomodal" data-index="${index}" class="btn btn-primary btn-lg rounded-pill">
                            <i class="fas fa-volume-up text-white"></i>
                            Sonido
                          </button>
                      </div>
                  </div>`;

  // Agrega el HTML de la tarjeta al array de tarjetas.
  card_deck_html.push(html);
  return card_deck_html.join("");
}
  // Función que se ejecuta antes de que se muestre el modal del animal.
  function beforeModalShow(e) {
    const index = e.relatedTarget.dataset.index;
    const obj_animal = state.instancias[index];

    // Actualiza el contenido del modal con la información del animal.
    modal_animal.innerHTML = `<div class="m-2 card bg-dark text-center text-white my-3">
              <img class="tarjeta" src="assets/imgs/${obj_animal.getImg()}" class="card-img-top" alt="${obj_animal.getNombre()}">
              <div class="card-body">
              <h2>${obj_animal.getEdad()}</h2>
              <h3>${obj_animal.getNombre()}</h3>
          </div>`;

    // Actualiza el contenido del modal con los comentarios del animal.
    modal_comentarios.innerHTML = `<p class="text-center text-white">${obj_animal.getComentarios()}</p>`;
  }

  // Función que se ejecuta antes de que se muestre el modal de audio.
  function beforeAudioModalShow(e) {
    const index = e.relatedTarget.dataset.index;
    const obj_animal = state.instancias[index];

    modal_audio.innerHTML = `<audio controls autoplay>
                                  <source src="assets/sounds/${obj_animal.getSonido()}" type="audio/mp3">
                              </audio>`;
  }

  function afterAudioModalShow() {
    modal_audio.innerHTML = ``;
    modal_audio.appendChild(audio);
  }

  return { init: init };
})();

moduloAnimal.init();
