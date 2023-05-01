import Nav from "./Nav";

export Layout = ({children}) => {
  <div>
    <Nav />
    <main>{children}</main>
  </div>;
}
