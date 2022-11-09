let posicion;
let n;
let x;
let fx;
let poli;
let coeficientes;
let operaciones1;
let operaciones2;
let coordenadas;
let L;
let lagrange;
let lagrangeRedondeado;
let lagrangeSuperIndices;
let primerValor;
let puntoABuscar;
let resultado;
let canva;
let grafica;
let xMayor;
let xMenor;
let delayed;

function btnAgregar_Click()
{
    if(verificarCoordenadaCorrecta(document.getElementById("txtCoordenadas").value))
    {
        posicion = document.getElementById('tblCoordenadas').getElementsByTagName('tr').length;
        let tblCoordenadas = document.getElementById("tblCoordenadas").insertRow(posicion);
        let col1 = tblCoordenadas.insertCell(0);
        let col2 = tblCoordenadas.insertCell(1);
        col1.innerHTML = posicion;
        col2.innerHTML = document.getElementById("txtCoordenadas").value;
    
        posicion++;
    
        document.getElementById("txtCoordenadas").value = "";
        document.getElementById("txtCoordenadas").focus();
        habilitarBotones();
    }

}

function btnModificar_Click()
{
    let fila = prompt("Ingrese el número de la coordenada que desea modificar: ");
    if(fila != undefined)
    { 
        fila = parseInt(fila);
        n = document.getElementById('tblCoordenadas').getElementsByTagName('tr').length - 1;

        if(fila >= 1 && fila <=  document.getElementById('tblCoordenadas').getElementsByTagName('tr').length - 1)
        {
            let celdas = document.getElementById("tblCoordenadas").rows[fila].cells;
            let coordenada = prompt("Ingrese la nueva coordenada: ");

            if(verificarCoordenadaCorrecta(coordenada))
                celdas[1].innerHTML = coordenada;
            else
                alert(`Ha ingresado una coordenada no valida. Por favor, ingrese únicamente cordenadas de la forma 'x,y'`);
        }
        else
           alert(`Ingrese un número entre el 1 y el ${n}`);
   }
}

function habilitarBotones()
{
    n = document.getElementById('tblCoordenadas').getElementsByTagName('tr').length - 1;

    if (n >= 2)
    {    
        if(verificarPuntoABuscar())
            document.getElementById("btnInterpolar").disabled = false;
        else
            document.getElementById("btnInterpolar").disabled  = true;
    }

    if (n >= 1)
    {
        document.getElementById("btnModificar").disabled = false;
        document.getElementById("btnBorrar").disabled = false;
    }
    else
    {
        document.getElementById("btnModificar").disabled = true;
        document.getElementById("btnBorrar").disabled = true;
    }
}

function btnBorrar_Click()
{
    let fila = prompt("Ingrese el número de la coordrenada que desea eliminar: ");

    if(fila != undefined)
    {
        fila = parseInt(fila);
        n = document.getElementById('tblCoordenadas').getElementsByTagName('tr').length - 1;

        if(fila >= 1 && fila <=  document.getElementById('tblCoordenadas').getElementsByTagName('tr').length - 1)
            document.getElementById("tblCoordenadas").deleteRow(fila);
        else
            alert(`Ingrese un número entre el 1 y el ${n}`);

        for (let i = 1; i < document.getElementById('tblCoordenadas').getElementsByTagName('tr').length; i++)
        {
            let celdas = document.getElementById("tblCoordenadas").rows[i].cells;
            celdas[0].innerHTML = i;
        }

    habilitarBotones();
    }
}

function btnInterpolar_Click()
{
    try
    {
        ObtenerValores();
        SepararCoordenadas();
        CalcularProductivos();
        GenerarPolinomio();
        CalcularResultado();
        graficar();
    }
    catch
    {
        n = document.getElementById('tblCoordenadas').getElementsByTagName('tr').length - 1;
        if (n < 2)
            alert("Ingrese al menos dos coordenadas para generar el polinomio", "Error");
        else
            alert("Las coordenas ingresadas no se pueden interpolar. Verifique que ha ingresado las coordenadas correctamente.");
    }
}

