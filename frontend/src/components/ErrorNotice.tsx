import { HttpError } from '../api/http';

type Props = {
  error: unknown;
};

export function ErrorNotice({ error }: Props) {
  const message =
    error instanceof HttpError
      ? error.payload?.message ?? error.message
      : 'Ocurrió un error inesperado.';

  return (
    <div className="notice notice--error" role="alert">
      {message}
    </div>
  );
}
