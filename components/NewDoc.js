function NewDoc({ getRef }) {
  const [name, setName] = useState(null);
  const timeoutId = useRef(); //timeouts require refs
  const nameRef = useRef(name); //using ref to avoid issue with race-condition/closure

  useEffect(() => {
    nameRef.current = name;
  }, [name]); // <= Update ref whenever name changes


  const handleSubmit = () => {
    //use nameRef to avoid closure issues
    getRef(null, true);
  };

  return html` <button
    class="button is-success"
    onClick="${handleSubmit}"
  >
    New
  </button>`;
}

export default NewDoc;
