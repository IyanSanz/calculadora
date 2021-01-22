// Realizamos las búsquedas sobre los objetos. Almacenaremos el objeto display (El texto que saldrá por pantalla) y una colección con todos los botones de los que dispone nuestra calculadora.
const display = document.querySelector("input");
const botones = document.querySelector(".botones");
const memoriaDetalle = document.querySelector(".memoria-detalle");

// Creamos una variable que tendrá el valor "false" o "true" según se haya introducido ya el primer caracter del segundo operando o no.
var entradaOperando2 = false;

// Asignamos a todos los botones un único método click. Esto nos sirve para ahorrarnos el proceso de asignar a cada botón un único método personal.
botones.addEventListener("click", procesaEvento);

//Objeto calculadora. Están comentados los métodos que no vamos a usar de momento ya que sea porque están incluidos en otro método para simplificar el programa o que aún no están programados.
const calculadora = {
    operando1: 0,
    operando2: 0,
    operacion: "",
    longitiud_display: 21,
    longitud_memoria: 4,
    memoria: [],
    // Métodos de memoria
    borramemoria,
    recuperamemoria,
    sumamemoria,
    restamemoria,
    almacenamemoria,
    muestramemoria,
    deshabilitamemoria,
    // porcentaje,
    // borrareciente,
    borrar,
    retroceso,

    // MÉTODOS que no se necesitan ya que están implementados en 'unaria'
    // pi,
    // e,
    // seno,
    // coseno,
    // inverso,
    // cuadrado,
    // raizcuadrada,
    unaria,

    // MÉTODOS que no se necesitan ya que están implementados en aritmetica
    // dividir,
    // multiplicar,
    // restar,
    //sumar
    aritmetica,

    // cambiasigno,
    igual
}

// Método que procesa el evento recibido y actúa en consecuencia.
function procesaEvento(evento) {

    // Recogemos y almacenamos en una variable la información actual del display.
    let cadenaDisplay = display.value;

    // Recogemos la clase del botón seleccionado en el switch.
    switch (evento.target.className) {

        // En caso de que sea un número llamamos al método que nos introduce el número en el display
        case "numero":
            procesaDigito(evento.target.innerText);
            break;

            // En caso de que el usuario quiera introducir una coma comprobamos que no haya introducido una anteriormente. En caso negativo introducimos una en el display y lo actualizamos.
        case "coma":
            if (cadenaDisplay.indexOf(",") == -1) {
                cadenaDisplay += ",";
            }

            actualizaDisplay(cadenaDisplay);
    }

    // Recogemos el atributo del botón seleccionado. Si existe un atributo llamado "data-operacion".... .
    if (evento.target.getAttribute("data-operacion")) {

        // Variable donde almacenaremos el atributo
        let cadenaDataOperacion = "";

        // En caso de que el atributo se componga de más de una palabra crearemos un array para manejarlo.
        let operaciones = [];

        // Recibimos el atributo de del evento y lo almacenamos en la variable.
        cadenaDataOperacion = evento.target.getAttribute("data-operacion");

        // Dividimos el atributo en caso de tener varios valores.
        operaciones = cadenaDataOperacion.split(" ");

        // En el caso de que data-operacion contenga "unaria" llamaremos al método que trata las operaciones de un único valor (seno, coseno, inverso...)
        if (operaciones[1] == "unaria") {
            calculadora.unaria(operaciones[0]);
        }

        // OPCIONAL: Aquí podremos introducir el comprobante de si data-opercion contiene "aritmetica" y facilitar así aún más el proceso en un único método.

        if (operaciones[1] == "memoria") {
            procesaEventosMemoria(operaciones[0]);
        } else {

            // Al haber introducido ya un operador, procederemos a la entrada del operador2, por lo tanto cambiamos el valor de la variable entradaOperador2 del objeto calculadora.
            calculadora.entradaOperador2 = true;

            // Almacenamos en la lista de operaciones el evento tratado en el evento.
            calculadora[operaciones[0]](evento.target);
        }
    }


}

// Método que borra de la calculadora todo lo almacenado en memoria y mostramos "0" en el display.
function borrar() {
    calculadora.operando1 = 0;
    calculadora.operando2 = 0;
    calculadora.operacion = "";
    display.value = "0";
}

// Método que resuelve la operación dada
function igual() {

    // Almacena el operando del display en el espacio en calculadora asignado
    ponOperando(display.value, "operando2");

    // Realizamos la operación con los objetos guardados en calculadora
    let operacion = `${calculadora.operando1} ${calculadora.operacion} ${calculadora.operando2}`;

    // Realizamos la operación descrita en el string mediante el método eval()
    let resultado = eval(operacion);

    // Pasamos el resultado a número usando la nomenclatura alemana y lo mostramos en el display. (La española sería la misma, pero la referencia no funciona. Un pequeño parche).
    display.value = Number(resultado).toLocaleString("de-DE");
}

// Método que elimina el último caracter
function retroceso() {

    // Selecciona lo introducido en el display salvo el último caracter
    display.value = display.value.substr(0, display.value.length - 1);

    // Si el display no tiene caracteres, imprime por pantalla "0"
    if (display.value.length == 0) display.value = "0";
}

