import { useState, useEffect } from "react";
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

function EditarUsuario({ navigation, route }) {
    const { id } = route?.params || {};
    const onVoltar = route?.params?.onVoltar;

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [telefone, setTelefone] = useState("");
    const [fotoPerfil, setFotoPerfil] = useState("");
    
    const [carregandoDados, setCarregandoDados] = useState(true);
    const [carregando, setCarregando] = useState(false);

    const handleVoltar = () => {
        if (onVoltar) {
            onVoltar();
        } else if (navigation?.canGoBack()) {
            navigation.goBack();
        }
    };

    useEffect(() => {
        const buscarUsuario = async () => {
            try {
                const response = await api.get(`/usuarios/${id}`);
                const usuario = response.data;

                setNome(usuario.nome || "");
                setEmail(usuario.email || "");
                setTelefone(usuario.telefone || "");
                setFotoPerfil(usuario.fotoPerfil || "");
            } catch (error) {
                console.log("Erro ao buscar detalhes do usuário:", error);
                Alert.alert("Erro", "Não foi possível carregar os dados do usuário.", [
                    { text: "OK", onPress: () => handleVoltar() }
                ]);
            } finally {
                setCarregandoDados(false);
            }
        };

        if (id) {
            buscarUsuario();
        } else {
            Alert.alert("Erro", "ID do usuário não fornecido.", [
                { text: "OK", onPress: () => handleVoltar() }
            ]);
        }
    }, [id]);

    const atualizarUsuario = async () => {
        if (!nome.trim() || !email.trim()) {
            Alert.alert("Atenção", "Preencha os campos obrigatórios (*).");
            return;
        }

        setCarregando(true);

        try {
            // Monta o payload enviando a senha apenas se o usuário preencheu o campo
            const payload = {
                nome,
                email: email.toLowerCase().trim(),
                telefone,
                fotoPerfil
            };

            if (senha.trim()) {
                payload.senha = senha;
            }

            await api.put(`/usuarios/${id}`, payload);

            Alert.alert("Sucesso", "Usuário atualizado com sucesso!", [
                { 
                    text: "OK", 
                    onPress: () => handleVoltar() 
                }
            ]);

        } catch (error) {
            console.log("Erro ao atualizar usuário:", error);
            Alert.alert(
                "Erro",
                error.response?.data?.mensagem || "Não foi possível atualizar o usuário."
            );
        } finally {
            setCarregando(false);
        }
    };

    if (carregandoDados) {
        return (
            <View style={estilo.centralizado}>
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    return (
        <ScrollView style={estilo.container} showsVerticalScrollIndicator={false}>
            {/* Cabeçalho */}
            <View style={estilo.header}>
                <TouchableOpacity onPress={handleVoltar} style={estilo.botaoVoltar}>
                    <Text style={estilo.textoVoltar}>← Voltar</Text>
                </TouchableOpacity>
                <Text style={estilo.titulo}>Editar Usuário</Text>
                <Text style={estilo.subtitulo}>Altere os campos abaixo para atualizar</Text>
            </View>

            {/* Formulário */}
            <View style={estilo.form}>
                <View style={estilo.campoGroup}>
                    <Text style={estilo.label}>Nome Completo *</Text>
                    <TextInput
                        style={estilo.input}
                        placeholder="Ex: Ana Silva"
                        placeholderTextColor="#9CA3AF"
                        value={nome}
                        onChangeText={setNome}
                    />
                </View>

                <View style={estilo.campoGroup}>
                    <Text style={estilo.label}>E-mail *</Text>
                    <TextInput
                        style={estilo.input}
                        placeholder="ana.silva@email.com"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <View style={estilo.campoGroup}>
                    <Text style={estilo.label}>Nova Senha (opcional)</Text>
                    <TextInput
                        style={estilo.input}
                        placeholder="Deixe em branco para não alterar"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry
                        value={senha}
                        onChangeText={setSenha}
                    />
                </View>

                <View style={estilo.campoGroup}>
                    <Text style={estilo.label}>Telefone</Text>
                    <TextInput
                        style={estilo.input}
                        placeholder="(11) 99999-9999"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="phone-pad"
                        value={telefone}
                        onChangeText={setTelefone}
                    />
                </View>

                <View style={estilo.campoGroup}>
                    <Text style={estilo.label}>URL da Foto de Perfil</Text>
                    <TextInput
                        style={estilo.input}
                        placeholder="https://exemplo.com/foto.jpg"
                        placeholderTextColor="#9CA3AF"
                        autoCapitalize="none"
                        keyboardType="url"
                        value={fotoPerfil}
                        onChangeText={setFotoPerfil}
                    />
                </View>

                {/* Botão Salvar Alterações */}
                <TouchableOpacity
                    style={[estilo.botaoSalvar, carregando && estilo.botaoDesabilitado]}
                    onPress={atualizarUsuario}
                    disabled={carregando}
                    activeOpacity={0.8}
                >
                    {carregando ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={estilo.textoBotaoSalvar}>Atualizar Usuário</Text>
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
    centralizado: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F3F4F6",
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

export default EditarUsuario;