function ObtenerValores()
{
    xMayor = -9999999999;
    xMenor = 9999999999;
    let tabla = document.getElementById('tblCoordenadas');
    puntoABuscar = document.getElementById('txtPuntoABuscar').value;

    if(puntoABuscar > xMayor)
        xMayor = puntoABuscar;

    if(puntoABuscar < xMenor)
        xMenor = puntoABuscar;

    n = document.getElementById('tblCoordenadas').getElementsByTagName('tr').length - 1;
    coordenadas = new Array(n);
    x = new Array(n);
    fx = new Array(n);
    L = new Array(n);
    coeficientes = new Array(n);
    operaciones1 = new Array(n);
    operaciones2 = new Array(n);
    poli = new Array(n);
    canva = document.getElementById('grafica').getContext('2d');

    for (let i = 1; i <= n; i++)
        coordenadas[i-1] = tabla.rows[i].cells[1].innerHTML;
}

function SepararCoordenadas()
{
    let numero;

    for(let i = 0; i < n; i++)
    {
        numero = "";

        for(let j = 0; j < coordenadas[i].length; j++)
        {
            if (coordenadas[i][j] != ',')
                numero += coordenadas[i][j];
            else if (coordenadas[i][j] == ',')
            {
                x[i] = new Decimal(numero);
                numero = "";
            }
                
        }
        fx[i] = new Decimal(numero);

        if(parseFloat(x[i]) > xMayor)
            xMayor = parseFloat(x[i]);

        if(parseFloat(x[i]) < xMenor)
            xMenor = parseFloat(x[i]);
    }
}

function CalcularProductivos()
{
    let denominador;
    let numerador;
    ReiniciarMatriz(poli);

    for (let i = 0; i < n; i++)
    {
        denominador = new Decimal(1);
        numerador = "";
        ReiniciarMatriz(coeficientes);
        ReiniciarMatriz(operaciones1);
        ReiniciarMatriz(operaciones2);
        primerValor = true;

        for (let j = 0; j < n; j++)
        {
            if(j != i)
            {
                if (primerValor)
                {
                    coeficientes[0] = x[j].mul(-1);
                    coeficientes[1] = new Decimal(1);
                    primerValor = false;
                }
                else
                {
                    for (let k = 0; k < (n - 1); k++)
                        operaciones1[k + 1] = coeficientes[k];
                    for (let k = 0; k < n; k++)
                    {
                        operaciones2[k] = coeficientes[k].mul(-1);
                        operaciones2[k] = operaciones2[k].mul(x[j]);
                        coeficientes[k] = operaciones1[k].plus(operaciones2[k]);
                    }
                }
                denominador = denominador.mul(x[i].sub(x[j]));
            }
        }

        for (let j = 0; j < n; j++)
            poli[j] = poli[j].plus(coeficientes[j].mul(fx[i]).div(denominador));

        primerValor = true;

        for (let j = (n - 1); j >= 2; j--)
        {
            if (coeficientes[j] > 0 && primerValor)
            {
                if (coeficientes[j] == 1)
                    numerador = "x^" + j;
                else
                    numerador = coeficientes[j] + "x^" + j;
                primerValor = false;
            }
            else
            {
                if(coeficientes[j] > 0)
                {
                    if (coeficientes[j] == 1)
                        numerador += "+x^" + j;
                    else
                        numerador += "+" + coeficientes[j] + "x^" + j;
                }
                else if (coeficientes[j] < 0)
                {
                    if(coeficientes[j] == -1)
                        numerador += "-x^" + j;
                    else
                        numerador += coeficientes[j] + "x^" + j;
                }
            }
        }

        //Termino lineal
        if(coeficientes[1] > 0)
        {
            if (coeficientes[1] == 1)
                numerador += "+x";
            else
                numerador += "+" + coeficientes[1] + "x";
        }
        else if(coeficientes[1] < 0)
        {
            if (coeficientes[1] == -1)
                numerador += "-x";
            else
                numerador += coeficientes[1] + "x";
        }

        //Termino independiente
        if (coeficientes[0] > 0)
            numerador += "+" + coeficientes[0];
        else if(coeficientes[0] < 0)
            numerador += coeficientes[0];

        L[i] = "(" + numerador + ")/" + denominador;
    }
}

function ReiniciarMatriz(matriz)
{
    for(let i = 0; i < n; i++)
        matriz[i] = new Decimal(0);
}

