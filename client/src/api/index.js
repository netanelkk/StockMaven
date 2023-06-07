const token = localStorage.getItem('token');

async function request(url, data, requestMethod = "POST") {
  let resp;
  let request = {
    method: requestMethod,
    headers: { "Content-Type": "application/json" }
  };

  if (requestMethod == "POST") {
    request.body = JSON.stringify(data);
  }

  if (token != null) {
    request.headers["Authorization"] = 'Bearer ' + token;
  }

  return await fetch(url, request).then((response) => {
    resp = response;
    return response.json();
  }).then((result) => {
    if (!result) {
      throw new Error();
    }
    result.pass = true;
    if (!resp.ok) {
      result.pass = false;
    }
    return result;
  }).catch((error) => {
    return {
      pass: false,
      msg: "Unexpected error, try again",
      error: JSON.stringify(error),
      httpcode: resp ? resp.status : 0
    };
  });
}

const local = false;
let API_URL = "";
if (local) {
  API_URL = "http://172.17.17.17:4100";
} else {
  API_URL = "https://netanel.vps.webdock.cloud:4200";
}

export async function login({ email, password }) {
  return await request(API_URL+"/user/login", { email, password });
}

export async function register({ name, email, password, token }) {
  return await request(API_URL+"/user/register", { name, email, password, token });
}

export async function fetchHome() {
  return await request(API_URL + "/main", "", "GET");
}

export async function fetchBySymbol(symbol) {
  return await request(API_URL + "/stock/" + symbol, "", "GET");
}

export async function fetchGraph(stockids, range) {
  return await request(API_URL + "/stock/graph/" + range, { stockids });
}

export async function fetchSuggestions(ignoresymbol) {
  return await request(API_URL + "/stock/suggestions/" + ignoresymbol, "", "GET");
}

export async function fetchArticles() {
  return await request(API_URL + "/main/articles", "", "GET");
}

export async function fetchAll(query) {
  return await request(API_URL + "/main/stocks/" + query, "", "GET");
}

export async function suggestion(query, ignoreids) {
  return await request(API_URL + "/stock/suggestion/" + query, { ignoreids });
}

export async function auth({ code }) {
  return await request(API_URL + "/user/auth", { code });
}

export async function mydetails() {
  return await request(API_URL + "/user/mydetails", "", "GET");
}

export async function addComment(stockId, content) {
  return await request(API_URL + "/stock/addcomment/" + stockId, { content });
}

export async function fetchComments(id, page) {
  return await request(API_URL + "/stock/" + id + "/comments/" + page, "", "GET");
}

export async function deletecomment(id) {
  return await request(API_URL + "/stock/deletecomment/" + id, "", "DELETE");
}

export async function fetchCategories(query) {
  return await request(API_URL + (query ? "/main/categories/" + query : "/main/categories"), "", "GET");
}

export async function mysaved() {
  return await request(API_URL + "/user/mysaved", "", "GET");
}

export async function reorder(neworder) {
  return await request(API_URL + "/user/reorder", { neworder });
}

export async function removesaved(id) {
  return await request(API_URL + "/user/removesaved/" + id, "", "DELETE");
}

export async function addsaved(stockid) {
  return await request(API_URL + "/user/addsaved", { stockid });
}

export async function deleteaccount() {
  return await request(API_URL + "/user/deleteaccount/", "", "DELETE");
}

export async function top3() {
  return await request(API_URL + "/stock/top3", "", "GET");
}

export async function feedback(stockid) {
  return await request(API_URL + "/stock/" + stockid + "/feedback", "", "GET");
}

export async function addFeedback(feedback, stockId) {
  return await request(API_URL + "/stock/addfeedback/" + stockId, { feedback });
}

export async function topmovers({ date, categories, by }) {
  return await request(API_URL + "/main/topmovers", { date, categories, by });
}

export async function grow({ stockids, range }) {
  return await request(API_URL + "/stock/grow", { stockids, range });
}

export async function contact({ name, email, content, token }) {
  return await request(API_URL + "/main/contact", { name, email, content, token });
}