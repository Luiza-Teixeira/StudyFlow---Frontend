import axios from "axios";

const instance = axios.create({
  baseURL: "https://parseapi.back4app.com",
  headers: {
    // Usando as mesmas chaves de materia.js e categoria.js
    "X-Parse-Application-Id": "7DM3RcxZPnRauPJTaV9YDfW60zPjMql5jK9blfME",
    "X-Parse-REST-API-Key": "TZVHd0LZfGGwQ0zukS4yiM71yhE9A15wo5mZNHOB",
  },
});

const headerJson = { "Content-Type": "application/json" };
const headerSession = { ...headerJson, "X-Parse-Revocable-Session": "1" };
const userURL = "/users";

// 'user = { "password":"", "username": "","email": "" }'
export async function userSignUp(user) {
  const response = await instance.post(userURL, user, {
    headers: headerSession,
  });
  return response.data;
}

export async function userLogin(user) {
  const response = await instance.post("/login", user, {
    headers: headerSession,
  });
  return response.data;
}

export async function userLogout(sessionToken) {
  const response = await instance.post("/logout", {
    headers: { ...headerSession, "X-Parse-Session-Token": sessionToken },
  });
  return response.data;
}

export async function currentUser(sessionToken) {
  const response = await instance.get(`${userURL}/me`, {
    headers: { ...headerSession, "X-Parse-Session-Token": sessionToken },
  });
  return response.data;
}

export async function verificationEmailRequest(email) {
  const response = await instance.post(
    "/verificationEmailRequest",
    { email },
    {
      headers: headerJson,
    },
  );
  return response.data;
}

export async function requestPasswordReset(email) {
  const response = await instance.post(
    "/requestPasswordReset",
    { email },
    {
      headers: headerJson,
    },
  );
  return response.data;
}