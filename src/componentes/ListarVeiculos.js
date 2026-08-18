import { useState, useCallback } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import api from "../service/api";

function ListarVeiculos() {
    const [veiculos, setVeiculos] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const navigation = useNavigation();

    const buscarVeiculos = async () => {
        setCarregando(true);
        try {
            const response = await api.get("/veiculos");
            setVeiculos(response.data);
        } catch (error) {
            console.log("Erro ao buscar os veículos", error);
            Alert.alert("Erro", "Não foi possível carregar a lista de veículos.");
        } finally {
            setCarregando(false);
        }
    };

    // Recarrega a lista sempre que a tela ganha foco (ao voltar do cadastro/edição)
    useFocusEffect(
        useCallback(() => {
            buscarVeiculos();
        }, [])
    );

    // Função de Exclusão do Veículo
    const confirmarExclusao = (id, modelo) => {
        Alert.alert(
            "Excluir Veículo",
            `Tem certeza que deseja remover o veículo "${modelo}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: () => deletarVeiculo(id),
                },
            ]
        );
    };

    const deletarVeiculo = async (id) => {
        try {
            await api.delete(`/veiculos/${id}`);
            Alert.alert("Sucesso", "Veículo removido com sucesso!");
            // Remove o item da lista localmente para não precisar fazer novo fetch
            setVeiculos((prev) => prev.filter((v) => v.id !== id));
        } catch (error) {
            console.log("Erro ao deletar veículo:", error);
            Alert.alert("Erro", "Não foi possível excluir o veículo.");
        }
    };

    const formatarPreco = (valor) => {
        if (!valor) return "R$ 0,00";
        return Number(valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    return (
        <View style={estilo.wrapper}>
            <ScrollView style={estilo.container} showsVerticalScrollIndicator={false}>
                {/* Cabeçalho de informações */}
                <View style={estilo.header}>
                    <Text style={estilo.titulo}>Gerenciador de Veículos</Text>
                    <Text style={estilo.subtitulo}>
                        {veiculos.length} {veiculos.length === 1 ? "veículo encontrado" : "veículos encontrados"}
                    </Text>
                </View>

                {/* Feedback de Carregamento */}
                {carregando && veiculos.length === 0 ? (
                    <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 40 }} />
                ) : (
                    /* Lista de Cards */
                    <View style={estilo.listaVeiculos}>
                        {veiculos.map((item) => (
                            <View key={item.id} style={estilo.card}>
                                {item.linkImagem ? (
                                    <Image
                                        source={{ uri: item.linkImagem }}
                                        style={estilo.imagem}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View style={[estilo.imagem, estilo.imagemPlaceholder]}>
                                        <Text style={estilo.textoPlaceholder}>Sem Imagem</Text>
                                    </View>
                                )}

                                <View style={estilo.cardContent}>
                                    <View style={estilo.headerCard}>
                                        <Text style={estilo.modelo}>{item.modelo}</Text>
                                        <View style={estilo.badgePlaca}>
                                            <Text style={estilo.textoPlaca}>{item.placa}</Text>
                                        </View>
                                    </View>

                                    <View style={estilo.detalhesRow}>
                                        <Text style={estilo.detalheItem}>Ano: {item.ano}</Text>
                                        <Text style={estilo.divisor}>•</Text>
                                        <Text style={estilo.detalheItem}>Cor: {item.cor}</Text>
                                    </View>

                                    <View style={estilo.footerCard}>
                                        <View>
                                            <Text style={estilo.labelPreco}>Valor</Text>
                                            <Text style={estilo.preco}>{formatarPreco(item.preco)}</Text>
                                        </View>

                                        {/* Ações: Editar e Excluir */}
                                        <View style={estilo.acoesContainer}>
                                            <TouchableOpacity
                                                style={estilo.botaoEditar}
                                                onPress={() => navigation.navigate("EditarVeiculo", { id: item.id })}
                                            >
                                                <Text style={estilo.textoBotaoAcao}>Editar</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={estilo.botaoExcluir}
                                                onPress={() => confirmarExclusao(item.id, item.modelo)}
                                            >
                                                <Text style={estilo.textoBotaoAcao}>Excluir</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* Botão Flutuante para Cadastrar (Navega via Tab) */}
            <TouchableOpacity
                style={estilo.botaoFlutuante}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("CadastrarVeiculoTab")}
            >
                <Text style={estilo.textoBotaoFlutuante}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

const estilo = StyleSheet.create({
    wrapper: {
        flex: 1,
        position: "relative",
    },
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6",
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    header: {
        marginBottom: 20,
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
    listaVeiculos: {
        paddingBottom: 90,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        marginBottom: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    imagem: {
        width: "100%",
        height: 180,
    },
    imagemPlaceholder: {
        backgroundColor: "#E5E7EB",
        justifyContent: "center",
        alignItems: "center",
    },
    textoPlaceholder: {
        color: "#9CA3AF",
        fontSize: 14,
        fontWeight: "600",
    },
    cardContent: {
        padding: 16,
    },
    headerCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    modelo: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
        flex: 1,
        marginRight: 8,
    },
    badgePlaca: {
        backgroundColor: "#E0E7FF",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#C7D2FE",
    },
    textoPlaca: {
        color: "#3730A3",
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    detalhesRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    detalheItem: {
        fontSize: 14,
        color: "#6B7280",
        fontWeight: "500",
    },
    divisor: {
        marginHorizontal: 8,
        color: "#D1D5DB",
    },
    footerCard: {
        borderTopWidth: 1,
        borderTopColor: "#F3F4F6",
        paddingTop: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    labelPreco: {
        fontSize: 11,
        color: "#9CA3AF",
        textTransform: "uppercase",
        fontWeight: "600",
    },
    preco: {
        fontSize: 18,
        fontWeight: "800",
        color: "#059669",
    },
    acoesContainer: {
        flexDirection: "row",
        gap: 8,
    },
    botaoEditar: {
        backgroundColor: "#F3F4F6",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#D1D5DB",
    },
    botaoExcluir: {
        backgroundColor: "#FEE2E2",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#FCA5A5",
    },
    textoBotaoAcao: {
        fontSize: 13,
        fontWeight: "600",
        color: "#374151",
    },
    botaoFlutuante: {
        position: "absolute",
        bottom: 24,
        right: 24,
        backgroundColor: "#2563EB",
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        elevation: 6,
        shadowColor: "#2563EB",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    textoBotaoFlutuante: {
        color: "#FFFFFF",
        fontSize: 32,
        fontWeight: "300",
        marginTop: -3,
    },
});

export default ListarVeiculos;