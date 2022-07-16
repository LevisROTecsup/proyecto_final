import * as Yup from 'yup';

const FILE_SIZE = 20480 * 1024; //2MB /* 160 * 1024*/;
const SUPPORTED_FORMATS = [
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/pdf"
];

const thesisValidator = Yup.object().shape({
  title: Yup.string().required("Ingrese el titulo"),
  theme: Yup.string().required("Ingrese el tema"),
  type: Yup.boolean().required('Seleccione el tipo'),
  contents: Yup.array().min(1, "Escriba por lo menos un contenido que contenga su tesis").required('Ingrese contenidos'),
  key_words: Yup.array().min(1, "Escriba por lo menos una palabra clave que contenga su tesis").required('Ingrese palabras claves'),
  authors: Yup.array().min(1, "Escriba por lo menos un autor de la tesis").required('Ingrese autores'),
  file: Yup.mixed()
    .test(
      "fileExists",
      "Seleccione un archivo",
      value => {
        if (value && value?.length > 0) {
          return true
        } else {
          return false
        }
      }
    )
    .test(
      "fileFormat",
      "Formato no soportado",
      value => value && SUPPORTED_FORMATS.includes(value[0].type)
    )
    .test(
      "fileSize",
      "Archivo muy pesado",
      value => value && value[0].size <= FILE_SIZE
    )
})

export const thesisUpdateValidator = Yup.object().shape({
  title: Yup.string().required("Ingrese el titulo"),
  theme: Yup.string().required("Ingrese el tema"),
  type: Yup.boolean().required('Seleccione el tipo'),
  contents: Yup.array().min(1, "Escriba por lo menos un contenido que contenga su tesis").required('Ingrese contenidos'),
  key_words: Yup.array().min(1, "Escriba por lo menos una palabra clave que contenga su tesis").required('Ingrese palabras claves'),
  authors: Yup.array().min(1, "Escriba por lo menos un autor de la tesis").required('Ingrese autores')
})

export const thesisUpdateFileValidator = Yup.object().shape({
  file: Yup.mixed()
    .test(
      "fileExists",
      "Seleccione un archivo",
      value => {
        if (value && value?.length > 0) {
          return true
        } else {
          return false
        }
      }
    )
    .test(
      "fileFormat",
      "Formato no soportado",
      value => value && SUPPORTED_FORMATS.includes(value[0]?.type)
    )
    .test(
      "fileSize",
      "Archivo muy pesado",
      value => value && value[0]?.size <= FILE_SIZE
    )
})

export default thesisValidator