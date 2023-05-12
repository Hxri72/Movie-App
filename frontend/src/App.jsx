import { BrowserRouter,Route,Routes } from "react-router-dom";
import Home from "./pages/home";
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path="/" element={<Home/>}/>  
        </Routes>   
      </BrowserRouter>
    </>
  );
}

export default App;
