import React from "react";
import Link from "next/link";

const BinCard = ({name, color, collab, id}) => {
  const handleDelete = async () => {};

  return (
    <Link className="BinCard" href={"/auth/" + id}>
      <h3>Name: {name}</h3>
      <h3>Color: {color}</h3>
      <h3>Id: {id}</h3>
    </Link>
  );
};

export default BinCard;
