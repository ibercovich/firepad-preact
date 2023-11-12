import Config from "../config.js";

function Editor({ currentRef, user, setFirepad }) {
  useEffect(() => {
    const initializeEditor = (firepadRef) => {
      if (user) {
        const userId = user.email.replace(/[^A-Za-z0-9]/g, "_");
        const firepadContainer = document.getElementById("firepad-container");
        firepadContainer.innerHTML = ""; // Clear the container

        // Create CodeMirror (with lineWrapping on).
        var codeMirror = CodeMirror(
          document.getElementById("firepad-container"),
          {
            lineWrapping: true,
          }
        );

        // Create Firepad (with rich text toolbar and shortcuts enabled).
        var firepad = Firepad.fromCodeMirror(firepadRef, codeMirror, {
          richTextToolbar: true,
          richTextShortcuts: true,
          userId: userId,
        });

        // Initialize contents.
        firepad.on("ready", function () {
          if (firepad.isHistoryEmpty()) {
            console.log("loading content");
            firepad.setHtml(Config.template);
          }
          setFirepad(firepad); //passing firepad to parent component
        });
      }
    };

    initializeEditor(currentRef);
  }, [currentRef, user]);

  return html`<div id="firepad-container" />`;
}

export default Editor;
