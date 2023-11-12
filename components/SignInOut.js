function SignInOut({user, setUser}) {
  const auth = firebase.auth();

  const signIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  const signOut = () => auth.signOut();

  useEffect(() => {
    auth.onAuthStateChanged(setUser);
  }, []);

  return html` <div class="field">
    <div class="control">
      ${user
        ? html` <button class="button is-danger is-small" onClick=${signOut}>
            Sign Out ${user.email}
          </button>`
        : html` <button class="button is-success is-small" onClick=${signIn}>
            Sign In with Google
          </button>`}
    </div>
  </div>`;
}
export default SignInOut;
