import * as React from "react";
import {useEffect, useState} from "react";
import {db} from "../utils/firebase";
import {collection, getDocs} from "firebase/firestore";
import {BinCard} from "./BinCard";

const Bins = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async () => {
      const notesCollection = collection(db, "notes");
      const notesSnapshot = await getDocs(notesCollection);
      const notes = notesSnapshot.notes.map((doc) => {
        const data = doc.data();
        data.id = doc.id;
        return data;
      });
      console.log(notes);
      setProjects(notes);
    };
  }, []);

  return (
    <div>
      {projects.map((project) => (
        <BinCard key={project.id} {...project} />
      ))}
    </div>
  );
};

export default Bins;
