import { useState } from 'react';
import ContadoresHUD from './ui/ContadoresHUD';
import Escena from './3d/Escena';

function App() {
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
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      
      {/* Capa 3D al fondo */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <Escena 
          juegoIniciado={juegoIniciado} 
          juegoTerminado={juegoTerminado} 
          manejarChoque={manejarChoque}
          llegarMeta={() => setJuegoTerminado(true)}
        />
      </div>

      {/* Interfaz de Usuario por encima */}
      <ContadoresHUD 
        juegoIniciado={juegoIniciado}
        juegoTerminado={juegoTerminado}
        colisiones={colisiones}
        iniciarJuego={iniciarJuego}
      />
      
    </div>
  );
}

export default App;