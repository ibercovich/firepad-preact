const FileViewer = ({ getRef, currentRef }) => {
  const [children, setChildren] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState(currentRef.key);
  const [searchTerm, setSearchTerm] = useState(null);
  const firebaseRef = firebase.database().ref();

  useEffect(() => {
    const fetchData = async () => {
      if (isModalOpen) {
        setLoading(true);
        try {
          const snapshot = await firebaseRef.once("value");
          const data = snapshot.val();
          if (data) {
            const sortedKeys = Object.keys(data).sort((a, b) =>
              a.toLowerCase().localeCompare(b.toLowerCase())
            );
            setChildren(sortedKeys);
          }
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [firebaseRef, isModalOpen]);

  const selectRefChild = (childKey) => {
    setSelectedChild(childKey);
    getRef(childKey);
  };

  const handleSearchDocs = (event) => {
    setSearchTerm(event.target.value);
  };

  const matchSearch = (child) => {
    if (!searchTerm || searchTerm.trim() === "") return true;
    return child.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
    setSearchTerm(null);
  };

  const toggleDelete = () => {
    setDeleteOpen(!isDeleteOpen);
  };

  const submitDelete = () => {
    handleDelete(selectedChild);
    toggleDelete();
    toggleModal();
  };

  const handleDelete = (deleteRefName) => {
    const ref = firebase.database().ref();
    const deleteRef = ref.child(deleteRefName);
    deleteRef.remove(); // Delete old ref
    getRef("new_doc"); //open new doc
  };

  return html`
    <button class="button is-info" onClick=${toggleModal}>
      Open
    </button>

    <div class="modal ${isModalOpen ? " is-active" : ""}">
      <div class="modal-background" onClick=${toggleModal}></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Open Document</p>
          <button
            class="delete"
            aria-label="close"
            onClick=${toggleModal}
          ></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <div class="control">
              <input
                class="input"
                type="text"
                onChange="${handleSearchDocs}"
                placeholder="Search Doc"
                value=${searchTerm}
              />
            </div>
          </div>
          ${isLoading
            ? html` <p>Loading...</p> `
            : html`
                <div class="buttons are-small">
                  ${children.map((child) =>
                    matchSearch(child)
                      ? html`
                          <button
                            onClick=${() => selectRefChild(child)}
                            class="button  ${selectedChild === child
                              ? "is-light is-primary"
                              : ""}"
                          >
                            ${child}
                          </button>
                        `
                      : null
                  )}
                </div>
              `}
        </section>
        <footer class="modal-card-foot">
          <button onClick=${toggleModal} class="button is-success">Open</button>
          <button onClick=${toggleDelete} class="button is-light is-danger">
            Delete
          </button>
          <button
            onClick=${submitDelete}
            class="button is-danger"
            style=" ${isDeleteOpen ? "" : "display: none;"} "
          >
            Actully Delete
          </button>
        </footer>
      </div>
    </div>
  `;
};

export default FileViewer;
