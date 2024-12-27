import { InputProps } from "../../types";

const LastInput = ({
  inputs,
  handleChangeHidden,
  handleChangeFavorite,
  resetFiltering,
}: {
  inputs: InputProps;
  handleChangeHidden: (newValue: boolean) => void;
  handleChangeFavorite: (newValue: boolean) => void;
  resetFiltering: () => Promise<void>;
}) => {
  const handleInput = (newValue: boolean, type: string): void => {
    if (!document.querySelector(".main-loader")?.classList.contains("hide")) {
      // if the loader is still running, don't do anything
      alert("Please wait for the current action to finish.");
      return;
    }

    switch (type) {
      case "show_hidden":
        handleChangeHidden(newValue);
        break;
      case "only_show_favorites":
        handleChangeFavorite(newValue);
        break;
    }
  };

  return (
    <div className="checkboxes-container">
      <div className="checkboxes">
        <div className="checkbox">
          <input
            type="checkbox"
            className="cursor-pointer"
            checked={inputs.show_hidden}
            onChange={(e) =>
              handleInput(e.target.checked as boolean, "show_hidden")
            }
          />
          <h3>Show Hidden</h3>
        </div>
        <div className="checkbox">
          <input
            type="checkbox"
            className="cursor-pointer"
            checked={inputs.only_show_favorites}
            onChange={(e) =>
              handleInput(e.target.checked as boolean, "only_show_favorites")
            }
          />
          <h3>Only Show Favorites</h3>
        </div>
      </div>
      <button onClick={resetFiltering} className="reset-btn">
        Reset
      </button>
    </div>
  );
};

export default LastInput;
