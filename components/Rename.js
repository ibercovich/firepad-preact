function RenameInput({ currentRef, setCurrentRef }) {
  const [name, setName] = useState(currentRef.key);
  const timeoutId = useRef(); //timeouts require refs
  const nameRef = useRef(name); //using ref to avoid issue with race-condition/closure

  useEffect(() => {
    nameRef.current = name;
  }, [name]); // <= Update ref whenever name changes

  useEffect(() => {
    setName(currentRef.key);
  }, [currentRef]); // <== if parent component changes prop, update

  const handleChange = (event) => {
    clearTimeout(timeoutId.current);
    const value = event.target.value
      .trim()
      .replace(/[^A-Za-z0-9]/g, "_")
      .toLowerCase();
    setName(value);
    timeoutId.current = setTimeout(handleSubmit, 2000);
  };

  const handleSubmit = () => {
    //use nameRef to avoid closure issues
    if (!handleRename(nameRef.current)) {
      setName(currentRef.key);
    }
  };

  const handleRename = (newRefName) => {
    if (currentRef.key && newRefName) {
      const ref = firebase.database().ref();
      const newRef = ref.child(newRefName);

      // Check if newRef already exists
      newRef.once("value", (snapshot) => {
        if (snapshot.exists()) {
          console.error("Error: A reference with the new name already exists.");
        } else {
          // Proceed with renaming since newRef does not exist
          currentRef.once("value", (snapshot) => {
            newRef.set(snapshot.val(), (error) => {
              if (!error) {
                currentRef.remove(); // Delete old ref
                setCurrentRef(newRef); // Update the currentRef
                return true;
              } else {
                console.error("Error updating name:", error);
              }
            });
          });
        }
      });
    } else {
      console.log("No ref selected or new name not provided");
    }
    return false;
  };

  return html` <div class="field">
    <div class="control">
      <input
        class="input"
        onChange="${handleChange}"
        value="${name}"
        type="text"
        placeholder="Doc Name"
      />
    </div>
  </div>`;
}

export default RenameInput;
