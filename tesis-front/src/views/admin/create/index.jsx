import Select from 'react-select/creatable';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';

import { useClient } from '../../../context/adminContext';
import thesisSchema from "../../../utils/validations/thesisValidator";

const defaultValues = {
  title: "",
  theme: "",
  type: false,
  contents: [],
  key_words: [],
  authors: [],
  file: null
};

function CreateThesisView() {

  const client = useClient()

  const { register, setValue, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(thesisSchema),
    defaultValues
  });

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

      await client("admin/thesis", { data: formData })
      reset({ ...defaultValues })

    } catch (error) {
      console.log("Error", error);
    }
  }

  const onSubmit = data => {
    const formData = new FormData();
    formData.append("title", data.title)
    formData.append("theme", data.theme)
    formData.append("type", data.type ? "PRIVATE" : "PUBLIC")
    formData.append("contents", JSON.stringify(data.contents))
    formData.append("key_words", JSON.stringify(data.key_words))
    formData.append("authors", JSON.stringify(data.authors))
    formData.append("file", data.file[0])

    handleSubmitServer(formData);
  };

  return (
    <>
      <div>
        <div className="p-4">
          <h2 className="text-slate-900 font-bold text-2xl mb-5">Crear nueva tesis</h2>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                <Select
                  isMulti
                  onChange={handleChangeContent}
                  options={[]}
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
                <Select
                  isMulti
                  onChange={handleChangeKeyWord}
                  options={[]}
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
                <Select
                  isMulti
                  onChange={handleChangeAuthor}
                  options={[]}
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
            <div className="mb-6">
              <label
                className="block mb-2 text-sm font-medium text-gray-900"
                htmlFor="file_input"
              >
                Cargar archivo
              </label>
              <input
                className="block w-full md:max-w-xs text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
                aria-describedby="file_input_help"
                id="file_input"
                type="file"
                {...register("file")}
              />
              <p
                className="mt-1 text-xs font-semibold text-gray-500"
                id="file_input_help"
              >
                pdf, doc, docx (max. 20MB).
              </p>
              {
                errors.file &&
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                  {errors.file?.message}
                </p>
              }
            </div>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              Crear
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default CreateThesisView;
