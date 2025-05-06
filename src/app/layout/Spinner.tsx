import { observer } from "mobx-react-lite";
import { store } from "../../lib/stores/store";
import HashLoader from "react-spinners/HashLoader";

const Spinner = observer(() => {
    if (!store.uiStore.isLoading) return null;

    return (
        <div className="spinner-overlay">
            <HashLoader
                color="#fff"
                size={50}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
            <h4 className="text-white pt-2 fw-bold">ChatZ</h4>
        </div>
    );
});

export default Spinner;