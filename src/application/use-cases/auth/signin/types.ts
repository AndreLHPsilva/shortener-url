export interface ISigninUseCaseProps {
  email: string;
  password: string;
}

export interface ISigninResponseUseCase {
  token: string;
}
