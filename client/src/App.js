import './css/main.css'
import { createBrowserHistory } from "history";
import { Router, Switch } from "react-router-dom";
import HomeTemplates from './templates/HomeTemplates/HomeTemplates';
import Home from './pages/Home/Home';
import Info from './pages/Info/Info';
import AdminTemplates from './templates/AdminTemplates/AdminTemplates';
import Admin from './pages/Admin/Admin';
import Genre from './pages/Genre/Genres';
import Country from './pages/Country/Country';
import ReleaseYear from './pages/ReleaseYear/ReleaseYear';
import PhimLe from './pages/PhimLe/PhimLe';
import PhimBo from './pages/PhimBo/PhimBo';
import Watch from './pages/Watch/Watch';
export const history = createBrowserHistory();

function App() {
  return (
    <Router history={history}>
      <Switch>
        <HomeTemplates path="/phim" exact Component={Home} />
        <AdminTemplates path="/admin" exact Component={Admin} />
        <HomeTemplates path="/info/:name"  Component={Info} />
        <HomeTemplates path="/the-loai/:category" Component={Genre} />
        <HomeTemplates path="/phim-le" Component={PhimLe} />
        <HomeTemplates path="/phim-bo" Component={PhimBo} />
        <HomeTemplates path="/quoc-gia/:country" Component={Country} />
        <HomeTemplates path="/nam-phat-hanh/:year" Component={ReleaseYear} />
        <HomeTemplates path="/phim-chieu-rap" Component={Genre} />
        <HomeTemplates path="/xem-phim/:name" Component={Watch} />

        <HomeTemplates path="/" exact Component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
