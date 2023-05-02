import {onAuthStateChanged} from "react-firebase-hooks/auth";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {db, storage_bucket, auth} from "../../utils/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  setDoc,
  doc,
} from "firebase/firestore";
import {ref, uploadBytesResumable} from "firebase/storage";
import BinCard from "../../components/BinCard";

const Projects = () => {
  const route = useRouter();

  const [projects, setProjects] = useState([]);

  const uploadFile = (e) => {
    let length = e.target.files.length;
    let fileIter = 0;
    let projpath = e.target.files[0].webkitRelativePath;
    const projname = projpath.split("/", 1);
    const projectRef = doc(db, "notes", "" + projname);

    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const uid = user.uid;
        // console.log("uid: " + uid);
        setDoc(projectRef, {
          Name: projname,
          User: uid,
        });
      } else {
        route.push("/auth/login");
      }
    });

    for (let i = 0; i < length; i++) {
      let file = e.target.files[i];
      console.log("file path: " + file.webkitRelativePath);
      console.log("file name: " + file.name);

      let fileRef = ref(storage_bucket, file.webkitRelativePath);

      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log("Upload is " + progress + "% done.");
        },
        (error) => {
          alert(error);
        },
        () => {
          fileIter++;
          const progIter = fileIter / length;
          console.log("Full directory upload is " + progIter + "% done.");
          route.reload();
        }
      );
    }
  };

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const uid = user.uid;
        // console.log("uid: " + uid);
        const notesCollection = collection(db, "notes");
        const q = query(notesCollection, where("User", "==", uid));
        const notesSnapshot = await getDocs(q);
        const docs = notesSnapshot.docs.map((doc) => {
          const data = doc.data();
          data.id = doc.id;
          return data;
        });
        setProjects(docs);
        console.log(docs);
      } else {
        route.push("/auth/login");
      }
    })();
  }, []);

  return (
    <div className="projectsBG">
      <h2>This is the projects page</h2>
      <div className="projectsBin">
        {projects.map((project) => (
          <BinCard
            key={project.id}
            name={project.Name}
            audio={project.audioURL}
            id={project.id}
          />
        ))}
      </div>
      <label htmlFor="file-upload" className="custom-file-upload">
        Upload Project
      </label>
      <input
        id="file-upload"
        directory=""
        webkitdirectory=""
        type="file"
        onChange={uploadFile}
      />
    </div>
  );
};

export default Projects;
