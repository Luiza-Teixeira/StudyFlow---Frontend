import axios from "axios";

const instance = axios.create({
  baseURL: "https://parseapi.back4app.com",
  headers: {
    "X-Parse-Application-Id": "7DM3RcxZPnRauPJTaV9YDfW60zPjMql5jK9blfME",
    "X-Parse-REST-API-Key": "TZVHd0LZfGGwQ0zukS4yiM71yhE9A15wo5mZNHOB",
    "Content-Type": "application/json",
  },
});
const materiaURL = "/classes/materia";
const headerJson = { "Content-Type": "application/json" };

export async function getmateria() {
  const response = await instance.get(materiaURL);
  return response.data?.results;
}

export async function addmateria(descricao) {
  try {
    const response = await instance.post(
      materiaURL,
      {
        nome: descricao,
        periodo: "1"
      },
      {
        headers: headerJson,
      }
    );

    return response.data;
  } catch (error) {
    console.log("STATUS:", error.response?.status);
    console.log("ERRO:", error.response?.data);
    throw error;
  }
}

export async function updatemateria(materia) {
  try {
    console.log("MATERIA RECEBIDA:", materia);

    const response = await instance.put(
      `${materiaURL}/${materia.objectId}`,
      {
        nome: materia.nome, // A correção foi feita bem aqui!
        periodo: materia.periodo,
      },
      {
        headers: headerJson,
      }
    );

    return response.data;
  } catch (error) {
    console.log("STATUS:", error.response?.status);
    console.log("ERRO:", error.response?.data);
    throw error;
  }
}

export async function deletemateria(materia) {
  const response = await instance.delete(`${materiaURL}/${materia.objectId}`);
  return response.data;
}