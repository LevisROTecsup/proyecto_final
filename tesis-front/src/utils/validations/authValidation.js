import * as Yup from 'yup';

const loginValidator = Yup.object().shape({
  email: Yup.string().required("Ingrese su correo electrónico").email("El formato del correo electrónico es incorrecto"),
  password: Yup.string().required("Ingrese su contraseña")
})

export default loginValidator