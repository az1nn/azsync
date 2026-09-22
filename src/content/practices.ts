export type Practice = {
  id: string
  index: string
  title: string
  subtitle: string
  duration: string
  intent: string
  steps: string[]
  note: string
  palette: [string, string, string]
}

export const practices: Practice[] = [
  {
    id: 'symbol',
    index: '01',
    title: 'Transmissão de Símbolo',
    subtitle: 'emissor → receptor',
    duration: '8–12 min',
    intent:
      'Testar associação simbólica com um alvo sorteado e oculto do receptor até o fim da rodada.',
    steps: [
      'Definam emissor e receptor antes do sorteio.',
      'Sorteiem um alvo e mostrem apenas ao emissor.',
      'Façam 90 segundos de silêncio e respiração estável.',
      'O emissor sustenta forma, textura e movimento do símbolo sem falar.',
      'O receptor registra a primeira impressão antes de qualquer conversa.',
      'Revelem o alvo somente depois do registro.',
    ],
    note:
      'Evitem gestos, sons, vibrações do aparelho e pistas contextuais. A comparação deve acontecer depois do palpite.',
    palette: ['#d6ff7f', '#63e6be', '#8b5cf6'],
  },
  {
    id: 'chromatic',
    index: '02',
    title: 'Campo Cromático',
    subtitle: 'cor com olhos fechados',
    duration: '6–10 min',
    intent:
      'Observar imagens mentais espontâneas e comparar a descrição com uma cor-alvo sorteada.',
    steps: [
      'Reduzam luz e estímulos do ambiente.',
      'O receptor fecha os olhos antes do sorteio.',
      'O emissor observa a cor-alvo em tela sem nomeá-la.',
      'O receptor descreve matiz, brilho, temperatura e saturação percebidos.',
      'Registrem a descrição antes de revelar a cor.',
      'Repitam em blocos curtos para evitar fadiga.',
    ],
    note:
      'Fenômenos visuais de olhos fechados são comuns; registre-os como percepção subjetiva, não como prova do alvo.',
    palette: ['#ff5c8a', '#ffd166', '#7c3aed'],
  },
  {
    id: 'number',
    index: '03',
    title: 'Número Cego',
    subtitle: '0–9 / escolha forçada',
    duration: '5–8 min',
    intent:
      'Usar um conjunto pequeno e pré-definido para permitir comparação objetiva entre tentativa e alvo.',
    steps: [
      'Escolham previamente o conjunto de respostas: 0 a 9.',
      'O alvo é sorteado sem o receptor ver a tela.',
      'O emissor visualiza o número como forma, ritmo e quantidade.',
      'O receptor informa um único número, sem múltiplos palpites.',
      'Registrem tentativa e alvo em sequência.',
      'Avaliem somente depois de um bloco de rodadas.',
    ],
    note:
      'Não mudem as regras durante a sessão. Um protocolo estável reduz interpretação retrospectiva.',
    palette: ['#7dd3fc', '#38bdf8', '#818cf8'],
  },
  {
    id: 'group',
    index: '04',
    title: 'Sincronização em Grupo',
    subtitle: 'atenção compartilhada',
    duration: '12–20 min',
    intent:
      'Estudar convergência de imagens, palavras e estados atencionais durante uma meditação estruturada.',
    steps: [
      'Sincronizem o início com um único sinal sonoro.',
      'Façam três minutos de respiração sem alvo.',
      'Introduzam um tema amplo, sem detalhes adicionais.',
      'Permaneçam em silêncio durante o bloco principal.',
      'Cada participante registra notas individualmente.',
      'Comparem descrições somente após todos finalizarem.',
    ],
    note:
      'Registros independentes preservam a comparação e diminuem contaminação social por relatos anteriores.',
    palette: ['#f0abfc', '#c084fc', '#60a5fa'],
  },
]

export const targets = {
  symbols: ['△', '○', '□', '✦', '☾', '⌁', '◇', '⊕'],
  colors: ['Vermelho', 'Âmbar', 'Amarelo', 'Verde', 'Ciano', 'Azul', 'Violeta', 'Magenta'],
  numbers: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
}
