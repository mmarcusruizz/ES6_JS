import { Leon, Lobo, Oso, Serpiente, Aguila } from "./classes.js";

const moduloAnimal = (function () {
  
    let state = {
        instancias: [],
        animales: []
    };
    const card_deck_html = [];

    
    const div_animales = document.querySelector('#Animales');
    const tipo_animal = document.querySelector('#animal');
    const btn_registrar = document.querySelector('#btnRegistrar');
    const preview_animal = document.querySelector('#preview');
    const modal_animal = document.querySelector('.contenido-animal');
    const modal_audio = document.querySelector('.contenido-audio');

    // Events
    tipo_animal.addEventListener('change', chageHandler); 
    btn_registrar.addEventListener('click', clickHandler); 

    $('#exampleModal').on('show.bs.modal', beforeModalShow);
    $('#audiomodal').on('show.bs.modal', beforeAudioModalShow);
    $('#audiomodal').on('hide.bs.modal', afterAudioModalShow);

    // Funciones
    async function init() { 
        const json = await getAnimal();
        state.animales = json;
    }

    function chageHandler(e) { 
        e.preventDefault();
        const animal_select = filtarAnimal(state.animales, this.value);
        preview_animal.innerHTML = `<img class="ajustado" src="./assets/imgs/${animal_select.imagen}" alt="">`;
    }

    function clickHandler(e) { 
        e.preventDefault();
        
        const edad_animal = document.querySelector('#edad');
        const tipo = document.querySelector('#animal');
        const comentario = document.querySelector('#comentarios');

        if (edad_animal.value !== 'Seleccione un rango de años' && tipo.value !== 'Seleccione un animal' && comentario.value !== '') {
            const animal_fil = filtarAnimal(state.animales, tipo.value);
            const obj_animal = instanciarAnimal(tipo.value, edad_animal.value, comentario.value, animal_fil);
            state.instancias.push(obj_animal);
            div_animales.innerHTML = renderTarjeta(obj_animal, state.instancias.length - 1);

            edad_animal.selectedIndex = 0;
            tipo.selectedIndex = 0;
            comentario.value = '';
        } else {
            alert('Se deben llenar todos los campos para añadir el animal');
        }
    }

    async function getAnimal() {
        const animales = await fetchAnimal();
        return animales.animales;
    }

    async function fetchAnimal() {
        try {
            const response = await fetch('./animales.json');
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error al obtener los datos de los animales:', error);
        }
    }

    function filtarAnimal(animales, tipo) {
        return animales.find(animal => animal.name === tipo);
    }

    function instanciarAnimal(tipo_animal, edad_animal, comentario, animal) {
        switch (tipo_animal) {
            case 'Leon':
                return new Leon(tipo_animal, edad_animal, animal.imagen, comentario, animal.sonido);
            case 'Lobo':
                return new Lobo(tipo_animal, edad_animal, animal.imagen, comentario, animal.sonido);
            case 'Serpiente':
                return new Serpiente(tipo_animal, edad_animal, animal.imagen, comentario, animal.sonido);
            case 'Oso':
                return new Oso(tipo_animal, edad_animal, animal.imagen, comentario, animal.sonido);
            case 'Aguila':
                return new Aguila(tipo_animal, edad_animal, animal.imagen, comentario, animal.sonido);
            default:
                throw new Error('Tipo de animal no reconocido');
        }
    }

    // Render
    function renderTarjeta(obj_animal, index = 0) {
        const html = `<div class="card col-sm-12 col-md-6 col-lg-4 p-0">
                        <img data-toggle="modal" data-target="#exampleModal" data-index="${index}" class="tarjeta" src="assets/imgs/${obj_animal.getImg()}" class="card-img-top" alt="${obj_animal.getNombre()}">
                        <div data-toggle="modal" data-target="#audiomodal" data-index="${index}" class="bg-dark card-body text-center">
                            <i class="fas fa-volume-up text-white"></i>
                        </div>
                    </div>`;

        card_deck_html.push(html); 
        return card_deck_html.join('');
    }

    function beforeModalShow(e) {
        const index = e.relatedTarget.dataset.index;
        const obj_animal = state.instancias[index];

        modal_animal.innerHTML = `<div class="card bg-dark text-center text-white my-3">
                <img class="tarjeta" src="assets/imgs/${obj_animal.getImg()}" class="card-img-top" alt="${obj_animal.getNombre()}">
                <div class="card-body">
                <h2>${obj_animal.getEdad()}</h2>
                <h3>${obj_animal.getNombre()}</h3>
            </div>`;
              
        modal_comentarios.innerHTML = `<p class="text-center text-white">${obj_animal.getComentarios()}</p>`;
    }

    function beforeAudioModalShow(e) {
        const index = e.relatedTarget.dataset.index;
        const obj_animal = state.instancias[index];

        modal_audio.innerHTML = `<audio controls autoplay>
                                    <source src="assets/sounds/${obj_animal.getSonido()}" type="audio/mp3">
                                </audio>`;
    }

    function afterAudioModalShow() {
        modal_audio.innerHTML = ``;
    }

    return { init: init };
})();

moduloAnimal.init();