function GenerarPolinomio()
{
    primerValor = true;
    lagrange = "";
    lagrangeRedondeado = "";
    lagrangeSuperIndices = "";

    for (let j = (n - 1); j >= 2; j--)
    {
        if (poli[j] > 0 && primerValor)
        {
            if (poli[j] == 1)
            {
                lagrange = "x^" + j;
                lagrangeRedondeado = "x^" + j;
                lagrangeSuperIndices = `x<sup>${j}</sup>`;
            }
            else
            {
                lagrange = poli[j] + "x^" + j;
                if(poli[j].decimalPlaces() > 4)
                {
                    lagrangeRedondeado = poli[j].toDecimalPlaces(4) + "x^" + j;
                    lagrangeSuperIndices = `${poli[j].toDecimalPlaces(4)}x<sup>${j}</sup>`;
                }
                else
                {
                    lagrangeRedondeado = poli[j] + "x^" + j;
                    lagrangeSuperIndices = `${poli[j]}x<sup>${j}</sup>`;
                }
            }
            primerValor = false;
        }
        else
        {
            if (poli[j] > 0)
            {
                if (poli[j] == 1)
                {
                    lagrange += "+x^" + j;
                    lagrangeRedondeado += "+x^" + j;
                    lagrangeSuperIndices += `+x<sup>${j}</sup>`;
                }
                else
                {
                    lagrange += "+" + poli[j] + "x^" + j;
                    if(poli[j].decimalPlaces() > 4)
                    {
                        lagrangeRedondeado += "+" + poli[j].toFixed(4) + "x^" + j;
                        lagrangeSuperIndices += `+${poli[j].toFixed(4)}x<sup>${j}</sup>`;
                    }
                    else
                    {
                        lagrangeRedondeado += "+" + poli[j] + "x^" + j;
                        lagrangeSuperIndices += `+${poli[j]}x<sup>${j}</sup>`;
                    }
                }
            }
            else if (poli[j] < 0)
            {
                if (poli[j] == -1)
                {
                    lagrange += "-x^" + j;
                    lagrangeRedondeado += "-x^" + j;
                    lagrangeSuperIndices += `-x<sup>${j}</sup>`;
                }
                else
                {
                    lagrange += poli[j] + "x^" + j;
                    if(poli[j].decimalPlaces() > 4)
                    {
                        lagrangeRedondeado += poli[j].toFixed(4) + "x^" + j;
                        lagrangeSuperIndices += `${poli[j].toFixed(4)}-x<sup>${j}</sup>`;
                    }
                    else
                    {
                        lagrangeRedondeado += poli[j] + "x^" + j;
                        lagrangeSuperIndices += `${poli[j]}x<sup>${j}</sup>`;
                    }
                }
            }
        }
    }

    //Termino lineal
    if (poli[1] > 0)
    {
        if (poli[1] == 1)
        {
            lagrange += "+x";
            lagrangeRedondeado += "+x";
            lagrangeSuperIndices += `+x`;
        }
        else
        {
            lagrange += "+" + poli[1] + "x";
            if(poli[1].decimalPlaces() > 4)
            {
                lagrangeRedondeado += "+" + poli[1].toFixed(4) + "x";
                lagrangeSuperIndices += `+${poli[1].toFixed(4)}x`;
            }
            else
            {
                lagrangeRedondeado += "+" + poli[1] + "x";
                lagrangeSuperIndices += `+${poli[1]}x`;
            }
        }
    }
    else if (poli[1] < 0)
    {
        if (poli[1] == -1)
        {
            lagrange += "-x";
            lagrangeRedondeado += "-x";
            lagrangeSuperIndices += `-x`;
        }
        else
        {
            lagrange += poli[1] + "x";
            if(poli[1].decimalPlaces() > 4)
            {
                lagrangeRedondeado += poli[1].toFixed(4) + "x";
                lagrangeSuperIndices += `${poli[1].toFixed(4)}x`;
            }
            else
            {
                lagrangeRedondeado += poli[1] + "x";
                lagrangeSuperIndices += `${poli[1]}x`;
            }
        }
    }

    //Termino independiente
    if (poli[0] > 0)
    {
        lagrange += "+" + poli[0];
        if(poli[0].decimalPlaces() > 4)
        {
            lagrangeRedondeado += "+" + poli[0].toFixed(4);
            lagrangeSuperIndices += `+${poli[0].toFixed(4)}`;
        }
        else
        {
            lagrangeRedondeado += "+" + poli[0];
            lagrangeSuperIndices += `+${poli[0]}`;
        }
    }
    else if (poli[0] < 0)
    {
        lagrange += poli[0];
        if(poli[0].decimalPlaces() > 4)
        {
            lagrangeRedondeado += poli[0].toFixed(4);
            lagrangeSuperIndices += `${poli[0].toFixed(4)}`;
        }
        else
        {
            lagrangeRedondeado += poli[0];
            lagrangeSuperIndices += `${poli[0]}`;
        }
    }
    if (lagrange[0] == '+')
    {
        let aux = "";
        for (let i = 1; i < lagrange.length; i++)
            aux += lagrange[i];
        lagrange = aux;
    }
    else if (lagrange == "")
        lagrange = "0";
    if (lagrangeRedondeado[0] == '+')
    {
        let aux = "";
        for (let i = 1; i < lagrangeRedondeado.length; i++)
            aux += lagrangeRedondeado[i];
        lagrangeRedondeado = aux;
    }
    else if (lagrangeRedondeado == "")
        lagrangeRedondeado = "0";
    if (lagrangeSuperIndices[0] == '+')
    {
        let aux = "";
        for (let i = 1; i < lagrangeSuperIndices.length; i++)
            aux += lagrangeSuperIndices[i];
        lagrangeSuperIndices = aux;
    }
    else if (lagrangeSuperIndices == "")
        lagrangeSuperIndices = "0";

    // lagrange = CorregirEcuacion(lagrange);
    lagrange = lagrange.replace(/x+/g,"*x");
    document.querySelector(`#parrafoResultado`).innerHTML = `Polinomio interpolador: ${lagrangeSuperIndices}`;
}

