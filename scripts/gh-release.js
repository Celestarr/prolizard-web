const axios = require("axios").default;
const { version: PROJECT_VERSION } = require("../package.json");

const {
  GITHUB_API_URL,
  GITHUB_REPOSITORY,
  GH_ACCESS_TOKEN: GITHUB_ACCESS_TOKEN,
} = process.env;
const PROJECT_NAME = GITHUB_REPOSITORY.split("/").pop();
const DEFAULT_HEADERS = {
  Authorization: `token ${GITHUB_ACCESS_TOKEN}`,
};

async function releaseExists() {
  const apiPath = `/repos/${GITHUB_REPOSITORY}/releases/tags/v${PROJECT_VERSION}`;
  const url = new URL(apiPath, GITHUB_API_URL).href;

  try {
    await axios.get(url, { headers: DEFAULT_HEADERS });
    return true;
  } catch (err) {
    return false;
  }
}

async function release() {
  const exists = await releaseExists();

  if (!exists) {
    const body = {
      tag_name: `v${PROJECT_VERSION}`,
      target_commitish: "master",
      name: `${PROJECT_NAME} ${PROJECT_VERSION}`,
      draft: false,
      body: "O_O",
      prerelease: PROJECT_VERSION.includes("pre"),
    };

    const apiPath = `/repos/${GITHUB_REPOSITORY}/releases`;
    const url = new URL(apiPath, GITHUB_API_URL).href;

    await axios.post(url, body, { headers: DEFAULT_HEADERS });
  }
}

release();
