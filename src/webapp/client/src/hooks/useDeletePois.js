// hooks/useDeletePois.js
import { useState } from "react";
import URI from "./uri.js";

export const useDeletePois = () => {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const deletePois = async (selectedPois) => {
    if (!selectedPois || selectedPois.size === 0) return;
    
    try {
      setDeleteLoading(true);
      setDeleteError(null);

      const response = await fetch(`${URI}/api/app/deletePois`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: Array.from(selectedPois) }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (err) {
      setDeleteError(err.message);
      return false;
    } finally {
      setDeleteLoading(false);
    }
  };

  return { deletePois, deleteLoading, deleteError };
};
