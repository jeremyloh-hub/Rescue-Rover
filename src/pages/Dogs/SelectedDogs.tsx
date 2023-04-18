import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Dog } from "../../type";

export default function SelectedDogs() {
  const [dogs, setDogs] = useState<Dog | null>(null);
  const { dogName } = useParams<{ dogName: string }>();

  useEffect(() => {
    fetch(`/api/dogs/${dogName}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data: Dog) => {
        setDogs(data);
      })
      .catch((error) => console.error(error));
  }, [dogName]);

  return (
    <>
      {dogs && (
        <div>
          <label>{dogs.name}</label>
          <img src={dogs.imgurl} alt={dogs.name} />
        </div>
      )}
    </>
  );
}
