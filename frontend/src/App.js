import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Chat from "./pages/Chat";
import Register from "./pages/Register";
import {ChatState} from './context/Chatcontext';
import { useEffect } from "react";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <Navbar/>
        <Home />
      </div>
    ),
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path:'/chat',
    element:<Chat/>
  }
]);

function App() {
  // const navigate  = useNavigate();
  
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
