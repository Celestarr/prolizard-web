import { currentUserSelector } from "mibu/reducers/selectors";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";

// import { handleUserPreferencesUpdate, updateUserData } from "store/user/actions";
import View from "./View";

const mapStateToProps = (state) => ({
  user: currentUserSelector(state),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  // onUpdateUserData: updateUserData,
  // onUserPreferencesUpdate: handleUserPreferencesUpdate,
}, dispatch);

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
);

export default enhance(View);