// Método que resuelve una operación
function aritmetica(boton) {

    // En caso de que el operando que quiere introducir el usuario sea 0, no hacemos nada y salimos
    if (display.value == "0") return;

    // Introducimos en el objeto calculadora el operando1
    ponOperando(display.value, "operando1");

    // Dependiendo del tipo de operación que sea guardamos en calculadora.operacion un objeto u otro.
    switch (boton.innerText) {

        // Si es "x" significa que el usuario quiere multiplicar, guardamos "*"
        case "x":
            calculadora.operacion = "*";
            break;

            // Si es el caracter de división significa que el usuario quiere dividir, guardamos "/"
        case (String.fromCharCode(247)): // División 
            calculadora.operacion = "/";
            break;

            // En caso de que no sea ninguno de estos, será sumar o restar, por lo tanto almacenamos en calculadora.operacion el contenido del botón.
        default:
            calculadora.operacion = boton.innerText;
    }

}

// Método que recibe un dígito que muestra por pantalla
function procesaDigito(digito) {

    // Inicializamos variable que contendrá el contenido del display.
    let cadenaDisplay = "";

    // Si display tiene la máxima longitud que permitimos salimos
    if (display.value.length == calculadora.longitiud_display) return;

    //Si no se ha se solicitado operación seguimos introduciendo operando1. Estado de entradaOperando2 = true al seleccionar operación
    if (entradaOperando2) {
        cadenaDisplay = "0";
        //Cambiamos estado de entradaOperando2, Solo debe indicar primer dígito
        entradaOperando2 = false;
    } else {
        cadenaDisplay = display.value;
    }

    // Procesamos posibles situaciones. Ej. display.value = 0
    if (cadenaDisplay == "0") {
        cadenaDisplay = digito;
    } else {
        cadenaDisplay += digito;
    }

    actualizaDisplay(cadenaDisplay);
}

// Método que recibe el contenido del display y el operando donde se quiere almacenar el contenido
function ponOperando(cadenaDisplay, operando) {

    // Comprobamos que no se han introducido espacios en blanco y reemplazamos las comas por puntos debido a la nomenclatura de operaciones de JS.
    cadenaDisplay = cadenaDisplay.replace(/\./g, "");
    cadenaDisplay = cadenaDisplay.replace(",", ".");

    // Almacenamos en memoria el operando.
    calculadora[operando] = Number.parseFloat(cadenaDisplay);

    // Marcamos que el siguiente dígito que se va a introducir es parte del operando2
    entradaOperando2 = true;
}

// Método que recibe una cadena y la muestra en el display
function actualizaDisplay(cadenaDisplay) {

    //Comprobamos si hay , y ponemos separadores de miles y decimales
    if (cadenaDisplay.indexOf(",") == -1) {
        cadenaDisplay = cadenaDisplay.replace(/\./g, "");
        cadenaDisplay = Number(cadenaDisplay).toLocaleString("de-DE");
    }

    display.value = cadenaDisplay;
}

// Método que trata con aquellas operaciones unarias, aquellas que únicamente trabajan con un operador.
function unaria(operacion) {

    // Creamos la variable para almacenar el resultaod
    let cadenaDisplay = "";

    // Llamamos al método que dar formato al operador pasado por parámetro y lo guarda en el objeto calculadora.
    ponOperando(display.value, "operando1");

    // Dependiendo de la operación que quiera realizar el usuario, almacenaremos en cadenaDisplay un resultado u otro.
    switch (operacion) {

        case "seno":
            cadenaDisplay = String(Math.sin(calculadora.operando1));
            break;

        case "coseno":
            cadenaDisplay = String(Math.cosa(calculadora.operando1));
            break;

        case "inverso":
            cadenaDisplay = String(1 / calculadora.operando1);
            break;

        case "cuadrado":
            cadenaDisplay = String(Math.pow(calculadora.operando1, 2));
            break;

        case "raizcuadrada":
            cadenaDisplay = String(Math.sqrt(calculadora.operando1));
            break;
    }

    // Modificamos la cadena de texto que contiene el resultado con el formato correcto.
    cadenaDisplay = cadenaDisplay.replace(".", ",");
    actualizaDisplay(cadenaDisplay);
}

function muestramemoria() {

    memoriaDetalle.innerHTML = "";

    for (let memoria of calculadora.memoria) {
        let divMemoria = document.createElement("div");
        divMemoria.innerText = memoria;
        divMemoria.className = "valor-memoria";
        memoriaDetalle.appendChild(divMemoria);
    }

    memoriaDetalle.style.top = (memoriaDetalle.style.top == "-280px") ? "0" : "-280px";
}

function almacenamemoria() {
    calculadora.memoria.push(display.value);
    calculadora.deshabilitarmemoria(false);
}

function deshabilitamemoria(estado) {

    const botonesMemoria = document.querySelectorAll(".memoria>button");

    for (let boton of botonesMemoria) {
        boton.disabled = estado;
    }

    botones[4].disabled = false;
}

function procesaEventosMemoria(memoriaOperacion) {

    switch (memoriaOperacion) {
        case "borra":
            break;

        case "recupera":
            break;

        case "suma":
            break;

        case "resta":
            break;

        case "almacena":
            break;

        case "muestra":
            break;
    }
}