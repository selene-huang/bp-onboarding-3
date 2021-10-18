// index.tsx
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import firebase from "../firebase/clientApp";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from 'next/router';

export default function Home() {
  const db = firebase.firestore();
  const router = useRouter();
  // Destructure user, loading, and error out of the hook.  
  const [user, loading, error] = useAuthState(firebase.auth());
  // console.log the current user and loading status
 console.log("Loading:", loading, "|", "Current user:", user);

const [votes, votesLoading, votesError] = useCollection(
  firebase.firestore().collection("votes"),
  {}
);

const addVoteDocument = async (vote: string) => {
  if (user == null) {
    router.push("/auth")
  } else {
    await db.collection("votes").doc(user.uid).set({
      vote,
    });
  }
};

if (!votesLoading && votes) {
  votes.docs.map((doc) => console.log(doc.data()));
}


return (
  <div
    style={{
      display: "flex",
      height: "100vh",
      width: "100vw",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gridGap: 8,
      background: "linear-gradient(to top, #ebc0fd 0%, #d9ded8 100%)"
    }}>
    <h1>How should cereal be eaten?</h1>
    <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
      <div style={{ flexDirection: "row", display: "flex" }}>
        <button
          style={{ fontSize: 32, margin: 8, background: "black" }}
          onClick={() => addVoteDocument("cerealmilk")}>
            🥣🥛🥄
        </button>
        <h3>
          Cereal first, then milk:{" "}
          {
            votes?.docs?.filter(
              (doc) => doc.data().vote === "cerealmilk"
            ).length
          }
        </h3>
      </div>
      <div style={{ flexDirection: "row", display: "flex" }}>
        <button
          style={{ fontSize: 32, margin: 8, background: "black" }}
          onClick={() => addVoteDocument("milkcereal")}>
            🥛🥣🥄
        </button>
        <h3>
          Milk first, then cereal:{" "}
          {
            votes?.docs?.filter(
              (doc) => doc.data().vote === "milkcereal"
            ).length
          }
        </h3>
      </div>
      <div style={{ flexDirection: "row", display: "flex" }}>
        <button
          style={{ fontSize: 32, margin: 8, paddingLeft: 43, paddingRight: 43, background: "black" }}
          onClick={() => addVoteDocument("dry")}>
            🥣
        </button>
        <h3>
          Cereal should be eaten dry: {" "}
          {
            votes?.docs?.filter(
              (doc) => doc.data().vote === "dry"
            ).length
          }
        </h3>
      </div>
    </div>
  </div>
);
}
