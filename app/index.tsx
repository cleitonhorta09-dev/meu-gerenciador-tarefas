import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';

interface Tarefa {
  id: string;
  titulo: string;
  status: 'A fazer' | 'Em andamento' | 'Concluída';
  tempoGasto: number; // em segundos
}

export default function Index() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  // Nova memória: guarda o texto que você está digitando no momento
  const [textoNovaTarefa, setTextoNovaTarefa] = useState('');

  useEffect(() => {
    const intervalo = setInterval(() => {
      setTarefas((tarefasAtuais) =>
        tarefasAtuais.map((t) => {
          if (t.status === 'Em andamento') {
            return { ...t, tempoGasto: t.tempoGasto + 1 };
          }
          return t;
        })
      );
    }, 1000);
    return () => clearInterval(intervalo);
  }, []);

  // Função atualizada para usar o nome real que você digitou
  const adicionarTarefaReal = () => {
    // Se o usuário não digitou nada (ou só espaços), não faz nada
    if (textoNovaTarefa.trim() === '') {
      Alert.alert('Ops!', 'Digite um nome para a sua tarefa primeiro.');
      return;
    }

    const novaTarefa: Tarefa = {
      id: Date.now().toString(),
      titulo: textoNovaTarefa, // Usa o texto da caixa
      status: 'A fazer',
      tempoGasto: 0,
    };

    setTarefas([...tarefas, novaTarefa]);
    setTextoNovaTarefa(''); // Limpa a caixa de texto depois de adicionar!
  };

  const alterarStatus = (id: string) => {
    const listaAtualizada = tarefas.map((t) => {
      if (t.id === id) {
        let novoStatus: 'A fazer' | 'Em andamento' | 'Concluída' = 'A fazer';
        if (t.status === 'A fazer') novoStatus = 'Em andamento';
        else if (t.status === 'Em andamento') novoStatus = 'Concluída';
        
        return { ...t, status: novoStatus };
      }
      return t;
    });
    setTarefas(listaAtualizada);
  };

  const formatarTempo = (segundos: number) => {
    const hrs = Math.floor(segundos / 3600);
    const mins = Math.floor((segundos % 3600) / 60);
    const secs = segundos % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Meu Gerenciador</Text>
      <Text style={styles.subtitulo}>Acompanhe seu tempo e tarefas</Text>

      {/* --- NOVA ÁREA: CAMPO DE ENTRADA --- */}
      <View style={styles.areaFormulario}>
        <TextInput
          style={styles.campoTexto}
          placeholder="O que você vai fazer agora?"
          placeholderTextColor="#999"
          value={textoNovaTarefa}
          onChangeText={setTextoNovaTarefa} // Atualiza a memória a cada letra digitada
        />
        <TouchableOpacity style={styles.botaoAdd} onPress={adicionarTarefaReal}>
          <Text style={styles.textoBotao}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.areaLista}>
        {tarefas.length === 0 ? (
          <View style={styles.areaVazia}>
            <Text style={styles.textoVazio}>Nenhuma tarefa por enquanto... 🚀</Text>
          </View>
        ) : (
          tarefas.map((item) => (
            <View key={item.id} style={styles.cartaoTarefa}>
              <View style={styles.linhaPrincipal}>
                <Text style={styles.tituloTarefa}>{item.titulo}</Text>
                
                <TouchableOpacity 
                  style={[
                    styles.etiquetaStatus, 
                    item.status === 'Em andamento' && styles.statusAndamento,
                    item.status === 'Concluída' && styles.statusConcluida
                  ]}
                  onPress={() => alterarStatus(item.id)}
                >
                  <Text style={styles.textoStatus}>{item.status}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.linhaTempo}>
                <Text style={styles.textoCronometro}>
                  {item.status === 'Em andamento' ? '⏳ ' : '⏱️ '} 
                  {formatarTempo(item.tempoGasto)}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitulo: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  areaFormulario: {
    flexDirection: 'row', // Coloca a caixa de texto e o botão "+" lado a lado
    marginBottom: 20,
  },
  campoTexto: {
    flex: 1, // Faz a caixa de texto ocupar quase todo o espaço horizontal
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    color: '#333',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  botaoAdd: {
    backgroundColor: '#007AFF',
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  areaLista: {
    flex: 1,
  },
  areaVazia: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  textoVazio: {
    color: '#999',
    fontStyle: 'italic',
  },
  cartaoTarefa: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  linhaPrincipal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tituloTarefa: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  etiquetaStatus: {
    backgroundColor: '#777',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statusAndamento: {
    backgroundColor: '#FF9500',
  },
  statusConcluida: {
    backgroundColor: '#34C759',
  },
  textoStatus: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  linhaTempo: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  textoCronometro: {
    fontSize: 16,
    color: '#555',
    fontFamily: 'Courier',
  },
});