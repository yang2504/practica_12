import { useState } from 'react';
import ContadoresHUD from './ui/ContadoresHUD';
import Escena from './3d/Escena';
import './App.css';

function App() {
  // Los estados maestros del juego ahora viven aquí
  const [juegoIniciado, setJuegoIniciado] = useState(false);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [colisiones, setColisiones] = useState(0);

  const manejarChoque = () => {
    if (juegoIniciado && !juegoTerminado) setColisiones((c) => c + 1);
  };

  const iniciarJuego = () => {
    setColisiones(0);
    setJuegoTerminado(false);
    setJuegoIniciado(true);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      
      {/* 1. Capa 3D: Le pasamos los estados y las funciones */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <Escena 
          juegoIniciado={juegoIniciado} 
          juegoTerminado={juegoTerminado} 
          manejarChoque={manejarChoque}
          llegarMeta={() => setJuegoTerminado(true)}
        />
      </div>

      {/* 2. Capa UI: Le pasamos los estados y funciones de control */}
      <ContadoresHUD 
        juegoIniciado={juegoIniciado}
        juegoTerminado={juegoTerminado}
        colisiones={colisiones}
        iniciarJuego={iniciarJuego}
        manejarChoque={manejarChoque}
        llegarMeta={() => setJuegoTerminado(true)}
      />
      
    </div>
  );
}

export default App;