import { DefaultProps } from "@/types";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { FormControl, IconButton, InputAdornment, InputLabel, Link, OutlinedInput, TextField } from "@mui/material";

import { firebaseLogin, firebaseRegister } from "@/API/firebase";
import { useAppDispatch } from "@/redux/hooks";
import "./Auth.scss";

interface IAuthProps extends DefaultProps {}
interface IAuthForm {
  email: string;
  password: string;
  nickname?: string;
}

type AuthMode = "register" | "login";

const Auth: React.FC<IAuthProps> = () => {
  const [isFormDisabled, setIsFormDisabled] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [authError, setAuthError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IAuthForm>({
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<IAuthForm> = async (data) => {
    setIsErrorVisible(false);
    setIsFormDisabled(true);
    const response = authMode === "register" ? await firebaseRegister(data) : await firebaseLogin(data);

    if (typeof response === "string") {
      switch (response) {
        case "Firebase: Error (auth/invalid-credential).":
          setAuthError("Неверная почта или пароль!");
          break;
        case "Firebase: Error (auth/email-already-in-use).":
          setAuthError("Данная почта уже занята.");
          break;
        case "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).":
          setAuthError("Слишком много попыток входа. Попробуйте позже.");
          break;
        default:
          setAuthError("Что-то пошло не так! Попробуйте снова.");

          break;
      }
    }
    setIsErrorVisible(true);
    setIsFormDisabled(false);
  };

  useEffect(() => {
    document.title = authMode === "register" ? "Регистрация в Mychat" : "Вход в Mychat";
  }, [authMode]);

  return (
    <div className="auth-page">
      <div className="auth-page__container">
        <h1 className="auth-page__title">MyChat</h1>
        <span className="auth-page__sub-title">{authMode === "login" ? "Вход" : "Регистрация"}</span>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="auth-form">
          {authMode === "register" ? (
            <FormControl>
              <InputLabel color={errors.nickname ? "error" : "secondary"}>Введите ник</InputLabel>
              <OutlinedInput
                inputProps={{ maxLength: 15 }}
                disabled={isFormDisabled}
                {...register("nickname", {
                  required: "Заполните все поля!",
                  onBlur: () => {
                    setIsErrorVisible(false);
                  },
                })}
                type="text"
                autoComplete="off"
                color={errors.nickname ? "error" : "secondary"}
                label="Введите ник"
                classes={{
                  root: "auth-input",
                }}
              />
            </FormControl>
          ) : (
            false
          )}
          <FormControl>
            <InputLabel color={errors.email ? "error" : "secondary"}>Введите почту</InputLabel>
            <OutlinedInput
              disabled={isFormDisabled}
              {...register("email", {
                required: "Заполните все поля!",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Пожалуйста, введите действительный адрес почты",
                },
                onBlur: () => {
                  setIsErrorVisible(false);
                },
              })}
              autoComplete="off"
              color={errors.email ? "error" : "secondary"}
              label="Введите почту"
              classes={{
                root: "auth-input",
              }}
            />
          </FormControl>
          <FormControl>
            <InputLabel color={errors.password ? "error" : "secondary"}>Введите пароль</InputLabel>
            <OutlinedInput
              disabled={isFormDisabled}
              {...register("password", {
                required: "Заполните все поля!",
                minLength: { value: 8, message: "Пароль должен быть не менее 8 символов!" },
                onBlur: () => {
                  setIsErrorVisible(false);
                },
              })}
              type={showPassword ? "text" : "password"}
              autoComplete="off"
              color={errors.password ? "error" : "secondary"}
              label="Введите пароль"
              classes={{
                root: "auth-input",
              }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    style={{ opacity: showPassword ? "1" : "0.5" }}
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                    edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          {(errors.email || errors.password || authError) && isErrorVisible ? (
            <div style={{ color: "red", lineHeight: "1.5" }}>
              {errors.email?.message || errors.password?.message || authError}
            </div>
          ) : (
            <Link
              onClick={() => {
                setAuthMode((previousState) => {
                  return previousState === "login" ? "register" : "login";
                });
                reset();
                setAuthError("");
              }}
              color={"secondary"}
              style={{ cursor: "pointer", marginTop: "0px" }}
              underline="none">
              {authMode === "register" ? "Войти в аккаунт" : "Зарегистрироваться"}
            </Link>
          )}

          <Button
            disabled={isFormDisabled}
            onClick={() => {
              setIsErrorVisible(true);
            }}
            sx={{ padding: "14.75px 10px", marginTop: "20px" }}
            type="submit"
            color="secondary"
            variant="outlined">
            {authMode === "login" ? "Войти" : "Зарегистрироваться"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
