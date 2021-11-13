const axios = require("axios").default;
const { version } = require("../../package.json");

const headers = {
  Authorization: `token ${process.env.GH_ACCESS_TOKEN}`,
};

async function releaseExists() {
  try {
    await axios.get(
      `https://api.github.com/repos/myfolab/mibu/releases/tags/v${version}`,
      { headers },
    );
    return true;
  } catch (err) {
    return false;
  }
}

async function release() {
  const exists = await releaseExists();

  if (!exists) {
    const body = {
      tag_name: `v${version}`,
      target_commitish: "master",
      name: `mibu ${version}`,
      draft: false,
      body: "O_O",
      prerelease: version.includes("pre"),
    };

    await axios.post(
      "https://api.github.com/repos/myfolab/mibu/releases",
      body,
      { headers },
    );
  }
}

release();
