//todo| 2C = Two of Clubs (Tréboles)  
//todo| 2D = Two of Diamonds (Picas)
//todo| 2H = Two of Hearts  (Corazones)
//todo| 2S = Two of Spades (Espadas)


const miModulo = (() => {
    'use strict';

    //? Variables y const
    let deck               = [],

        numeroJug          = 2,

        turn               = 0,
            
    //? Referencias HTML
        boton              = document.querySelectorAll('button'),  

        divCartasJugadores = document.querySelectorAll('.divCartas'),

        marcador           = document.querySelectorAll('small'),

        puntosJugadores,

        divJug             = document.querySelector('#players'),

        h3 = document.querySelectorAll('h3')
    ;

    //? Eventos
    const iniciarJuego = ( numJugadores = numeroJug) => {
        deck = crearDeck();

        puntosJugadores = Array(numJugadores).fill(0);
    };

    const crearDeck = () => ( deck = ( _.shuffle(['C', 'D', 'H', 'S'].map(tipo => '123456789AJQK'.split('').map(v => (Number(v) + 1 || v) + tipo)).reduce((p, n) => p + ',' + n).split(',')) ) );

    const pedirCarta = () => ( (deck.length === 0) ? console.warn('No hay cartas en el deck') : (deck.pop()) );

    const valorCarta = c => (isNaN( (c.slice(0, -1)) ) ? ( (c.slice(0, -1)) === 'A' ? 11 : 10 ) : ( (c.slice(0, -1)) * 1 ));
    
    // Turno: 0 -> primer jugador; último - computadora
    const nuevoJugador = () => {
        numeroJug++;

        (numeroJug >= 5) && (boton[4].disabled = true);

        iniciarJuego(numeroJug);

        const newJug        = document.createElement('div');
        newJug.classList    = 'col container';
        newJug.id           = 'NewJUG';
        divJug.append(newJug);
        
        const jugador       = document.createElement('h3');
        jugador.innerHTML   = 'J' + ( numeroJug-1 ) + ' - ';
        jugador.classList   = 'col';
        newJug.append(jugador);

        const pointsJug     = document.createElement('small');
        pointsJug.innerText = puntosJugadores[numeroJug-1];
        jugador.append(pointsJug);
        
        const cartasJug     = document.createElement('div');
        cartasJug.classList = 'divCartas';
        cartasJug.id        = 'jugador-cartas';
        jugador.append(cartasJug);
        
        marcador = document.querySelectorAll('small');
        h3 = document.querySelectorAll('h3');

    };
    
    const acumularPuntos = ( carta, turno ) => {
        const valor = valorCarta(carta)
        
        puntosJugadores[turno]    = puntosJugadores[turno] + ( ((valor === 11) && (puntosJugadores[turno] > 10)) ? 1 : valor );
        
        marcador[turno].innerText = puntosJugadores[turno];

        return puntosJugadores[turno];
    };

    const cartaIMG = ( turno ) => {
        const carta        = pedirCarta();
        const imagen       = document.createElement('img');
        divCartasJugadores = document.querySelectorAll('.divCartas');

        imagen.className   = 'carta'; //todo/también vale "imagen.classList.add('carta')"
        imagen.src         = `./assets/cartas/${carta}.png`;     
        divCartasJugadores[turno].append(imagen);

        return carta;
    };
    
    const turnoJugadores = ( turno ) => {
        h3[turno].style.stroke = 'blue'; 

        const carta = cartaIMG(turno);
        const puntosJ = acumularPuntos( carta, turno ); //todo/ así mantengo constante el resultado de ese llamado y no lo llamo de nuevo, además de simplificar mi código

        (( (puntosJ > 21) || (puntosJ === 21) ) && ( pasoTurno(turno + 1) ));
        ((puntosJugadores[turno] >= 21) && (boton[1].disabled = true) );
    };

    const pasoTurno = (turno) => {
        ((numeroJug - 1) === turno ) && (cambioYJuego( Math.max(...(puntosJugadores.filter((v, i) => (v <= 21) && (i < puntosJugadores.length - 1) ))) ));
    }; 
    
    const turnoComputadora = ( puntosMinimos ) => {
        
        let puntosC = 0;
        
        do { //todo/ por lo menos tengo que hacer esto una vez
            
            const carta = cartaIMG( puntosJugadores.length - 1 );
            puntosC = acumularPuntos( carta, puntosJugadores.length - 1 );
            
        } while ( ( puntosMinimos <= 21 ) && (puntosC < puntosMinimos) );
        
        determinarGanador(puntosMinimos);
    };    
    
    const cambioYJuego = (puntos) => { //! habilito o deshabilito los botones / false -> habilitado
        boton[1].disabled ? boton[1].disabled = false : boton[1].disabled = true; 
        boton[2].disabled ? boton[2].disabled = false : boton[2].disabled = true;
        
        turnoComputadora(puntos);
    };
    
    const determinarGanador = (puntosMax) => {
        let puntosC = puntosJugadores[puntosJugadores.length-1];
        // console.log(puntosJugadores.map((v,i) => ((puntosC > 21) || ((v <= 21) && (v > puntosC))) && i ));
        const ganadores = puntosJugadores.map((v,i) => ((puntosC > 21) || ((v <= 21) && (v > puntosC))) && v );
        console.log(ganadores);
        const ganador = Math.max(...(puntosJugadores.filter((v, i) => (v <= 21) && (i < puntosJugadores.length - 1) )))

        setTimeout(() => {

            ((puntosMax === puntosC) 
            ? ( alert('Nadie gana' ))
            : (( puntosC <= 21 && puntosMax < puntosC ) || (puntosMax > 21) )
            ? ( alert('Losiento mucho, has perdido' ))
            : ( alert( 'Ha ganado' )));
            
        }, 100 ); //!/ así aparece el alert después de que aparezca la puntuación y la carta
    };
    
    //? Eventos DOM

    boton[0].addEventListener( 'click', () => {
    // Nuevo juego  
    
        [3,4].map(v => boton[v].disabled = false);
        
        iniciarJuego();
        
        turn = 0;   
        marcador.forEach((point) => { point.innerText = 0 });
        divCartasJugadores.forEach(v => v.innerHTML = ''); //! Así vaciamos un elemnto del HTML (div de imagenes)
        boton.forEach(v => v.disabled = false);

        h3.forEach( v => v.style.color = 'white' );
        h3[turn].style.color = 'blue';
        // [marcador, divCartasJugadores, boton].forEach((v, i) => ((i === 0) && ( v.forEach(x => x.innerText = 0) ) ) || ( (i === 1) && ( v.forEach(x => x.innerHTML = '') ) ) || ( (i === 2) && ( v.forEach(x => x.disabled = false) )) );
        
        console.clear(); //! Así limpiamos la consola    
    } );
    
    boton[1].addEventListener( 'click', () => {
        // Pedir Carta
        
        [3,4].map(v => boton[v].disabled = true);
        //todo/ las funciones como tal no devueven constantes, revuelven valores, si quieres meter ese valor en una constante:

        turnoJugadores(turn);
    });

    boton[2].addEventListener( 'click', () => {
    // Detener
        turn++;

        boton[1].disabled = false;

        h3[turn - 1].style.color = 'white';
        h3[turn].style.color     = 'blue';  

        ( ((numeroJug - 2) >= turn ) ? pasoTurno(turn) : (cambioYJuego( Math.max(...(puntosJugadores.filter((v, i) => (v <= 21) && (i < puntosJugadores.length - 1) )))) ));    
    } );

    boton[3].addEventListener( 'click', () => {
    // Eliminar Jugador
        let multiP = document.querySelectorAll('#NewJUG');       

        multiP[multiP.length - 1].remove(); //! Así elimino un elemnto del DOM

        ( numeroJug > 2 && (numeroJug = (numeroJug - 1)) );
    } );
    
    boton[4].addEventListener( 'click', () => {
    // Nuevo Jugador

        nuevoJugador();
    } );

    return {
        nuevoJuego: iniciarJuego,
    };

})();
