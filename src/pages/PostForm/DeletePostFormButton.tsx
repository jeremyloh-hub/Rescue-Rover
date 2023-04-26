import type { PostFormDeleteProps } from "../../type";
import { Button } from "@mui/material";
export default function ProductsDeleteButton({
  id,
  delPostForm,
}: PostFormDeleteProps) {
  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`/api/dogs/${id}/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    await response.json();
    delPostForm(id);
  };

  return (
    <Button variant="contained" onClick={handleDelete}>
      Delete
    </Button>
  );
}
