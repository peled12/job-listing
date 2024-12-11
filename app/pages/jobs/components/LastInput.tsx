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
  return (
    <div className="checkboxes-container">
      <div className="checkboxes">
        <div className="checkbox">
          <input
            type="checkbox"
            className="cursor-pointer"
            checked={inputs.show_hidden}
            onChange={(e) => handleChangeHidden(e.target.checked as boolean)}
          />
          <h3>Show Hidden</h3>
        </div>
        <div className="checkbox">
          <input
            type="checkbox"
            className="cursor-pointer"
            checked={inputs.only_show_favorites}
            onChange={(e) => handleChangeFavorite(e.target.checked as boolean)}
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
