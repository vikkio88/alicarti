type SnackbarType = "info" | "identify" | "error";
type Snackbar = {
  message: string;
  type: SnackbarType;
};

class UiState {
  #snackbar: Snackbar | undefined = $state(undefined);

  get snackbar() {
    return this.#snackbar;
  }
  snackMessage(message: string, timeoutSeconds = 2) {
    if (this.#snackbar) {
      return;
    }
    this.#snackbar = { message, type: "info" };

    setTimeout(() => (this.#snackbar = undefined), timeoutSeconds * 1000);
  }
}

export const uiState = new UiState();
