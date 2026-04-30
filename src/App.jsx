import ContadoresHUD from './ui/ContadoresHUD';
import './App.css';

function App() {
  return (
    <>
      <div style={{ width: '100vw', height: '100vh', backgroundColor: '#576574' }}>
        {/* Aquí luego irá el Canvas 3D de tus compañeros */}
      </div>

      {/* Tu interfaz superpuesta */}
      <ContadoresHUD />
    </>
  );
}

export default App;