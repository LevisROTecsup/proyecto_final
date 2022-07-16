import { useEffect, useState } from "react";
import { useAuth, useClient } from "../../../context/authContext";

import { CardComponent } from "../../../components";

function HomeView() {

  const client = useClient();
  const { user } = useAuth();
  const [thesis, setThesis] = useState([]);
  const [search, setSearch] = useState([]);
  const [searchThesis, setSearchThesis] = useState([]);

  const handleThesisServer = async () => {
    try {

      const response = await client("user/thesis");
      setThesis(response.thesis)

    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleSearchServer = async () => {

    try {

      const response = await client(`user/thesis/search?q=${search}`);
      setSearchThesis(response.thesis);

    } catch (error) {
      console.log("Error", error);
    }
  }

  useEffect(() => {
    handleThesisServer();
  }, []);

  useEffect(() => {
    handleSearchServer();
  }, [search]);

  const handleChangeSearch = (e) => {
    setSearch(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    handleSearchServer()
  }

  return (
    <>
      <div className="mb-6">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-end">
            <input
              placeholder="Busque por titulo, tema, contenido, palabras claves o autores"
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              onChange={handleChangeSearch}
              type="text"
            />
          </div>
        </form>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {
          searchThesis.length > 0
            ? searchThesis.map(
              (element, index) => {

                let userReview = element.reviews.find((review) => review.user === user?.code);

                return (
                  <CardComponent
                    {...element}
                    userCurrentRating={userReview}
                    key={`thesis-${index}`}
                  />
                )
              }
            )
            :
            thesis && thesis.map(
              (element, index) => {

                let userReview = element.reviews.find((review) => review.user === user?.code);

                return (
                  <CardComponent
                    {...element}
                    userCurrentRating={userReview}
                    key={`thesis-${index}`}
                  />
                )
              }
            )
        }
      </div>
    </>
  )
}

export default HomeView;
