import { Extension } from "@tiptap/core";

export interface ReflectMarkerKeyboardOptions {
  onOpenPicker: () => void;
  onClosePicker: () => void;
  isPickerOpen: () => boolean;
}

export const ReflectMarkerKeyboard = Extension.create<ReflectMarkerKeyboardOptions>({
  name: "reflectMarkerKeyboard",

  addOptions() {
    return {
      onOpenPicker: () => {},
      onClosePicker: () => {},
      isPickerOpen: () => false,
    };
  },

  addKeyboardShortcuts() {
    return {
      "Mod-ArrowUp": () => {
        const { from, to, empty } = this.editor.state.selection;
        if (empty || from === to) {
          return false;
        }

        this.options.onOpenPicker();
        return true;
      },
      Escape: () => {
        if (!this.options.isPickerOpen()) {
          return false;
        }

        this.options.onClosePicker();
        return true;
      },
    };
  },
});
