import {auth} from "../../utils/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {db} from "../../utils/firebase";
import {collection, getDocs} from "firebase/firestore";
import BinCard from "../../components/BinCard";

const Projects = () => {
  const [user, loading] = useAuthState(auth);
  const route = useRouter();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    (async () => {
      const notesCollection = collection(db, "notes");
      const notesSnapshot = await getDocs(notesCollection);
      const docs = notesSnapshot.docs.map((doc) => {
        const data = doc.data();
        data.id = doc.id;
        return data;
      });
      setProjects(docs);
      console.log(docs);
    })();
  }, []);

  if (loading) return <h1>Loading...</h1>;
  if (!user) route.push("/auth/login");
  if (user)
    return (
      <div className="projectsBG">
        <h2>This is the projects page</h2>
        <div className="projectsBin">
          {projects.map((project) => (
            <BinCard
              key={project.id}
              name={project.Name}
              color={project.Color}
              id={project.id}
            />
          ))}
        </div>
      </div>
    );
};

export default Projects;