function CalcularResultado()
{
    let calculadora = new MathCalc();
    let expresion = calculadora.parse(lagrange);

    if (expresion.error)
        alert(`La expresión ${lagrange} tiene un error`);
    else 
    {
        resultado = expresion.eval({
            x: puntoABuscar
        });
        resultado = Math.round(resultado * 100) / 100;
        document.getElementById("txtResultado").value = resultado;
    }
}

function btnLimpiar_Click()
{
    document.getElementById("txtCoordenadas").value = "";
    document.getElementById("txtResultado").value = "";
    document.getElementById("txtPuntoABuscar").value = "";
    document.getElementById("txtCoordenadas").focus();
    habilitarBotones();
    
    for(let i = document.getElementById('tblCoordenadas').getElementsByTagName('tr').length-1; i >= 1; i--)
        document.getElementById("tblCoordenadas").deleteRow(i);

    document.getElementById("btnInterpolar").disabled  = true;
    document.getElementById("btnModificar").disabled  = true;
    document.getElementById("btnBorrar").disabled  = true;
    document.querySelector(`#parrafoResultado`).innerHTML = `Polinomio interpolador:`;
    
    limpiarGrafica();
}

function graficar()
{
    limpiarGrafica();

    let datosCoordenadas = new Array(n);
    let datosPolinomio = new Array();
    let coordenada;
    let res;

    for(let i = 0; i < n ; i++)
    {
        coordenada = {x:x[i], y: fx[i]};
        datosCoordenadas[i] = coordenada;
    }

    for(let i = xMenor-5; i <= parseFloat(xMayor)+5 ; i++)
    {
        let calculadora = new MathCalc();
        let expresion = calculadora.parse(lagrange);

        if (expresion.error)
            alert(`La expresión ${lagrange} tiene un error`);
        else 
        {
            res = expresion.eval({
                x: i
            });
        }

        coordenada = {x:i, y: res};
        datosPolinomio.push(coordenada);
    }

    const totalDuration = 800;
    const delayBetweenPoints = totalDuration / datosPolinomio.length;
    const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
    const animation = {
      x: {
        type: 'number',
        easing: 'linear',
        duration: delayBetweenPoints,
        from: NaN, // the point is initially skipped
        delay(ctx) {
          if (ctx.type !== 'data' || ctx.xStarted) {
            return 0;
          }
          ctx.xStarted = true;
          return ctx.index * delayBetweenPoints;
        }
      },
      y: {
        type: 'number',
        easing: 'linear',
        duration: delayBetweenPoints,
        from: previousY,
        delay(ctx) {
          if (ctx.type !== 'data' || ctx.yStarted) {
            return 0;
          }
          ctx.yStarted = true;
          return ctx.index * delayBetweenPoints;
        }
      }
    };

    const data = {
          datasets: [{
            type: 'scatter',
            label: 'Coordenadas ingresadas',
            data: datosCoordenadas,
            backgroundColor: 'rgb(255, 99, 132)'
          },
          {
            type: 'scatter',
            label: 'Punto a buscar',
            data: [{x: puntoABuscar, y: resultado}],
            backgroundColor: 'rgb(0, 0, 255)'
          },
          {
            type: 'line',
            label: 'Polinomio interpolador',
            data: datosPolinomio,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            pointRadius: 0
          }],
        };

        const config = {
          data: data,
          options: {
            responsive: true,
            animation,
            scales: {
              x: {
                type: 'linear',
                position: 'bottom'
              }
            }
          }
        };

        grafica = new Chart(canva, config);
}

