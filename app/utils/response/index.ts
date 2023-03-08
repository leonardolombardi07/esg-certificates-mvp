import { json } from "@remix-run/node";

function badRequest<T>(data: T) {
  return json(data, { status: 400 });
}

function unauthorized<T>(data: T) {
  return json(data, { status: 401 });
}

export { badRequest, unauthorized };
