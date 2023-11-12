import Config from "./config.js";
import Editor from "./components/Editor.js";
import RenameInput from "./components/Rename.js";
import FileViewer from "./components/FileViewer.js";
import NewDoc from "./components/NewDoc.js";
import SignInOut from "./components/SignInOut.js";

const App = () => {
  const [currentRef, setCurrentRef] = useState("");
  const [user, setUser] = useState(null);
  const [firepad, setFirepad] = useState(null);

  //helper function to retrieve ref
  const getRef = (refName, make) => {
    //get ref pointer from firebase
    var ref = firebase.database().ref();

    // check if function was called with a specific refName
    if (typeof refName === "string" && refName.length > 0) {
      refName = decodeURIComponent(refName);
      ref = ref.child(refName);
    } else {
      // get the hash of the URL or create new ref
      if (make) {
        ref = ref.push(); //make new
      } else {
        var hash = window.location.hash.replace(/#/g, "");
        hash = decodeURIComponent(hash);
        hash = hash ? hash : "new_doc"; //either use hash or go to root
        ref = ref.child(hash);
      }
    }
    setCurrentRef(ref);
  };

  // Initialize Firebase before anything else
  if (!firebase.apps.length) {
    firebase.initializeApp(Config.firebase);
    getRef();
  }

  useEffect(() => {
    const hash = currentRef.key;
    window.location = window.location.href.split("#")[0] + "#" + hash;
  }, [currentRef]);

  return html`
    <div class="container">
      <div class="columns">
        <div class="column is-2">
          <div class="block"></div>
          <div class="block">
            <p>ScOp Dope Notes</p>
            <${SignInOut} user=${user} setUser=${setUser} />
          </div>
          ${user
            ? html`
                <${RenameInput}
                  currentRef=${currentRef}
                  setCurrentRef=${setCurrentRef}
                />
                <div class="buttons">
                  <${FileViewer} currentRef=${currentRef} getRef=${getRef} />
                  <${NewDoc} getRef=${getRef} />
                </div>
              `
            : ""}
        </div>
        <div class="column">
          <div class="">
            <main>
              <${Editor}
                user=${user}
                currentRef=${currentRef}
                setFirepad=${setFirepad}
              />
            </main>
          </div>
        </div>
      </div>
    </div>
  `;
};

// // footer
// <div class="container">
// <div class="block">
//   <div class="content has-text-centered">Sponsored by ScOp VC</div>
// </div>
// </div>

export default App;
render(html`<${App} />`, document.getElementById("app"));
