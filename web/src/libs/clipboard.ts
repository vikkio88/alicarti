const successCb = () => {
  console.log(`Copied to the clipboard`);
};
const failureCb = () => {
  console.error("Could not copy to clipboard");
};

export function copyToClipboard(
  text: string,
  success: () => void = successCb,
  fail: () => void = failureCb
) {
  navigator.clipboard.writeText(text).then(success, fail);
}
