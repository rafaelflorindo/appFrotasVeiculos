import { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator
} from "react-native";

import api from "../../service/api";

function CadastrarVeiculo({ navigation, route }) {
    // Permite usar a prop onVoltar enviada de fora ou o goBack padrão da navegação
    const onVoltar = route?.params?.onVoltar;

    const [modelo, setModelo] = useState("");
    const [placa, setPlaca] = useState("");
    const [ano, setAno] = useState("");
    const [cor, setCor] = useState("");
    const [preco, setPreco] = useState("");
    const [linkImagem, setLinkImagem] = useState("");
    const [carregando, setCarregando] = useState(false);

    const handleVoltar = () => {
        if (onVoltar) {
            onVoltar();
        } else if (navigation?.canGoBack()) {
            navigation.goBack();
        }
    };

    const salvarVeiculo = async () => {
        if (!modelo.trim() || !placa.trim() || !ano.trim() || !preco.trim()) {
            Alert.alert("Atenção", "Preencha todos os campos obrigatórios (*).");
            return;
        }

        setCarregando(true);

        try {
            await api.post("/veiculos", {
                modelo,
                placa: placa.toUpperCase(),
                ano: Number(ano),
                cor,
                preco: Number(preco.replace(",", ".")),
                linkImagem
            });

            Alert.alert("Sucesso", "Veículo cadastrado com sucesso!", [
                { 
                    text: "OK", 
                    onPress: () => handleVoltar() 
                }
            ]);

        } catch (error) {
            console.log("Erro ao salvar veículo:", error);
            Alert.alert(
                "Erro",
                error.response?.data?.mensagem || "Não foi possível cadastrar o veículo."
            );
        } finally {
            setCarregando(false);
        }
    };
    const voltar = () => {
        navigation.goBack();
    };
    return (
        <ScrollView style={estilo.container} showsVerticalScrollIndicator={false}>
            {/* Cabeçalho da Tela */}
            <View style={estilo.header}>
                <TouchableOpacity onPress={voltar} style={estilo.botaoVoltar}>
                    <Text style={estilo.textoVoltar}>← Voltar</Text>
                </TouchableOpacity>
                <Text style={estilo.titulo}>Novo Veículo</Text>
                <Text style={estilo.subtitulo}>Preencha os dados abaixo para cadastrar</Text>
            </View>

            {/* Formulário */}
            <View style={estilo.form}>
                <View style={estilo.campoGroup}>
                    <Text style={estilo.label}>Modelo *</Text>
                    <TextInput
                        style={estilo.input}
                        placeholder="Ex: Gol G5, Ford Ka"
                        placeholderTextColor="#9CA3AF"
                        value={modelo}
                        onChangeText={setModelo}
                    />
                </View>

                <View style={estilo.row}>
                    <View style={[estilo.campoGroup, { flex: 1, marginRight: 8 }]}>
                        <Text style={estilo.label}>Placa *</Text>
                        <TextInput
                            style={estilo.input}
                            placeholder="ABC1D23"
                            placeholderTextColor="#9CA3AF"
                            autoCapitalize="characters"
                            maxLength={7}
                            value={placa}
                            onChangeText={setPlaca}
                        />
                    </View>

                    <View style={[estilo.campoGroup, { flex: 1, marginLeft: 8 }]}>
                        <Text style={estilo.label}>Ano *</Text>
                        <TextInput
                            style={estilo.input}
                            placeholder="2025"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="numeric"
                            maxLength={4}
                            value={ano}
                            onChangeText={setAno}
                        />
                    </View>
                </View>

                <View style={estilo.row}>
                    <View style={[estilo.campoGroup, { flex: 1, marginRight: 8 }]}>
                        <Text style={estilo.label}>Cor</Text>
                        <TextInput
                            style={estilo.input}
                            placeholder="Ex: Prata"
                            placeholderTextColor="#9CA3AF"
                            value={cor}
                            onChangeText={setCor}
                        />
                    </View>

                    <View style={[estilo.campoGroup, { flex: 1, marginLeft: 8 }]}>
                        <Text style={estilo.label}>Preço (R$) *</Text>
                        <TextInput
                            style={estilo.input}
                            placeholder="78500.00"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="numeric"
                            value={preco}
                            onChangeText={setPreco}
                        />
                    </View>
                </View>

                <View style={estilo.campoGroup}>
                    <Text style={estilo.label}>URL da Imagem</Text>
                    <TextInput
                        style={estilo.input}
                        placeholder="https://exemplo.com/foto.jpg"
                        placeholderTextColor="#9CA3AF"
                        autoCapitalize="none"
                        keyboardType="url"
                        value={linkImagem}
                        onChangeText={setLinkImagem}
                    />
                </View>

                {/* Botão Salvar */}
                <TouchableOpacity
                    style={[estilo.botaoSalvar, carregando && estilo.botaoDesabilitado]}
                    onPress={salvarVeiculo}
                    disabled={carregando}
                    activeOpacity={0.8}
                >
                    {carregando ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={estilo.textoBotaoSalvar}>Salvar Veículo</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const estilo = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6",
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    header: {
        marginBottom: 20,
    },
    botaoVoltar: {
        marginBottom: 12,
        alignSelf: "flex-start",
    },
    textoVoltar: {
        color: "#2563EB",
        fontSize: 16,
        fontWeight: "600",
    },
    titulo: {
        color: "#1F2937",
        fontSize: 26,
        fontWeight: "800",
        letterSpacing: -0.5,
    },
    subtitulo: {
        color: "#6B7280",
        fontSize: 14,
        marginTop: 4,
    },
    form: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        marginBottom: 40,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    campoGroup: {
        marginBottom: 16,
    },
    row: {
        flexDirection: "row",
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 6,
    },
    input: {
        backgroundColor: "#F9FAFB",
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 15,
        color: "#111827",
    },
    botaoSalvar: {
        backgroundColor: "#2563EB",
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 12,
    },
    botaoDesabilitado: {
        backgroundColor: "#93C5FD",
    },
    textoBotaoSalvar: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },
});

export default CadastrarVeiculo;