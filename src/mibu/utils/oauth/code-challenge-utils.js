// ie 11.x uses msCrypto
export const getCrypto = () => window.crypto || (window).msCrypto;

export const getCryptoSubtle = () => {
  const crypto = getCrypto();
  // safari 10.x uses webkitSubtle
  return crypto.subtle || crypto.webkitSubtle;
};

export const createRandomString = () => {
  const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_~.";
  let random = "";
  const randomValues = Array.from(getCrypto().getRandomValues(new Uint8Array(43)));

  randomValues.forEach((v) => {
    random += charset[v % charset.length];
  });

  return random;
};

export const encode = (value) => btoa(value);
export const decode = (value) => atob(value);

export const createQueryParams = (params) => Object.keys(params)
  .filter((k) => typeof params[k] !== "undefined")
  .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
  .join("&");

export const sha256 = async (s) => {
  const digestOp = getCryptoSubtle().digest({ name: "SHA-256" }, new TextEncoder().encode(s));

  // msCrypto (IE11) uses the old spec, which is not Promise based
  // https://msdn.microsoft.com/en-us/expression/dn904640(v=vs.71)
  // Instead of returning a promise, it returns a CryptoOperation
  // with a result property in it.
  // As a result, the various events need to be handled in the event that we're
  // working in IE11 (hence the msCrypto check). These events just call resolve
  // or reject depending on their intention.
  if (window.msCrypto) {
    return new Promise((res, rej) => {
      digestOp.oncomplete = (e) => {
        res(e.target.result);
      };

      digestOp.onerror = (e) => {
        rej(e.error);
      };

      digestOp.onabort = () => {
        rej(new Error("The digest operation was aborted"));
      };
    });
  }

  return digestOp;
};

const urlEncodeB64 = (input) => {
  const b64Chars = { "+": "-", "/": "_", "=": "" };
  return input.replace(/[+/=]/g, (m) => b64Chars[m]);
};

// https://stackoverflow.com/questions/30106476/
const decodeB64 = (input) => decodeURIComponent(
  atob(input)
    .split("")
    .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
    .join(""),
);

export const urlDecodeB64 = (input) => decodeB64(input.replace(/_/g, "/").replace(/-/g, "+"));

export const bufferToBase64UrlEncoded = (input) => {
  const ie11SafeInput = new Uint8Array(input);
  return urlEncodeB64(
    window.btoa(String.fromCharCode(...Array.from(ie11SafeInput))),
  );
};

export const validateCrypto = () => {
  if (!getCrypto()) {
    throw new Error(
      "For security reasons, `window.crypto` is required to run `auth0-spa-js`.",
    );
  }
  if (typeof getCryptoSubtle() === "undefined") {
    throw new Error(`
      auth0-spa-js must run on a secure origin.
    `);
  }
};
