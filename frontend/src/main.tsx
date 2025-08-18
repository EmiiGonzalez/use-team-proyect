import { render } from "preact";
import AppRouter from "./router";
import { AppProvider } from "./app";
import "./global.css"

render(
	<AppProvider>
		<AppRouter />
	</AppProvider>,
	document.getElementById("app")!
);
