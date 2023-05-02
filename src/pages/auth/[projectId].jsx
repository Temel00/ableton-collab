import {auth} from "../../../utils/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import React, {useEffect, useState, useRef} from "react";
import {useRouter} from "next/router";
import {db, storage_bucket} from "../../../utils/firebase";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
} from "firebase/storage";
import ReactAudioPlayer from "react-audio-player";

const ProjectPage = () => {
  const [user, loading] = useAuthState(auth);
  const [projectData, setProjectData] = useState({});
  const projectRef = doc(db, "notes", "" + projectData.Name);

  const downloadFolder = (name) => {
    const folderRef = ref(storage_bucket, "" + name);
    listAll(folderRef)
      .then((res) => {
        res.prefixes.forEach((foldRef) => {
          console.log("Folder: " + foldRef);

          listAll(foldRef).then((r) => {
            r.items.forEach((iRef) => {
              console.log("Item: " + iRef);
              getDownloadURL(iRef)
                .then((url) => {
                  console.log("Item URL: " + url);
                })
                .catch((error) => {
                  console.log(error);
                });
            });
          });
        });
        res.items.forEach((itemRef) => {
          console.log("Item: " + itemRef);
          getDownloadURL(itemRef)
            .then((url) => {
              console.log("Item URL: " + url);
            })
            .catch((error) => {
              console.log(error);
            });
        });
      })
      .catch((error) => {
        console.log(error);
      });
    console.log("Download attempted: " + name);
  };

  const uploadFile = (e) => {
    let length = e.target.files.length;
    let fileIter = 0;
    // let projpath = e.target.files[0].webkitRelativePath;
    // const projname = projpath.split("/", 1);

    setDoc(projectRef, {
      Name: projectData.Name,
      User: user.uid,
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
        }
      );
    }
  };

  const uploadAudio = (e) => {
    let file = e.target.files[0];
    console.log("file name: " + file.name);
    let fileRef = ref(storage_bucket, file.name);

    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done.");
      },
      (error) => {
        alert(error);
      },
      () => {
        console.log("Audio uploaded successfully");
        getDownloadURL(fileRef)
          .then((url) => {
            console.log("Item URL: " + url);
            setDoc(
              projectRef,
              {
                AudioURL: url,
              },
              {merge: true}
            );
          })
          .catch((error) => {
            console.log(error);
          });
      }
    );
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
  if (loading) return <h1>Loading...</h1>;
  if (!user) route.push("/auth/login");
  if (user)
    return (
      <div className="ProjectPage">
        <div className="ProjHead">
          <h1>{projectData.Name}</h1>
          <h3> by {projectData.User}</h3>
        </div>
        <label htmlFor="audio-upload" className="custom-audio-upload">
          Upload Audio
        </label>
        <input
          id="audio-upload"
          type="file"
          accept=".wav,.mp3"
          onChange={uploadAudio}
        />
        <ReactAudioPlayer
          className="audio-player"
          src={projectData.AudioURL}
          controls
        />
        <button
          onClick={() => {
            downloadFolder(projectData.Name);
          }}
        >
          Download
        </button>
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

export default ProjectPage;
