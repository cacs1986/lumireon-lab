import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    
    <div className="flex min-h-screen flex-col bg-bone text-carbon overflow-x-hidden">
      
      <Header />
  
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        <Outlet />
      </main>

      <Footer/>

    </div>
  );
}