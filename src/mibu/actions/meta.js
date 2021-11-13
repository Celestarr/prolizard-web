import APIService from "mibu/services/api";

const RETRIEVE_METADATA_REQUESTED = "@meta/retrieve/requested";
const RETRIEVE_METADATA_FAILED = "@meta/retrieve/failed";
const RETRIEVE_METADATA_SUCCEEDED = "@meta/retrieve/succeeded";

export const metaActions = {
  RETRIEVE_METADATA_REQUESTED,
  RETRIEVE_METADATA_FAILED,
  RETRIEVE_METADATA_SUCCEEDED,
};

export const onRetrieveMetadataRequest = () => ({
  type: RETRIEVE_METADATA_REQUESTED,
});

export const onRetrieveMetadataFailure = (err) => ({
  type: RETRIEVE_METADATA_FAILED,
  payload: { err },
});

export const onRetrieveMetadataSuccess = (data) => ({
  type: RETRIEVE_METADATA_SUCCEEDED,
  payload: { data },
});

export const retrieveMetadata = () => (dispatch) => {
  dispatch(onRetrieveMetadataRequest());

  APIService.Common.retrieveMetadata()
    .then((res) => {
      dispatch(onRetrieveMetadataSuccess(res));
    })
    .catch((err) => {
      dispatch(onRetrieveMetadataFailure(err));
    });
};
