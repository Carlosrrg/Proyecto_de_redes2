var canvas = document.getElementById("grafica");
var contexto = canvas.getContext("2d");

var color_cuadricula = "#B9B8B8";//GRIS
var color_linea = "#B10606";//ROJO
var color_fondo = "#FFFFFF";//BLANCO
var color_centro = "#000000";//NEGRO
var color_bit_vertical = "#000000";//NEGRO 	

/*accion de botones*/
var btn_numero_bits = document.getElementById("btn_numero_bits");
var btn_hacer_grafica = document.getElementById("btn_hacer_grafica");

/*valores recibidos*/
var bits_enviar = document.getElementById("bits_enviar");
var mostrar_numero_bits = document.getElementById("mostrar_numero_bits");
var codigo_linea = document.getElementById("codigo_linea");

/*Elementos a mostrar*/
var tipo_codigo_graficar = document.getElementById("tipo_codigo_graficar");


/*elementos a graficar*/
var bits_graficar = document.getElementById("bits_graficar");

/*variables usadas para graficar*/
var altura = canvas.height;
var ancho = canvas.width;

/*Ocultar segunda parte*/
tipo_codigo_graficar.className = "no-visible";



btn_numero_bits.addEventListener("click", function(){ 
    var cantidad_bits = parseInt(bits_enviar.value);
    //var arreglo_bits = [];
    //alert(cantidad_bits);
    if(cantidad_bits > 0){  
        tipo_codigo_graficar.className = "visible"; 

        for(var i = 0; i < cantidad_bits; i++){ 
            bits_graficar.innerHTML += `<input type="text" class="caja_bit" id="bit_${i}" placeholder="0">`; 
        }
        canvas.width =  cantidad_bits*100; 
        ancho = canvas.width; 
    }
    else{
    	alert("Ingrese un valor mayor a cero y positivo...");
    }
});

btn_hacer_grafica.addEventListener("click", function(){ 
    canvas.className = "visible";
    limpiar_canvas_grafica(contexto, color_fondo);
	hacer_rectangulo(); 
	hacer_cuadricula();
    
    //alert(codigo_linea.value);
    if(codigo_linea.value == "RZ"){
    	//alert("bien");
        senal_RZ(obtener_bits_arreglo());
    }
    else if(codigo_linea.value == "NRZ"){
        senal_NRZ(obtener_bits_arreglo());
    }
    else if(codigo_linea.value == "AMI"){
        senal_AMI(obtener_bits_arreglo());
    }
    else if(codigo_linea.value == "ADI"){
        senal_ADI(obtener_bits_arreglo());
    }
    else{
    	alert("Por favor, seleccione una opcion...");
    }
    /*
							<option>RZ</option>
	                        <option>NRZ</option>
	                        <option>AMI</option>
	                        <option>ADI</option>
	                        <option>B3ZS</option>
	                        <option>B6ZS</option>
	                        <option>HDB3</option>
	                        <option>MANCHESTER</option>
	                        <option>CMI</option>
    */
});

function limpiar_canvas_grafica(canvas, color){
    canvas.fillStyle = color; //COLOR QUE LE ASIGNO AL RECTANGULO
    canvas.fillRect(0, 0, ancho, altura);//(VALOR INICIAL X, VALOR INICIAL Y, VALOR INICIAL DEL RECTANGULO X, VALOR INICIAL DEL RECTANGULO Y)
}                 //xi, yi, xf, yf

function hacer_rectangulo(){
    hacer_linea(contexto, 1, 1, ancho, 1, color_cuadricula);//LINEA SUPERIOR
    hacer_linea(contexto, 1, 1, 1, altura, color_cuadricula);//LINEA IZQUIERDA
    hacer_linea(contexto, 1, altura-1, ancho, altura-1, color_cuadricula);//LINEA INFERIOR
    hacer_linea(contexto, ancho-1, 0, ancho-1, altura, color_cuadricula); //LINEA DERECHA
}

