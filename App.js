import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Keyboard,
} from "react-native";
// Utilizando Picker Diferente:
// react-native-picker-select
import Picker from "./src/components/Picker";
// api
import api from "./src/services/api";

function App() {
  const [moedas, setMoedas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [moedaSelecionada, setMoedaSelecionada] = useState(null);
  const [valorInputMoeda, setvalorInputMoeda] = useState(1);
  const [valorMoeda, setValorMoeda] = useState(null);
  const [valorConvertido, setValorConvertido] = useState(0);
  const [valorMax, setValorMax] = useState(0);
  const [valorMin, setValorMin] = useState(0);
  const [variacaoMoeda, setVariacaoMoeda] = useState(0);
  const [descricaoConversao, setDescricaoConversao] = useState("");
  const [precosVis, setPrecosVis] = useState(false);
  const [txtMais, setTxtMais] = useState("Ver Mais");

  useEffect(() => {
    async function carregaMoedas() {
      const response = await api.get("all");

      let arrayMoedas = [];
      Object.keys(response.data).map((key) => {
        arrayMoedas.push({
          key: key,
          label: key,
          value: key,
        });
      }); //--> Pega todas as keys do  objeto que vem da api

      setMoedas(arrayMoedas);
      setLoading(false);
    }
    carregaMoedas();
  }, []);

  async function converterMoeda() {
    if (moedaSelecionada === null) {
      alert("Selecione uma Moeda.");
      return;
    }

    //USD-BRL a api devolve quanto é 1 dolar convertido em reais
    const response = await api.get(`all/${moedaSelecionada}-BRL`);

    //console.log(response.data[moedaSelecionada].ask); // --> ask É o preço de venda da moeda

    let unidadeDeConversao = response.data[moedaSelecionada].ask;
    let descricao = response.data[moedaSelecionada].name;
    let valorMaximo = response.data[moedaSelecionada].high;
    let valorMinimo = response.data[moedaSelecionada].low;
    let variacao = response.data[moedaSelecionada].varBid;

    if (
      valorInputMoeda === "" ||
      valorInputMoeda === " " ||
      valorInputMoeda === 0
    ) {
      let resultado = unidadeDeConversao;
      setValorConvertido(resultado);
    } else {
      let resultado = unidadeDeConversao * parseFloat(valorInputMoeda);
      setValorConvertido(resultado);
    }
    setValorMoeda(valorInputMoeda);
    setValorMax(valorMaximo);
    setValorMin(valorMinimo);
    setDescricaoConversao(descricao);
    setVariacaoMoeda(variacao);

    // Fechar o teclado após clicar no botao
    Keyboard.dismiss();
  }

  function verMais() {
    if (precosVis === false) {
      setTxtMais(`Ver Menos`);
      setPrecosVis(true);
    }
    if (precosVis === true) {
      setTxtMais(`Ver Mais`);
      setPrecosVis(false);
    }
  }

  function enviaInputMoeda(valor) {
    if (valor !== 0) {
      setvalorInputMoeda(valor);
    }
    if (valor === "") {
      setvalorInputMoeda(1);
    }
  }

  if (loading) {
    return (
      <View style={styles.contLoading}>
        <ActivityIndicator color="#f9f9f9" z size={45} />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.areaMoeda}>
          <Text style={styles.txtSelect}> Selecione sua moeda: </Text>
          <Picker
            moedas={moedas}
            onChange={(moeda) => setMoedaSelecionada(moeda)}
          />
        </View>
        <View style={styles.areaValor}>
          <Text style={styles.txtSelect}>
            Digite um valor para converter em R$
          </Text>
          <TextInput
            style={styles.input}
            placeholder="EX: 150"
            keyboardType="numeric"
            onChangeText={enviaInputMoeda}
          />
        </View>
        <TouchableOpacity style={styles.botaoArea} onPress={converterMoeda}>
          <Text style={styles.txtBotao}> CONVERTER </Text>
        </TouchableOpacity>

        {valorConvertido !== 0 && (
          <View style={styles.areaRes}>
            <Text
              style={[
                styles.valorConvertido,
                styles.txtComplement,
                { marginTop: -10, fontSize: 17, paddingTop: 10 },
              ]}
            >
              {descricaoConversao}
            </Text>
            <Text style={styles.valorConvertido}>
              {valorMoeda} {moedaSelecionada}
            </Text>
            <Text
              style={[
                styles.valorConvertido,
                { fontSize: 18, margin: 10, color: "#333" },
              ]}
            >
              Corresponde a
            </Text>
            <Text style={styles.valorConvertido}>
              R$ {valorConvertido /* .toFixed(2) */}
            </Text>
            <TouchableOpacity onPress={verMais}>
              <Text
                style={{
                  color: "#000",
                  marginTop: 10,
                  textDecorationLine: "underline",
                  textDecorationColor: "#FB4C57",
                }}
              >
                {txtMais}
              </Text>
            </TouchableOpacity>
            {precosVis && (
              <View style={styles.areaPrecos}>
                <Text style={[styles.valorConvertido, styles.txtComplement]}>
                  Preço Máximo: R$ {valorMax}
                </Text>
                <Text style={[styles.valorConvertido, styles.txtComplement]}>
                  Preço Mínimo: R$ {valorMin}
                </Text>
                <Text style={[styles.valorConvertido, styles.txtComplement]}>
                  Taxa de Variação: {variacaoMoeda}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#101215",
    paddingTop: 80,
  },
  areaMoeda: {
    backgroundColor: "#f9f9f9",
    paddingTop: 9,
    width: "90%",
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    marginBottom: 1,
  },
  txtSelect: {
    color: "#000",
    fontWeight: "900",
    fontSize: 15,
    paddingTop: 5,
    paddingLeft: 5,
  },
  areaValor: {
    width: "90%",
    backgroundColor: "#f9f9f9",
    paddingVertical: 9,
  },
  input: {
    width: "100%",
    padding: 10,
    fontSize: 17,
    height: 45,
    marginTop: 8,
    color: "#000",
  },
  botaoArea: {
    width: "90%",
    backgroundColor: "#FB4C57",
    height: 45,
    borderBottomLeftRadius: 9,
    borderBottomRightRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  txtBotao: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  areaRes: {
    width: "90%",
    backgroundColor: "#fff",
    marginTop: 35,
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
    borderRadius: 9,
  },
  valorConvertido: {
    fontSize: 29,
    fontWeight: "bold",
    color: "#000",
  },
  contLoading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#101215",
  },
  txtComplement: {
    fontSize: 17,
    margin: 10,
    marginVertical: 5,
    color: "#333",
  },
  areaPrecos: {
    marginTop: 10,
    backgroundColor: "#ededed",
    borderRadius: 10,
  },
});

export default App;
