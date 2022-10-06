import React from "react";
import axios from "axios";

//https://economia.awesomeapi.com.br/json/
// all  
// all/USD-BRL --> Rota para converter Dolar em BRL

const api = axios.create({
  baseURL: "https://economia.awesomeapi.com.br/json/",
});


export default api;