function hacer_linea(contexto, x0, y0, x1, y1, color_cuadricula){
    contexto.beginPath();//inicia el camino de dibujo 
    contexto.strokeStyle = color_cuadricula; //color de lineas que conforman la cuadricula 
    contexto.moveTo(x0,y0); //valor inicial a dibujar
    contexto.lineTo(x1,y1); //hasta donde dibujo
    contexto.stroke(); //es como el lapiz que hace lo anterior pedido
    contexto.closePath(); //une el ultimo punto con el anterior que se dibujo
}

function hacer_cuadricula(){
    //LINEAS VERTICALES
    for(var i = 0; i < ancho/10 ; i++){ 
        var moverX = i * 10;
        hacer_linea(contexto, moverX, 0, moverX, altura, color_cuadricula); 
        if(moverX%100 ==0){
            hacer_linea(contexto, moverX, 0, moverX, altura, color_bit_vertical);
        }
    }
    //LINEAS HORIZONTALES
    for(var i = 0; i < ancho/10 ; i++){ 
        var moverY = i * 10;
        hacer_linea(contexto, 0, moverY, ancho, moverY, color_cuadricula);
    }
    hacer_linea(contexto, 0, altura/2, ancho, altura/2, color_centro); //LINEA DEL CENTRO
}


function senal_RZ(arreglo_bits){
	arreglo_bits;
	var posicionX = 1;
	var posicionY = 1;
	var arribaY = 2;
    var abajoY = altura - 2; 
    var linea_central = abajoY/2;
    var cont = 0;

    for(var i = 0; i < arreglo_bits.length; i++){
    	if(arreglo_bits[i] == 1){
    		if(posicionY == linea_central){
                hacer_linea(contexto, posicionX, linea_central, posicionX, arribaY, color_linea);
                posicionY = arribaY;
            }
            for(var j = 0; j < 5; j++){
                cont++;
                hacer_linea(contexto, posicionX, posicionY, posicionX+=10, posicionY, color_linea);
            }
            if(cont >= 5){
                hacer_linea(contexto, posicionX, arribaY, posicionX, linea_central, color_linea);
                posicionY = linea_central;
                for(var j = 0; j < 5; j++){
                    hacer_linea(contexto, posicionX, posicionY, posicionX+=10, posicionY, color_linea);
                }
            }
    	}
    	else{
    		for(var j = 0; j < 10; j++){
                posicionY = linea_central;
                hacer_linea(contexto, posicionX, posicionY, posicionX+=10, posicionY, color_linea);
            }
    	}
    }
}

function obtener_bits_arreglo(){
    var valores_inputs = bits_graficar.childNodes.length;
    var arreglo_bits = [];
    var bit_solo;
    for(var i = 0; i < valores_inputs; i++){
        bit_solo = document.getElementById(`bit_${i}`).value;
        arreglo_bits.push(bit_solo); 
    }
    return arreglo_bits;
}

function senal_NRZ(arreglo_bits){
	arreglo_bits;
	var posicionX = 1;
	var posicionY = 1;
	var arribaY = 2;
    var abajoY = altura - 2; 
    var linea_central = abajoY/2;

    for(var i = 0; i < arreglo_bits.length; i++){ 
        if(arreglo_bits[i] == 1){ 
            if(posicionY == linea_central){ 
                hacer_linea(contexto, posicionX, linea_central, posicionX, arribaY, color_linea); 
            }
            for(var j = 0; j < 10; j++){ 
                posicionY = arribaY;
                hacer_linea(contexto, posicionX, posicionY, posicionX+=10, posicionY, color_linea);
            }
        }
        else{  
            if(posicionY == arribaY){ 
                hacer_linea(contexto, posicionX, arribaY, posicionX, linea_central, color_linea);
            }
            for(var j = 0; j < 10; j++){
                posicionY = linea_central;
                hacer_linea(contexto, posicionX, posicionY, posicionX+=10, posicionY, color_linea);
            }
        }
    }
}