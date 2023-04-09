import Register from "./components/Register";
import "./App.css";
import AppHeader from "./components/AppHeader";
import SideMenu from "./components/SideMenu";
import Content from "./components/PageContent";
import AppFooter from "./components/AppFooter";

function App() {
  const access_token = localStorage.getItem("access_token");

  return (
    <div className="App">
      {access_token ? (
        <>
          <AppHeader />
          <div className="SideMenuAndPageContent">
            <SideMenu />
            <Content />
          </div>
          <AppFooter />
        </>
      ) : (
        <Register />
      )}
    </div>
  );
}

export default App;
