import { useState, useEffect } from 'react';

export default function ContadoresHUD({ 
  juegoIniciado, 
  juegoTerminado, 
  colisiones, 
  iniciarJuego
}) {
  const [tiempo, setTiempo] = useState(0);

  useEffect(() => {
    let intervalo;
    if (juegoIniciado && !juegoTerminado) {
      intervalo = setInterval(() => setTiempo((t) => t + 0.1), 100);
    } else if (!juegoIniciado) {
      setTiempo(0);
    }
    return () => clearInterval(intervalo);
  }, [juegoIniciado, juegoTerminado]);

  return (
    <div style={estilos.contenedorPrincipal}>
      <div style={estilos.hud}>
        <h2 style={{ margin: '0 0 10px 0' }}>Juego de la Rana 🐸</h2>
        <p>Tiempo: <strong>{tiempo.toFixed(1)} s</strong></p>
        <p>Choques: <strong style={{ color: '#ff4757' }}>{colisiones}</strong></p>
        {juegoTerminado && <h3 style={{ color: '#2ed573' }}>¡Meta Alcanzada!</h3>}
      </div>

      {/* Solo mostramos el panel si el juego NO ha iniciado o ya terminó */}
      {(!juegoIniciado || juegoTerminado) && (
        <div style={estilos.panelPruebas}>
          <button onClick={iniciarJuego} style={estilos.boton}>
            {juegoTerminado ? "Jugar de Nuevo" : "Iniciar Partida"}
          </button>
        </div>
      )}
    </div>
  );
}

const estilos = {
  contenedorPrincipal: {
    position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
    pointerEvents: 'none', // IMPORTANTE: Deja pasar los clicks al 3D
    display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', boxSizing: 'border-box'
  },
  hud: { backgroundColor: 'rgba(0, 0, 0, 0.8)', padding: '20px', borderRadius: '12px', color: 'white', textAlign: 'center', minWidth: '200px' },
  panelPruebas: { marginTop: 'auto', backgroundColor: '#2f3542', padding: '20px', borderRadius: '12px', pointerEvents: 'auto' },
  boton: { padding: '10px 20px', fontSize: '1.2rem', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', color: 'white', backgroundColor: '#1e90ff' }
};