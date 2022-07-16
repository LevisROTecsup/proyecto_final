import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from 'react-select/creatable'
import { useParams } from "react-router-dom";
import { yupResolver } from '@hookform/resolvers/yup';

import { useClient } from "../../../context/adminContext";
import { thesisUpdateFileValidator, thesisUpdateValidator } from "../../../utils/validations/thesisValidator";

const defaultValues = {
  title: "",
  theme: "",
  type: false,
  contents: [],
  key_words: [],
  authors: [],
  file: null
};

const defaultFileValues = {
  file: null
}

function UpdateThesisView() {

  const client = useClient();
  const { thesisId } = useParams()

  const [thesis, setThesis] = useState(null);
  const [selectInfo, setSelectInfo] = useState({ contents: [], keyWords: [], authors: [] });

  const { register, control, setValue, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(thesisUpdateValidator),
    defaultValues
  });

  const { register: registerFile, handleSubmit: handleFileSubmit, formState: { errors: errorsFile }, reset: resetFile } = useForm({
    resolver: yupResolver(thesisUpdateFileValidator),
    defaultValues: defaultFileValues
  });

  const handleThesisServer = async () => {
    try {

      const { thesis } = await client(`admin/thesis/${thesisId}/show`);

      const keyWords = thesis.key_words.map(key => ({ label: key, value: key }))
      const authors = thesis.authors.map(author => ({ label: author, value: author }))
      const contents = thesis.contents.map(content => ({ label: content, value: content }))

      const newThesisForm = { ...thesis, type: thesis.type === "PUBLIC" ? false : true }

      setThesis(newThesisForm);
      setSelectInfo({ contents, authors, keyWords })

    } catch (error) {
      console.log("Error", error);
    }
  }

  useEffect(() => {

    handleThesisServer()

  }, [thesisId])

  useEffect(() => {
    reset(thesis)
  }, [thesis])


  const handleChangeContent = (
    newValue,
    actionMeta
  ) => {
    let contents = newValue.map(item => item.value)
    setValue("contents", contents)
  };

  const handleChangeKeyWord = (
    newValue,
    actionMeta
  ) => {
    let contents = newValue.map(item => item.value)
    setValue("key_words", contents)
  };

  const handleChangeAuthor = (
    newValue,
    actionMeta
  ) => {
    let contents = newValue.map(item => item.value)
    setValue("authors", contents)
  };

  const handleSubmitServer = async (formData) => {

    try {

      await client(`admin/thesis/${thesisId}/update`, {
        data: formData,
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        }
      })

    } catch (error) {
      console.log("Error", error);
    }
  }

  const handleUpdateFileServer = async (formData) => {

    try {

      const { file } = await client(`admin/thesis/${thesisId}/update-file`, { data: formData })
      setThesis({ ...thesis, file });

    } catch (error) {
      console.log("Error", error);
    }
  }

  const handleDownloadServer = async () => {
    try {

      let response = await client(`user/thesis/${thesis.file.uuid}/download`);

      const linkSource = `data:${thesis.file.mimetype};base64,${response.file}`;
      const downloadLink = document.createElement("a");

      downloadLink.href = linkSource;
      downloadLink.download = thesis.file.uuid;
      downloadLink.click();

    } catch (error) {
      console.log("Error", error);
    }
  }

  const onSubmit = data => {
    const formData = {
      ...data,
      type: data.type ? "PRIVATE" : "PUBLIC",
      contents: JSON.stringify(data.contents),
      key_words: JSON.stringify(data.key_words),
      authors: JSON.stringify(data.authors)
    }

    handleSubmitServer(formData);
  };

  const onFileSubmit = data => {
    const formData = new FormData();
    formData.append("file", data.file[0])

    handleUpdateFileServer(formData);
  };

  const handleDonwloadFile = () => {
    handleDownloadServer()
  }

  return (
    <>
      <div>
        <div className="p-4">
          <h2 className="text-slate-900 font-bold text-2xl mb-5">Editando tesis</h2>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="mb-6">
                <label
                  htmlFor="title"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Titulo
                </label>
                <input
                  type="text"
                  id="title"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Mi tesis"
                  {...register("title")}
                />
                {
                  errors.title &&
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {errors.title?.message}
                  </p>
                }
              </div>
              <div className="mb-6">
                <label
                  htmlFor="theme"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Tema
                </label>
                <input
                  type="text"
                  id="theme"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="IA"
                  {...register("theme")}
                />
                {
                  errors.theme &&
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {errors.theme?.message}
                  </p>
                }
              </div>
              <div className="mb-6">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Contenidos
                </label>
                <Controller
                  control={control}
                  name="contents"
                  render={({ field }) => {
                    const valueFormat = field.value?.map((value => ({ label: value, value })));

                    return (
                      <Select
                        isMulti
                        value={valueFormat}
                        onChange={handleChangeContent}
                        options={selectInfo.contents}
                      />
                    );
                  }}
                />
                {
                  errors.contents &&
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {errors.contents?.message}
                  </p>
                }
              </div>
              <div className="mb-6">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Palabras clave
                </label>
                <Controller
                  control={control}
                  name="key_words"
                  render={({ field }) => {
                    const valueFormat = field.value?.map((value => ({ label: value, value })));

                    return (
                      <Select
                        isMulti
                        value={valueFormat}
                        onChange={handleChangeKeyWord}
                        options={selectInfo.keyWords}
                      />
                    );
                  }}
                />
                {
                  errors.key_words &&
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {errors.key_words?.message}
                  </p>
                }
              </div>
              <div className="mb-6">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Autores
                </label>
                <Controller
                  control={control}
                  name="authors"
                  render={({ field }) => {
                    const valueFormat = field.value?.map((value => ({ label: value, value })));

                    return (
                      <Select
                        isMulti
                        value={valueFormat}
                        onChange={handleChangeAuthor}
                        options={selectInfo.authors}
                      />
                    );
                  }}
                />
                {
                  errors.authors &&
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {errors.authors?.message}
                  </p>
                }
              </div>
            </div>
            <div className="mb-6">
              <label
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Estado de la tesis
              </label>
              <label
                htmlFor="type"
                className="inline-flex relative items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  value=""
                  id="type"
                  className="sr-only peer"
                  {...register("type")}
                />
                <div
                  className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span
                  className="ml-3 text-sm font-medium text-gray-900"
                >
                  Privada
                </span>
              </label>
              {
                errors.type &&
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                  {errors.type?.message}
                </p>
              }
            </div>
            <button
              type="submit"
              className="text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              Editar
            </button>
          </form>
          <br />
          <hr />
          <br />
          <form onSubmit={handleFileSubmit(onFileSubmit)} noValidate>
            <div className="flex items-start mb-6 cursor-pointer" onClick={handleDonwloadFile}>
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width={40} height={40} viewBox="0 0 1000 1000" enableBackground="new 0 0 1000 1000" xmlSpace="preserve">
                <g><g><path d="M888.4,229.2c-21.3-29-50.9-62.9-83.4-95.4c-32.5-32.5-66.4-62.2-95.4-83.4c-49.4-36.2-73.3-40.4-87-40.4H147.8c-42.2,0-76.6,34.3-76.6,76.6v826.9c0,42.2,34.3,76.6,76.6,76.6h704.4c42.2,0,76.6-34.3,76.6-76.6V316.3C928.8,302.5,924.6,278.6,888.4,229.2z M761.6,177.1c29.4,29.4,52.4,55.9,69.5,77.9H683.8V107.7C705.7,124.7,732.3,147.7,761.6,177.1L761.6,177.1z M867.5,913.4c0,8.3-7,15.3-15.3,15.3H147.8c-8.3,0-15.3-7-15.3-15.3V86.6c0-8.3,7-15.3,15.3-15.3c0,0,474.6,0,474.7,0v214.4c0,16.9,13.7,30.6,30.6,30.6h214.4V913.4z" /><path d="M714.4,806.3H285.6c-16.9,0-30.6-13.7-30.6-30.6s13.7-30.6,30.6-30.6h428.8c16.9,0,30.6,13.7,30.6,30.6S731.3,806.3,714.4,806.3z" /><path d="M714.4,683.8H285.6c-16.9,0-30.6-13.7-30.6-30.6s13.7-30.6,30.6-30.6h428.8c16.9,0,30.6,13.7,30.6,30.6S731.3,683.8,714.4,683.8z" /><path d="M714.4,561.3H285.6c-16.9,0-30.6-13.7-30.6-30.6s13.7-30.6,30.6-30.6h428.8c16.9,0,30.6,13.7,30.6,30.6S731.3,561.3,714.4,561.3z" /></g></g>
              </svg>
              <div className="ml-4">
                <p className="text-xs font-bold">Archivo Actual</p>
                <p className="text-xs">{thesis?.file.uuid}</p>
              </div>
            </div>
            <div className="mb-6">
              <label
                className="block mb-2 text-sm font-medium text-gray-900"
                htmlFor="file_input"
              >
                Actualizar archivo
              </label>
              <input
                className="block w-full md:max-w-xs text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
                aria-describedby="file_input_help"
                id="file_input"
                type="file"
                {...registerFile("file")}
              />
              <p
                className="mt-1 text-xs font-semibold text-gray-500"
                id="file_input_help"
              >
                pdf, doc, docx (max. 20MB).
              </p>
              {
                errorsFile.file &&
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                  {errorsFile.file?.message}
                </p>
              }
            </div>
            <button
              type="submit"
              className="text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              Subir
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default UpdateThesisView;
