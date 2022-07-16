import React from "react";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { yupResolver } from '@hookform/resolvers/yup';

import { useAsync } from "../../../utils/hooks";
import { useAuth } from "../../../context/authContext";
import authSchema from "../../../utils/validations/authValidation";

function LoginView() {

  const { login, user } = useAuth()
  const { isError, run } = useAsync()
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(authSchema)
  });


  const onSubmit = data => {
    run(
      login(data),
    )
  };

  return (
    <>
      {
        user
          ? <Navigate to="/" />
          : <>
            <div className="w-screen h-screen flex justify-center items-center bg-slate-700">
              <div className="w-11/12 md:w-2/5 p-4">
                <h2 className="text-white text-center font-bold text-xl mb-4">Inicio de Sesión</h2>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  {
                    isError &&
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500 text-center mb-4">
                      Credenciales Incorrectas
                    </p>
                  }
                  <div className="mb-6">
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="usuario@gmail.com"
                      {...register("email")}
                    />
                    {
                      errors.email &&
                      <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                        {errors.email?.message}
                      </p>
                    }
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Contraseña
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="•••••••••"
                      {...register("password")}
                    />
                    {
                      errors.password &&
                      <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                        {errors.password?.message}
                      </p>
                    }
                  </div>
                  <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mx-auto"
                  >
                    Iniciar Sesión
                  </button>
                </form>
              </div>
            </div>
          </>
      }
    </>
  )
}

export default LoginView;
