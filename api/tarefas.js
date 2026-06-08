import axios from "axios";

const instance = axios.create({
  baseURL: "https://parseapi.back4app.com",
  headers: {
    "X-Parse-Application-Id":
      "7DM3RcxZPnRauPJTaV9YDfW60zPjMql5jK9blfME",
    "X-Parse-REST-API-Key":
      "TZVHd0LZfGGwQ0zukS4yiM71yhE9A15wo5mZNHOB",
    "Content-Type": "application/json",
  },
});

const tarefaURL = "/classes/tarefa";

export async function gettarefa() {
  const response = await instance.get(tarefaURL);
  return response.data.results;
}

export async function addtarefa(tarefa) {
  const response = await instance.post(
    tarefaURL,
    {
      titulo: tarefa.titulo,
      status: tarefa.status,
      data_entrega: {
        __type: "Date",
        iso: tarefa.data_entrega,
      },
    }
  );

  return response.data;
}

export async function updatetarefa(tarefa) {
  const response = await instance.put(
    `${tarefaURL}/${tarefa.objectId}`,
    {
      titulo: tarefa.titulo,
      status: tarefa.status,
      data_entrega: {
        __type: "Date",
        iso: tarefa.data_entrega,
      },
    }
  );

  return response.data;
}

export async function deletetarefa(tarefa) {
  const response = await instance.delete(
    `${tarefaURL}/${tarefa.objectId}`
  );

  return response.data;
}