import {Provider, useSelector} from "react-redux";
import reduxStore from "./Data/reduxStore.js";
import AppLayout from "./Components/AppLayout.jsx";

function App() {

    return (
        <Provider store={reduxStore}>
            <AppLayout />
        </Provider>
    )
}

export default App;