import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Rating } from "@mui/material";

import { es } from "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

import { useAuth, useClient } from "../../context/authContext";

dayjs.locale("es");
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

const Card = ({
  _id,
  title,
  theme,
  contents,
  key_words,
  authors,
  type,
  file,
  ratings,
  published_at,
  userCurrentRating
}) => {

  const { user } = useAuth();
  const client = useClient();

  const [currentRating, setCurrentRating] = useState(ratings)
  const [myCurrentRating, setMyCurrentRating] = useState(0)

  useEffect(() => {
    const value = userCurrentRating ? userCurrentRating.rating : 0;
    setMyCurrentRating(value);
  }, []);

  const handleDownloadServer = async () => {
    try {

      let response = await client(`user/thesis/${file.uuid}/download`);

      const linkSource = `data:${file.mimetype};base64,${response.file}`;
      const downloadLink = document.createElement("a");

      downloadLink.href = linkSource;
      downloadLink.download = file.uuid;
      downloadLink.click();

    } catch (error) {
      console.log("Error", error);
    }
  }

  const handleSetRatingServer = async (newRate) => {
    try {

      const response = await client(`user/thesis/${_id}/review`, { data: { rate: newRate ?? 0 }, headers: { "Content-Type": "application/json" } });
      setCurrentRating(response.rating)

    } catch (error) {
      console.log("Error", error);
    }
  }

  const handleDownloadFile = (e) => {
    handleDownloadServer()
  }

  const handleChangeRating = (event, newValue) => {
    setMyCurrentRating(newValue);
    handleSetRatingServer(newValue);
  }

  return (
    <>
      <div className="rounded-xl border p-5 shadow-md bg-white">
        <div className="flex w-full items-center justify-between border-b pb-3">
          <div className="flex items-center space-x-3">
            <Rating
              readOnly
              name="size-medium"
              value={currentRating} />
          </div>
          <div className="flex items-center space-x-8">
            <button type="button" onClick={handleDownloadFile}>
              <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                width="15pt" height="15pt" viewBox="0 0 1280.000000 1280.000000"
                preserveAspectRatio="xMidYMid meet">
                <g transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)"
                  fill="#000000" stroke="none">
                  <path d="M2479 12009 c-87 -13 -312 -66 -397 -95 -284 -94 -596 -324 -786
                    -578 -177 -236 -246 -384 -311 -666 -19 -80 -39 -189 -44 -242 -15 -133 -15
                    -7896 -1 -8022 24 -209 99 -472 179 -630 105 -206 294 -437 466 -571 230 -179
                    389 -258 654 -325 258 -65 -91 -60 4296 -60 4372 0 4031 -5 4290 59 230 57
                    372 121 569 259 234 164 428 390 556 647 92 185 158 422 180 647 7 69 10 1412
                    7 4058 -3 3717 -4 3960 -20 4040 -73 350 -141 521 -304 752 -104 149 -224 273
                    -364 377 -217 163 -371 237 -609 297 -279 69 80 64 -4320 63 -2192 -1 -4010
                    -5 -4041 -10z m7354 -1429 c260 -30 537 -213 677 -448 57 -97 107 -225 120
                    -307 7 -49 10 -1075 8 -3425 l-3 -3355 -29 -75 c-102 -269 -258 -450 -481
                    -560 -123 -60 -177 -78 -274 -91 -50 -6 -1237 -9 -3401 -7 l-3325 3 -104 37
                    c-304 109 -510 316 -618 623 l-28 80 0 3390 0 3390 23 70 c57 169 135 295 254
                    411 91 89 164 140 272 189 101 45 166 65 244 75 103 12 6560 12 6665 0z"/>
                  <path d="M5286 9079 l-26 -20 0 -1405 0 -1404 -648 0 c-733 0 -696 4 -690 -73
                    l3 -42 360 -249 c198 -136 736 -508 1195 -825 l835 -576 -1197 -5 c-1158 -5
                    -1197 -6 -1217 -24 -21 -19 -21 -26 -21 -343 0 -310 1 -324 20 -343 20 -20 33
                    -20 2638 -20 l2619 0 19 21 c18 20 19 43 22 318 3 305 -2 361 -36 377 -9 5
                    -545 11 -1191 14 l-1175 5 645 445 c1548 1068 1741 1203 1749 1226 12 30 -2
                    69 -29 83 -13 8 -229 11 -665 11 l-646 0 0 1404 0 1405 -26 20 c-27 21 -27 21
                    -1269 21 -1242 0 -1242 0 -1269 -21z"/>
                </g>
              </svg>
            </button>
            <p className="rounded-2xl border bg-neutral-100 px-3 py-1 text-xs font-semibold">{type === "PUBLIC" ? "Público" : "Privado"}</p>
            <div className="text-xs text-neutral-500">{dayjs(published_at).fromNow()}</div>
          </div>
        </div>
        <div className="mt-4 mb-6">
          <div className="mb-3 text-xl font-bold">{title}</div>
          <div className="text-sm text-neutral-600 mb-3"><b>Tema de investigacion</b>: {theme}</div>
          <div className="text-sm text-neutral-600 mb-3 flex flex-wrap">
            <b>Contenidos</b>: {
              contents.map((content, index) => <p key={`content-${_id}-${index}`} className="ml-3 rounded-2xl border bg-neutral-100 px-3 py-1 text-xs font-semibold mb-1">{content}</p>)
            }
          </div>
          <div className="text-sm text-neutral-600 mb-3 flex flex-wrap">
            <b>Palabras clave</b>: {
              key_words.map((key, index) => <p key={`keyword-${_id}-${index}`} className="ml-3 rounded-2xl border bg-neutral-100 px-3 py-1 text-xs font-semibold mb-1">{key}</p>)
            }
          </div>
          <div className="text-sm text-neutral-600 mb-3 flex flex-wrap"><b>Autor(es)</b>: {
            authors.map((author, index) => <p key={`author-${_id}-${index}`} className="ml-3 rounded-2xl border bg-neutral-100 px-3 py-1 text-xs font-semibold mb-1">{author}</p>)
          }
          </div>
          {
            user && <div className="text-sm text-neutral-600 mb-3 flex flex-wrap">
              <b>Puntuar</b>:
              <Rating
                className="ml-4"
                size="small"
                name="size-small"
                onChange={handleChangeRating}
                value={myCurrentRating} />
            </div>
          }
        </div>
      </div>
    </>
  );
};

export default Card;
