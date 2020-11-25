import Component from "vue-class-component";
import BaseComponent from "./components/BaseComponent";
import BaseApp from "./components/App";
import AppLayout from "./AppLayout";

@Component({
  name: "App",
})
class App extends BaseComponent<{}> {
  route = location.pathname;

  changeRoute(route: string) {
    history.pushState(null, "Title", route);
    this.route = route;
  }

  render() {
    return (
      <BaseApp
        defaultLocale="de_DE"
        currentPath={this.route}
        devMode
        handleRouteChange={console.log}
        components={{
          appLayout: AppLayout,
        }}
      />
    );
    /**return (
      <Page
        currentPath={this.route}
        devMode
        defaultLocale="en_GB"
        locales={["de_DE", "en_GB"]}
        handleRouteChange={route => {
          if (route) this.changeRoute(route);
        }}
      />
    );**/
  }
}
export default App;