function limpiarGrafica()
{
    if (grafica) 
        grafica.destroy();
}

function txtCoordenadas_KeyPress(evt)
{
    if(window.event)
        keynum = evt.keyCode;
    else
        keynum = evt.which;

    //Enter
    if (keynum == 13)
    {
        if(verificarCoordenadaCorrecta(document.getElementById("txtCoordenadas").value))
            btnAgregar_Click();
    }
    else if(keynum == 44 )
    {
        let hayComa = false;
        let coordenada = document.getElementById("txtCoordenadas").value;

        for(let i = 0; i < coordenada.length; i++)
        {
            if(coordenada[i] == ',')
            {
                hayComa = true;
                break;
            }
        }

        if(hayComa)
            return false;
        else
            return true;
    }
    else if(keynum == 45)
    {
        let hayComa = false;
        let posicionComa;
        let coordenada = document.getElementById("txtCoordenadas").value;
        let posicion = document.getElementById("txtCoordenadas").selectionStart;

        for(let i = 0; i < coordenada.length; i++)
        {
            if(coordenada[i] == ',')
            {
                hayComa = true;
                posicionComa = i;
                break;
            }
        }
        if(hayComa)
        {
            if(posicion == 0 || posicion == posicionComa+1)
                return true;
            else
                return false;
        }
        else
        {
            if(posicion == 0)
                return true;
            else
                return false;
        }
    }
    else if(keynum == 46)
    {
        let hayComa = false;
        let hayPunto = false;
        let posicionComa;
        let coordenada = document.getElementById("txtCoordenadas").value;
        let posicion = document.getElementById("txtCoordenadas").selectionStart;

        for(let i = 0; i < coordenada.length; i++)
        {
            if(coordenada[i] == ',')
            {
                hayComa = true;
                posicionComa = i;
                break;
            }
        }
        if(hayComa)
        {

            if(posicion < posicionComa)
            {
                for(let i = 0; i < posicionComa; i++)
                {
                    if(coordenada[i] == '.')
                    {
                        hayPunto = true;
                        break;
                    }
                }
            }
            else if(posicion > posicionComa)
            {
                for(let i = posicionComa+1; i < coordenada.length; i++)
                {
                    if(coordenada[i] == '.')
                    {
                        hayPunto = true;
                        break;
                    }
                }
            }


            if(hayPunto)
                return false;
            else
                return true;
        }
        else
        {
            for(let i = 0; i < coordenada.length; i++)
            {
                if(coordenada[i] == '.')
                {
                    hayPunto = true;
                    break;
                }
            }

            if(hayPunto)
                return false;
            else
                return true;
        }
    }
    //           Números del 0-9             Borrar            .
    else if(keynum > 47 && keynum < 58 || keynum == 8)
        return true;
    else
    {
        alert("Ingrese solo números");
        return false;
    }
}

