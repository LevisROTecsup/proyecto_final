import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useClient } from "../../../context/adminContext";

function DashboardView() {

  const client = useClient();
  const [thesis, setThesis] = useState([]);

  const handleThesis = async () => {
    try {

      const response = await client("admin/thesis");
      setThesis(response.thesis)

    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    handleThesis();
  }, []);

  const handleDeleteServer = async (thesisId) => {
    await client(`admin/thesis/${thesisId}/delete`, { method: "DELETE" })
    let currentThesis = thesis.filter((el) => el._id !== thesisId);

    setThesis(currentThesis)
  }

  const handleDelete = (thesisId) => {
    handleDeleteServer(thesisId)
  }

  return (
    <>
      <h3 className="text-2xl font-bold mb-4">Tesis existentes</h3>
      <div className="overflow-x-auto w-full relative shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3 px-6">
                Título
              </th>
              <th scope="col" className="py-3 px-6">
                Tema
              </th>
              <th scope="col" className="py-3 px-6">
                Contenidos
              </th>
              <th scope="col" className="py-3 px-6">
                Tipo
              </th>
              <th scope="col" className="py-3 px-6">
                <span className="sr-only">Opciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {
              thesis && thesis.map(
                (element, index) => <tr key={`thesisadmin-${element._id}-${index}`} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {element.title}
                  </th>
                  <td className="py-4 px-6">
                    {element.theme}
                  </td>
                  <td className="py-4 px-6 flex flex-wrap">
                    {
                      element.contents.map((content, index) => <p key={`content-${element._id}-${index}`} className="ml-1 rounded-2xl border bg-neutral-100 px-3 py-1 text-xs font-semibold mb-1">{content}</p>)
                    }
                  </td>
                  <td className="py-4 px-6" width={100}>
                    {element.type === "PUBLIC" ? "Público" : "Privado"}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link to={`/admin/${element._id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Editar</Link>
                    <button type="button" className="ml-3 font-medium text-red-600 dark:text-red-500 hover:underline" onClick={() => handleDelete(element._id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </>
  )
}

export default DashboardView;
