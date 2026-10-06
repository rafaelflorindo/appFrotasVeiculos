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

function CadastrarUsuario({ navigation, route }) {
    const onVoltar = route?.params?.onVoltar;

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [telefone, setTelefone] = useState("");
    const [fotoPerfil, setFotoPerfil] = useState("");
    const [carregando, setCarregando] = useState(false);

    const handleVoltar = () => {
        if (onVoltar) {
            onVoltar();
        } else if (navigation?.canGoBack()) {
            navigation.goBack();
        }
    };

    const salvarUsuario = async () => {
        if (!nome.trim() || !email.trim() || !senha.trim()) {
            Alert.alert("Atenção", "Preencha todos os campos obrigatórios (*).");
            return;
        }

        setCarregando(true);

        try {
            await api.post("/usuarios", {
                nome,
                email: email.toLowerCase().trim(),
                senha,
                telefone,
                fotoPerfil
            });

            Alert.alert("Sucesso", "Usuário cadastrado com sucesso!", [
                { 
                    text: "OK", 
                    onPress: () => handleVoltar() 
                }
            ]);

        } catch (error) {
            console.log("Erro ao salvar usuário:", error);
            Alert.alert(
                "Erro",
                error.response?.data?.mensagem || "Não foi possível cadastrar o usuário."
            );
        } finally {
            setCarregando(false);
        }
    };

    return (
        <ScrollView style={estilo.container} showsVerticalScrollIndicator={false}>
            {/* Cabeçalho */}
            <View style={estilo.header}>
                <TouchableOpacity onPress={handleVoltar} style={estilo.botaoVoltar}>
                    <Text style={estilo.textoVoltar}>← Voltar</Text>
                </TouchableOpacity>
                <Text style={estilo.titulo}>Novo Usuário</Text>
                <Text style={estilo.subtitulo}>Preencha os dados abaixo para cadastrar</Text>
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
                    <Text style={estilo.label}>Senha *</Text>
                    <TextInput
                        style={estilo.input}
                        placeholder="Sua senha secreta"
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

                {/* Botão Salvar */}
                <TouchableOpacity
                    style={[estilo.botaoSalvar, carregando && estilo.botaoDesabilitado]}
                    onPress={salvarUsuario}
                    disabled={carregando}
                    activeOpacity={0.8}
                >
                    {carregando ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={estilo.textoBotaoSalvar}>Salvar Usuário</Text>
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

export default CadastrarUsuario;