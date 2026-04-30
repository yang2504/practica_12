import { useState, useEffect } from 'react';

export default function ContadoresHUD() {
  const [colisiones, setColisiones] = useState(0);
  const [tiempo, setTiempo] = useState(0);
  const [juegoIniciado, setJuegoIniciado] = useState(false);
  const [juegoTerminado, setJuegoTerminado] = useState(false);

  useEffect(() => {
    let intervalo;
    if (juegoIniciado && !juegoTerminado) {
      intervalo = setInterval(() => {
        setTiempo((t) => t + 0.1);
      }, 100);
    }
    return () => clearInterval(intervalo);
  }, [juegoIniciado, juegoTerminado]);

  const manejarChoque = () => {
    if (juegoIniciado && !juegoTerminado) setColisiones((c) => c + 1);
  };

  const iniciarJuego = () => {
    setColisiones(0);
    setTiempo(0);
    setJuegoTerminado(false);
    setJuegoIniciado(true);
  };

  return (
    <div style={estilos.contenedorPrincipal}>
      <div style={estilos.hud}>
        <h2 style={{ margin: '0 0 10px 0' }}>Juego de la Rana 🐸</h2>
        <p>Tiempo: <strong>{tiempo.toFixed(1)} s</strong></p>
        <p>Choques: <strong style={{ color: '#ff4757' }}>{colisiones}</strong></p>
        {juegoTerminado && <h3 style={{ color: '#2ed573' }}>¡Meta Alcanzada!</h3>}
      </div>

      <div style={estilos.panelPruebas}>
        <h3>Controles de Prueba</h3>
        {!juegoIniciado || juegoTerminado ? (
          <button onClick={iniciarJuego} style={estilos.boton}>Iniciar Partida</button>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={manejarChoque} style={{...estilos.boton, backgroundColor: '#ff4757'}}>💥 Chocar</button>
            <button onClick={() => setJuegoTerminado(true)} style={{...estilos.boton, backgroundColor: '#2ed573'}}>🏁 Meta</button>
          </div>
        )}
      </div>
    </div>
  );
}

const estilos = {
  contenedorPrincipal: {
    position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
    pointerEvents: 'none', display: 'flex', flexDirection: 'column',
    alignItems: 'center', padding: '20px', boxSizing: 'border-box'
  },
  hud: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)', padding: '20px', borderRadius: '12px',
    color: 'white', textAlign: 'center', minWidth: '200px',
  },
  panelPruebas: {
    marginTop: 'auto', backgroundColor: '#2f3542', padding: '20px',
    borderRadius: '12px', pointerEvents: 'auto', color: 'white'
  },
  boton: {
    padding: '10px 15px', border: 'none', borderRadius: '6px', cursor: 'pointer',
    fontWeight: 'bold', color: 'white', backgroundColor: '#1e90ff'
  }
};