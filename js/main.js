document.addEventListener('DOMContentLoaded', () => {
    "use strict";
    
    // ------------------------------------------- NAV (general)-------------------------------------------------------------
    const abrirMenu = document.getElementById("abrir_menu");
    abrirMenu.addEventListener('click', desplegarMenu);
    
    const cerrarMenu = document.getElementById("cerrar_menu");
    cerrarMenu.addEventListener('click', desplegarMenu);
    
    function desplegarMenu() {
        document.querySelector('.nav').classList.toggle('desplegar');
    }
    
    
    // ------------------------------------------ MODO OSCURO (general)----------------------------------------------------
    
    const btnModo = document.querySelector('.btn_modo')
    btnModo.addEventListener('click', cambiarModo);
    
    const btnMenu = document.querySelector('.btn_menu');
    
    function cambiarModo(){
        //alterna la clase, y CSS se encarga de cambiar los estilos respectivos a sus hijos
        document.querySelector('body').classList.toggle('oscuro');
    
        // cambia la imagen según el modo
        if (document.body.classList.contains('oscuro')) {
    
            localStorage.setItem('modoOscuro', 'true');// guarda en localStorage que el modo oscuro está ACTIVADO
    
            btnModo.src = "Imgs/modo-claro.png";
            btnModo.title = "Modo claro";
            btnModo.alt = "modo claro";
    
            btnMenu.src = "Imgs/barra-de-menus-claro.png";
            cerrarMenu.src = "Imgs/barra-de-menus-claro.png";
        } else {
    
            localStorage.setItem('modoOscuro', 'false');// guarda en localStorage que el modo oscuro está DESACTIVADO
    
            btnModo.src = "Imgs/modo-oscuro.png";
            btnModo.title = "Modo oscuro"
            btnModo.alt = "modo oscuro";
    
            btnMenu.src = "Imgs/barra-de-menus-oscuro.png";
            cerrarMenu.src = "Imgs/barra-de-menus-oscuro.png";
        }
    }
    
    // Al cargar la página, verifico si el modo oscuro estaba activado en la última visita
    const modoOscuro = localStorage.getItem('modoOscuro');

    if (modoOscuro === 'true') {
        cambiarModo()
    }

    // -------------------------------------- CAPTCHA FORM -----------------------------------------------------

    function initCaptcha() {
        let imgs = ["jucani.jpg", "KHXMZ.jpg", "ZNAZBG.jpg"];
        let carpeta = "Imgs/captcha/";
        
        let btnCaptcha = document.querySelector("#btn_captcha");
        // Valido si el botón existe en la página
        if(!btnCaptcha) return;
        
        btnCaptcha.addEventListener("click", recargarCaptcha);
        
        function recargarCaptcha() {
            let imgCaptcha = document.querySelector("#img_captcha");
            let indice = Math.floor(Math.random() * imgs.length);
            imgCaptcha.src = carpeta + imgs[indice];
        
            let codCaptcha = imgs[indice].replace(/\.[^/.]+$/, "");
            imgCaptcha.dataset.codigo = codCaptcha;
        }
        
        recargarCaptcha();
        
        let btnEnviar = document.querySelector("#btn_enviar");
        if(btnEnviar){
            btnEnviar.addEventListener("click", validarCaptcha);
        }
        
        function validarCaptcha() {
            let imgCaptcha = document.querySelector("#img_captcha");
            let inputUsuario = document.querySelector("#input_captcha");
            let msjCaptcha = document.querySelector("#msjCaptcha");
        
            if (imgCaptcha.dataset.codigo == inputUsuario.value) {
                msjCaptcha.innerHTML = "Captcha correcto, formulario enviado";
                msjCaptcha.classList.add('correcto');
            } else {
                msjCaptcha.innerHTML = "Captcha incorrecto, intente nuevamente";
                msjCaptcha.classList.remove('correcto');
            }
        }
    }

    // -------------------------------------API CLIMA----------------------------------------------------------

    const url = "https://68f6aa0c6b852b1d6f1761d8.mockapi.io/api/v1/Clima"
    const urlObj = new URL(url);

    let datosClima = [];
    let idModificar = null;
    let idEliminar = null;

    // Obtener datos
    async function getData(){

        let tablaClima = document.querySelector("#tabla_clima tbody");
        if(!tablaClima) return; // Si no existe la tabla, salir
        
        tablaClima.innerHTML = "";

        try {

            let res = await fetch(urlObj);
            let json = await res.json();

            datosClima = json;

            for( let item of json ){
                let fila = crearFilaTabla(item);
                tablaClima.appendChild(fila);
            }
            
        } catch(error){
            console.log("Error: " + error);
        }
    }

    function crearFilaTabla(item) {
        let fila = document.createElement("tr");

        // Crear celdas de datos
        let celdaDia = document.createElement("td");
        celdaDia.textContent = item.dia;
        fila.appendChild(celdaDia);

        let celdaCondicion = document.createElement("td");
        celdaCondicion.textContent = item.condicion;
        fila.appendChild(celdaCondicion);

        let celdaTempMax = document.createElement("td");
        celdaTempMax.textContent = item.temperatura_maxima + " °C";
        fila.appendChild(celdaTempMax);

        let celdaTempMin = document.createElement("td");
        celdaTempMin.textContent = item.temperatura_minima + " °C";
        fila.appendChild(celdaTempMin);

        let celdaProbLluvia = document.createElement("td");
        celdaProbLluvia.textContent = item.Probabilidad_de_lluvia + " %";
        fila.appendChild(celdaProbLluvia);

        // Crear botones de acciones
        let celdaAcciones = document.createElement("td");

        let btnModificar = document.createElement("button");
        btnModificar.classList.add("btn_accion_modificar");
        btnModificar.id = item.id;
        btnModificar.textContent = "Modificar";
        celdaAcciones.appendChild(btnModificar);

        let btnEliminar = document.createElement("button");
        btnEliminar.classList.add("btn_accion_eliminar");
        btnEliminar.id = item.id;
        btnEliminar.textContent = "Eliminar";
        celdaAcciones.appendChild(btnEliminar);

        fila.appendChild(celdaAcciones);

        return fila;
    }

    function abrirPopupAgregar() {
        document.querySelector("#id_agregar").value = "";
        document.querySelector("#dia_agregar").value = "";
        document.querySelector("#condicion_agregar").value = "";
        document.querySelector("#temp_max_agregar").value = "";
        document.querySelector("#temp_min_agregar").value = "";
        document.querySelector("#prob_lluvia_agregar").value = "";

        document.querySelector("#popup_overlay_agregar").classList.add("visible");
    }

    function cerrarPopupAgregar() {
        document.querySelector("#popup_overlay_agregar").classList.remove("visible");
    }

    async function sendData() {
        let id = document.querySelector("#id_agregar").value;
        let dia = document.querySelector("#dia_agregar").value;
        let condicion = document.querySelector("#condicion_agregar").value;
        let temperaturaMaxima = document.querySelector("#temp_max_agregar").value;
        let temperaturaMinima = document.querySelector("#temp_min_agregar").value;
        let probabilidadDeLluvia = document.querySelector("#prob_lluvia_agregar").value;

        let data = {
            id: id,
            dia: dia,
            condicion: condicion,
            temperatura_maxima: temperaturaMaxima,
            temperatura_minima: temperaturaMinima,
            Probabilidad_de_lluvia: probabilidadDeLluvia
        };

        try {
            let res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            let json = await res.json();
            console.log("Datos enviados: ", json);

            getData();
            cerrarPopupAgregar();

        } catch (error) {
            console.log("Error al enviar datos: " + error);
        }
    }

    async function abrirPopupModificar(id) {
        try {
            let res = await fetch(url + "/" + id);
            let json = await res.json();

            document.querySelector("#dia_modificar").value = json.dia;
            document.querySelector("#condicion_modificar").value = json.condicion;
            document.querySelector("#temp_max_modificar").value = json.temperatura_maxima;
            document.querySelector("#temp_min_modificar").value = json.temperatura_minima;
            document.querySelector("#prob_lluvia_modificar").value = json.Probabilidad_de_lluvia;

            document.querySelector("#popup_overlay").classList.add("visible");
        }
        catch (error) {
            console.log("Error al obtener datos: " + error);
        }
    }

    function cerrarPopup() {
        document.querySelector("#popup_overlay").classList.remove("visible");
    }

    async function modifyData() {
        let diaModificar = document.querySelector("#dia_modificar").value;
        let condicionModificar = document.querySelector("#condicion_modificar").value;
        let temperaturaMaximaModificar = document.querySelector("#temp_max_modificar").value;
        let temperaturaMinimaModificar = document.querySelector("#temp_min_modificar").value;
        let probabilidadLluviaModificar = document.querySelector("#prob_lluvia_modificar").value;

        let data = {
            id : idModificar,
            dia: diaModificar,
            condicion: condicionModificar,
            temperatura_maxima: temperaturaMaximaModificar,
            temperatura_minima: temperaturaMinimaModificar,
            Probabilidad_de_lluvia: probabilidadLluviaModificar
        };

        try {
            let res = await fetch (url + "/" + idModificar, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            let json = await res.json();
            console.log("Datos modificados: ", json);

            getData();
            cerrarPopup();
        }

        catch (error) {
            console.log("Error al modificar datos: " + error);
        }
    } 

// -----------------------------------Funcionalidad para eliminar filas (api clima)-------------------------------------------

    async function deleteData() {

        let data = {
            id: idEliminar
        };

        try {
            let res = await fetch (url + "/" + idEliminar, {
                method: "DELETE",   
                headers: {
                    "Content-Type": "application/json"
                }
            });

            let json = await res.json();
            console.log("Datos eliminados: ", json);

            getData(); // Actualiza la tabla después de eliminar los datos
        }

        catch (error) {
            console.log("Error al eliminar datos: " + error);
        }
    }

    // --------------------------------------PAGINACION PRONOSTICO (api clima) --------------------------------------------

    urlObj.searchParams.set('page', 1);
    urlObj.searchParams.set('limit', 7);

    function paginacionSiguiente(){
        
        let inicio = parseInt (urlObj.searchParams.get('page'));
        urlObj.searchParams.set('page', String(inicio + 1));

        console.log("siguiente");
        getData();
    }

    function paginacionAnterior(){
        let inicio = parseInt (urlObj.searchParams.get('page'));
        if (inicio > 1){
            urlObj.searchParams.set('page', String(inicio - 1));
        }

        console.log("anterior");
        getData();
    }
    

    // ----------------------------------------FILTROS PRONOSTICO (api clima) ---------------------------------------------

    // Filtrar por condicion, dia, temperaturas y probabilidad de lluvia
    function filtrar(){
        let valorFiltro = document.querySelector("#filtro_condicion").value.toLowerCase();
        let tablaClima = document.querySelector("#tabla_clima tbody");

        tablaClima.innerHTML = "";
        for(let i = 0; i < datosClima.length; i++){
            let item = datosClima[i];

            // Convierto a texto los valores a comparar
            let diaTexto = item.dia.toLowerCase();
            let condicionTexto = item.condicion.toLowerCase();
            let tempMaxTexto = item.temperatura_maxima.toString();
            let tempMinTexto = item.temperatura_minima.toString();
            let probLluviaTexto = item.Probabilidad_de_lluvia.toString();

            let coincide = diaTexto.includes(valorFiltro) ||
                        condicionTexto.includes(valorFiltro) ||
                        tempMaxTexto.includes(valorFiltro) ||
                        tempMinTexto.includes(valorFiltro) ||
                        probLluviaTexto.includes(valorFiltro);

            if(coincide) {
                let fila = crearFilaTabla(item);
                tablaClima.appendChild(fila);
            }
        }
    }

    function limpiarFiltro(){
        document.querySelector("#filtro_condicion").value = "";
        getData();
    }

    // ------------------------------------------ INICIALIZAR PRONOSTICO (api clima) ------------------------------------------------

    function initPronostico() {
        // Verificar si estamos en la página de pronóstico
        let tablaClima = document.querySelector("#tabla_clima tbody");
        if(!tablaClima) return;

        // Escucha si hubo un click en el tbody
        tablaClima.addEventListener("click", function(event){
            if (event.target.classList.contains("btn_accion_eliminar")){
                idEliminar = event.target.id;
                deleteData();

            } else if (event.target.classList.contains("btn_accion_modificar")){
                idModificar = event.target.id;
                abrirPopupModificar(idModificar);
            }
        });

        // ----------------------------------------------- BTN ACCIONES (api clima) -------------------------------------------------------

        // Abrir popup agregar
        let btnAbrirAgregar = document.querySelector("#btn_abrir_agregar");
        if(btnAbrirAgregar) {
            btnAbrirAgregar.addEventListener("click", function(event){
                event.preventDefault();
                abrirPopupAgregar();
            });
        }

        // Agregar datos
        let btnAgregar = document.querySelector("#btn_agregar");
        if(btnAgregar) {
            btnAgregar.addEventListener("click", function(event){
                event.preventDefault();
                sendData();
            });
        }

        // Cancelar agregar
        let btnCancelarAgregar = document.querySelector("#btn_cancelar_agregar");
        if(btnCancelarAgregar) {
            btnCancelarAgregar.addEventListener("click", function(event){
                event.preventDefault();
                cerrarPopupAgregar();
            });
        }

        // Modificar datos
        let btnModificar = document.querySelector("#btn_modificar");
        if(btnModificar) {
            btnModificar.addEventListener("click", function(event){
                event.preventDefault();
                modifyData();
            });
        }

        // Cancelar modificacion
        let btnCancelar = document.querySelector("#btn_cancelar");
        if(btnCancelar) {
            btnCancelar.addEventListener("click", function(event){
                event.preventDefault();
                cerrarPopup();
            });
        }

        // Pagina siguiente
        let btnSiguiente = document.querySelector("#btn_siguiente");
        if(btnSiguiente) {
            btnSiguiente.addEventListener("click", function(event){
                event.preventDefault();
                paginacionSiguiente();
            });
        }

        // Pagina anterior
        let btnAnterior = document.querySelector("#btn_anterior");
        if(btnAnterior) {
            btnAnterior.addEventListener("click", function(event){
                event.preventDefault();
                paginacionAnterior();
            });
        }

        // Filtro automatico al escribir
        let inputFiltro = document.querySelector("#filtro_condicion");
        if(inputFiltro) {
            inputFiltro.addEventListener("input", function(event){
                filtrar();
            });
        }

        // Limpiar filtro
        let btnLimpiarFiltro = document.querySelector("#btn_limpiar_filtro");
        if(btnLimpiarFiltro) {
            btnLimpiarFiltro.addEventListener("click", function(event){
                event.preventDefault();
                limpiarFiltro();
            });
        }

        getData();
    }

    // -------------------------------------- AJAX -------------------------------------------------------

    const content = document.getElementById("content");
    const nav = document.getElementById("nav");

    nav.addEventListener("click", function(event) {
        const a = event.target.closest("a");
        if (!a || !nav.contains(a)) return;
        event.preventDefault();
        const page = a.getAttribute("href");
        loadPage(page);
        history.pushState({ page }, "", "#" + page);
    });

    window.addEventListener("popstate", function(event) {
        loadPage(event.state?.page || "pages/home.html");
    });

    async function loadPage(page) {
        try {
            const response = await fetch(page);
            if (!response.ok) {
                content.innerHTML = `<h2>Error ${response.status}: No se encontró la página</h2>`;
                return;
            }
            const html = await response.text();
            content.innerHTML = html;
            setActiveLink(page);
            
            // Reinicializar funcionalidades después de cargar el contenido
            initPageFunctionality(page);
            
        } catch (error) {
            content.innerHTML = "<h2>Error al cargar la página</h2>";
            console.error(error);
        }
    }

    function initPageFunctionality(page) {
        // Inicializar funcionalidades específicas según la página
        if (page.includes('pronostico')) {
            initPronostico();
        } else if (page.includes('formulario')) {
            initCaptcha();
        }
    }

    function setActiveLink(page) {
        nav.querySelectorAll("a").forEach(a => {
            a.classList.toggle("active", a.getAttribute("href") === page);
        });
    }

    // Cargar página inicial
    loadPage("pages/home.html");
});