function txtPuntoABuscar_KeyPress(evt)
{
    if(window.event)
        keynum = evt.keyCode;
    else
        keynum = evt.which;

    //Enter
    if(keynum == 13)
    {
        if(verificarPuntoABuscar())
            btnInterpolar_Click();
    }
    //Menos (-)
    else if(keynum == 45)
    {
        let posicion = document.getElementById("txtPuntoABuscar").selectionStart;
        let hayMenos = false;
        let puntoABuscar = document.getElementById("txtPuntoABuscar").value;

        for(let i = 0; i < puntoABuscar.length; i++)
        {
            if(puntoABuscar[i] == '-')
            {
                hayMenos = true;
                break;
            }
        }
        if(posicion == 0 && !hayMenos)
            return true;
        else
            return false;
    }
    //Punto
    else if(keynum == 46)
    {
        let puntoABuscar = document.getElementById("txtPuntoABuscar").value;
        let hayPunto = false;

        for(let i = 0; i < puntoABuscar.length; i++)
        {
            if(puntoABuscar[i] == '.')
            {
                hayPunto = true;
                break;
            }
        }
        if(hayPunto)
                return false;
        else
            return true;
    }
    // Números del 0-9                Borrar    
    else if(keynum > 47 && keynum < 58 || keynum == 8)
        return true;
    else
    {
        alert("Solo se permiten números positivos, negativos, enteros o decimales");
        return false;
    }
}

function verificarPuntoABuscar()
{
    let puntosDecimales = 0;
    let signosMenos = 0;
    let puntoABuscar = document.getElementById("txtPuntoABuscar").value;
    if(puntoABuscar == "" || puntoABuscar == "-" || puntoABuscar == "." || puntoABuscar[puntoABuscar.length-1] == "." || puntoABuscar[puntoABuscar.length-1] == "-")
        return false;
    else
    {
        for(let i = 0; i < puntoABuscar.length; i++)
        {
            if(puntoABuscar[i] == '.')
                puntosDecimales++;
            else if(puntoABuscar[i] == '-')
                signosMenos++;
        }
        if(signosMenos > 1 || puntosDecimales > 1)
            return false;
        else
            return true;
    }
}

function verificarCoordenadaCorrecta(coordenada)
{
    let numero1 = false;
    let numero2 = false;
    let puntosJuntos = false;
    let menosJuntos = false;
    let cantidadPuntos = 0;
    let cantidadMenos = 0;
    let cantidadComas = 0;

    for(let i = 0; i < coordenada.length; i++)
    {
        if(coordenada[i] == ',')
        {
            if(coordenada[i-1] == '0' || coordenada[i-1] == '1' || coordenada[i-1] == '2' || coordenada[i-1] == '3' || coordenada[i-1] == '4' || coordenada[i-1] == '5' || coordenada[i-1] == '6' || coordenada[i-1] == '7' || coordenada[i-1] == '8' || coordenada[i-1] == '9')
                numero1 = true;
            if(coordenada[coordenada.length-1] == '0' || coordenada[coordenada.length-1] == '1' || coordenada[coordenada.length-1] == '2' || coordenada[coordenada.length-1] == '3' || coordenada[coordenada.length-1] == '4' || coordenada[coordenada.length-1] == '5' || coordenada[coordenada.length-1] == '6' || coordenada[coordenada.length-1] == '7' || coordenada[coordenada.length-1] == '8' || coordenada[coordenada.length-1] == '9')
                numero2 = true;

            cantidadComas++;
        }
        else if(coordenada[i] == '.')
        {
            if(i > 0)
            {
                if(coordenada[i-1] == '.')
                    puntosJuntos = true;
            }
            cantidadPuntos++;
        }
        else if(coordenada[i] == '-')
        {
            if(i > 0)
            {
                if(coordenada[i-1] == '-')
                    menosJuntos = true;
            }
            cantidadMenos++;
        }
    }

    return numero1 && numero2 && !menosJuntos && !puntosJuntos;
}

function txtCoordenadas_TextChanged(valor)
{
    document.getElementById("btnAgregar").disabled  = !verificarCoordenadaCorrecta(document.getElementById("txtCoordenadas").value);
}

function txtPuntoABuscar_TextChanged(valor)
{
    n = document.getElementById('tblCoordenadas').getElementsByTagName('tr').length - 1;
    document.getElementById("btnInterpolar").disabled  = !verificarPuntoABuscar() && n >= 2;
}