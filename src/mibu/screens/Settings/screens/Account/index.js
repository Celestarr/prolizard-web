import { syncCurrentUserData } from "mibu/actions/user";
import { currentUserSelector } from "mibu/reducers/selectors";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";

import View from "./View";

const mapStateToProps = (state) => ({
  user: currentUserSelector(state),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  syncCurrentUserData,
}, dispatch);

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
);

export default enhance(View);
