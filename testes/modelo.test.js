const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando fluxo de criação de resposta', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');

  const id_pergunta = modelo.listar_perguntas()[0].id_pergunta;
  const pergunta_obtida = modelo.get_pergunta(id_pergunta);

  modelo.cadastrar_resposta(pergunta_obtida.id_pergunta, 'concordo com ele');
  const respostas = modelo.get_respostas(pergunta_obtida.id_pergunta);

  expect(pergunta_obtida.texto).toBe('1 + 1 = ?');
  expect(pergunta_obtida.id_usuario).toBe(1);
  expect(modelo.get_num_respostas(pergunta_obtida.id_pergunta)).toBe(1);
  expect(respostas[0].texto).toBe('concordo com ele');
  expect(respostas[0].id_pergunta).toBe(pergunta_obtida.id_pergunta);
});

