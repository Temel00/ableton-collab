import React, {useEffect, useState, useRef} from "react";
import {useRouter} from "next/router";
import {db, storage_bucket} from "../../../utils/firebase";
import {doc, getDoc} from "firebase/firestore";
import {ref, uploadBytesResumable} from "firebase/storage";
import {fileURLToPath} from "url";

const ProjectPage = () => {
  const [projectData, setProjectData] = useState({});

  const uploadFile = (e) => {
    let length = e.target.files.length;

    for (let i = 0; i < length; i++) {
      let file = e.target.files[i];
      console.log("file path: " + file.webkitRelativePath);
      console.log("file name: " + file.name);

      // console.log("file: " + file.name);
      let fileRef = ref(storage_bucket, file.webkitRelativePath);

      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on("state_changed", (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done.");
      });
    }
  };

  const {
    query: {projectId},
  } = useRouter();
  useEffect(() => {
    (async () => {
      if (!projectId) return false;

      const docRef = doc(db, "notes", projectId);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        setProjectData(data);
        console.log(data);
      } else {
        console.log("no data");
      }
    })();
  }, [projectId]);

  // const {name, color, id} = projectData;

  return (
    <div className="ProjectPage">
      <h1>{projectData.Name}</h1>
      <h1>{projectData.Color}</h1>
      <input
        directory=""
        webkitdirectory=""
        type="file"
        onChange={uploadFile}
      />
    </div>
  );
};

export default ProjectPage;
