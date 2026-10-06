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
import api from "../../service/api";

function ListarUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const navigation = useNavigation();

    const buscarUsuarios = async () => {
        setCarregando(true);
        try {
            const response = await api.get("/usuarios");
            setUsuarios(response.data);
        } catch (error) {
            console.log("Erro ao buscar os usuários", error);
            Alert.alert("Erro", "Não foi possível carregar a lista de usuários.");
        } finally {
            setCarregando(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            buscarUsuarios();
        }, [])
    );

    const confirmarExclusao = (id, nome) => {
        Alert.alert(
            "Excluir Usuário",
            `Tem certeza que deseja remover o usuário "${nome}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: () => deletarUsuario(id),
                },
            ]
        );
    };

    const deletarUsuario = async (id) => {
        try {
            await api.delete(`/usuarios/${id}`);
            Alert.alert("Sucesso", "Usuário removido com sucesso!");
            setUsuarios((prev) => prev.filter((u) => u.id !== id));
        } catch (error) {
            console.log("Erro ao deletar usuário:", error);
            Alert.alert("Erro", "Não foi possível excluir o usuário.");
        }
    };

    const obterIniciais = (nome) => {
        if (!nome) return "U";
        const partes = nome.trim().split(" ");
        if (partes.length === 1) return partes[0].charAt(0).toUpperCase();
        return (partes[0].charAt(0) + partes[partes.length - 1].charAt(0)).toUpperCase();
    };

    return (
        <View style={estilo.wrapper}>
            <ScrollView style={estilo.container} showsVerticalScrollIndicator={false}>
                <View style={estilo.header}>
                    <Text style={estilo.titulo}>Gerenciador de Usuários</Text>
                    <Text style={estilo.subtitulo}>
                        {usuarios.length} {usuarios.length === 1 ? "usuário encontrado" : "usuários encontrados"}
                    </Text>
                </View>

                {carregando && usuarios.length === 0 ? (
                    <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 40 }} />
                ) : (
                    <View style={estilo.listaUsuarios}>
                        {usuarios.map((item) => (
                            <View key={item.id} style={estilo.card}>
                                <View style={estilo.cardMain}>
                                    {item.fotoPerfil ? (
                                        <Image
                                            source={{ uri: item.fotoPerfil }}
                                            style={estilo.avatar}
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <View style={[estilo.avatar, estilo.avatarPlaceholder]}>
                                            <Text style={estilo.textoAvatarPlaceholder}>
                                                {obterIniciais(item.nome)}
                                            </Text>
                                        </View>
                                    )}

                                    <View style={estilo.infoContainer}>
                                        <Text style={estilo.nome} numberOfLines={1}>
                                            {item.nome}
                                        </Text>
                                        <Text style={estilo.email} numberOfLines={1}>
                                            {item.email}
                                        </Text>
                                        {item.telefone ? (
                                            <Text style={estilo.telefone}>
                                                📞 {item.telefone}
                                            </Text>
                                        ) : null}
                                    </View>
                                </View>

                                <View style={estilo.footerCard}>
                                    <View style={estilo.idBadge}>
                                        <Text style={estilo.textoIdBadge}>ID: #{item.id}</Text>
                                    </View>

                                    <View style={estilo.acoesContainer}>
                                        <TouchableOpacity
                                            style={estilo.botaoEditar}
                                            onPress={() => navigation.navigate("EditarUsuario", { id: item.id })}
                                        >
                                            <Text style={estilo.textoBotaoAcao}>Editar</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={estilo.botaoExcluir}
                                            onPress={() => confirmarExclusao(item.id, item.nome)}
                                        >
                                            <Text style={estilo.textoBotaoExcluir}>Excluir</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            <TouchableOpacity
                style={estilo.botaoFlutuante}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("CadastrarUsuario")}
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
    listaUsuarios: {
        paddingBottom: 90,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        marginBottom: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    cardMain: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 14,
    },
    avatarPlaceholder: {
        backgroundColor: "#E0E7FF",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#C7D2FE",
    },
    textoAvatarPlaceholder: {
        color: "#3730A3",
        fontSize: 20,
        fontWeight: "700",
    },
    infoContainer: {
        flex: 1,
        justifyContent: "center",
    },
    nome: {
        fontSize: 17,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 2,
    },
    email: {
        fontSize: 14,
        color: "#4B5563",
        marginBottom: 2,
    },
    telefone: {
        fontSize: 13,
        color: "#6B7280",
        fontWeight: "500",
    },
    footerCard: {
        borderTopWidth: 1,
        borderTopColor: "#F3F4F6",
        paddingTop: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    idBadge: {
        backgroundColor: "#F3F4F6",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    textoIdBadge: {
        color: "#6B7280",
        fontSize: 12,
        fontWeight: "600",
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
    textoBotaoExcluir: {
        fontSize: 13,
        fontWeight: "600",
        color: "#991B1B",
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

export default ListarUsuarios;