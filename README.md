# firepad-preact
An implementation of firepad using preact. No npm, no transpiler. Just &lt;script> tags.

I've had many ideas that involve collaborative editing, and I prefer pure javascript applications that don't require npm/etc. This is an easy starting point to bootstrap collaborative projects using pract, firepad, and firebase.

Just open index.html

## components
- Editor: the firepad editor
- File Viewer: ability to open and delete files, currently assumes all files are on the firebase root
- New Doc: create doc from scratch when the URL has an empty hash or when using the button
- Rename: ability to change the name of the current doc
- SingInOut: ability to authenticate via firebase auth


## firebase config
- Modify config.js to add your key, auth-domain, and database url
- Make sure you have a realtime database enabled
- Modify realtime db rules to only allow certain users.
- To figure out the user_id, log in once into the application and then find it in the auth console.



```
{
  "rules": {
    // Grant access to user you@your_org.com=your_user_id
    // ...
    ".read": "auth != null && (auth.uid === 'your_user_id' || auth.uid === 'another_user_id')",
    ".write": "auth != null && (auth.uid === 'your_user_id' || auth.uid === 'another_user_id')"
  }
}
```
