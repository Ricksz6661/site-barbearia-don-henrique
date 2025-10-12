document.addEventListener("DOMContentLoaded", () => {
  carregarServicos();
  carregarClientes();
  carregarHorarios();
  carregarAgendamentos();
  carregarFeedbacks();
});

/*********** SERVIÇOS ***********/
function carregarServicos() {
  const servicos = JSON.parse(localStorage.getItem("servicos")) || {};
  const tbody = document.querySelector("#tabelaServicos tbody");
  tbody.innerHTML = "";
  for (let nome in servicos) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${nome}</td>
      <td>R$${servicos[nome]}</td>
      <td>
        <button class="btn edit" onclick="editarServico('${nome}')">Editar</button>
        <button class="btn delete" onclick="excluirServico('${nome}')">Excluir</button>
      </td>`;
    tbody.appendChild(tr);
  }
}

function adicionarServico() {
  const nome = document.getElementById("novoServicoNome").value;
  const valor = Number(document.getElementById("novoServicoValor").value);
  if (!nome || !valor) return alert("Preencha nome e valor!");
  const servicos = JSON.parse(localStorage.getItem("servicos")) || {};
  servicos[nome] = valor;
  localStorage.setItem("servicos", JSON.stringify(servicos));
  document.getElementById("novoServicoNome").value = "";
  document.getElementById("novoServicoValor").value = "";
  carregarServicos();
}

function editarServico(nome) {
  const servicos = JSON.parse(localStorage.getItem("servicos")) || {};
  const novoValor = prompt(`Novo valor de ${nome}:`, servicos[nome]);
  if (novoValor !== null) {
    servicos[nome] = Number(novoValor);
    localStorage.setItem("servicos", JSON.stringify(servicos));
    carregarServicos();
  }
}

function excluirServico(nome) {
  if (confirm("Deseja realmente excluir este serviço?")) {
    const servicos = JSON.parse(localStorage.getItem("servicos")) || {};
    delete servicos[nome];
    localStorage.setItem("servicos", JSON.stringify(servicos));
    carregarServicos();
  }
}

/*********** CLIENTES ***********/
function carregarClientes() {
  const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
  const tbody = document.querySelector("#tabelaClientes tbody");
  tbody.innerHTML = "";
  clientes.forEach((c, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.nome}</td>
      <td>${c.telefone}</td>
      <td>${c.email}</td>
      <td>${c.nota || ""}</td>
      <td>
        <button class="btn edit" onclick="editarCliente(${i})">Editar</button>
        <button class="btn delete" onclick="excluirCliente(${i})">Excluir</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

function adicionarCliente() {
  const nome = document.getElementById("novoClienteNome").value;
  const telefone = document.getElementById("novoClienteTelefone").value;
  const email = document.getElementById("novoClienteEmail").value;
  const nota = document.getElementById("novaObservacao").value;
  if (!nome || !telefone || !email) return alert("Preencha todos os campos!");
  const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
  clientes.push({ nome, telefone, email, nota });
  localStorage.setItem("clientes", JSON.stringify(clientes));
  document.getElementById("novoClienteNome").value = "";
  document.getElementById("novoClienteTelefone").value = "";
  document.getElementById("novoClienteEmail").value = "";
  document.getElementById("novaObservacao").value = "";
  carregarClientes();
}

function editarCliente(index) {
  const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
  const c = clientes[index];
  const nome = prompt("Nome:", c.nome);
  const telefone = prompt("Telefone:", c.telefone);
  const email = prompt("Email:", c.email);
  const nota = prompt("Observação:", c.nota || "");
  if (nome && telefone && email) {
    clientes[index] = { nome, telefone, email, nota };
    localStorage.setItem("clientes", JSON.stringify(clientes));
    carregarClientes();
  }
}

function excluirCliente(index) {
  if (confirm("Deseja realmente excluir este cliente?")) {
    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    clientes.splice(index, 1);
    localStorage.setItem("clientes", JSON.stringify(clientes));
    carregarClientes();
  }
}

/*********** HORÁRIOS ***********/
function carregarHorarios() {
  const horarios = JSON.parse(localStorage.getItem("horarios")) || [];
  const tbody = document.querySelector("#tabelaHorarios tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  horarios.forEach((h, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${h}</td>
      <td>
        <button class="btn edit" onclick="editarHorario(${i})">Editar</button>
        <button class="btn delete" onclick="excluirHorario(${i})">Excluir</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

function adicionarHorario() {
  const novoHorario = document.getElementById("novoHorario").value;
  if (!novoHorario) return alert("Informe um horário!");
  const horarios = JSON.parse(localStorage.getItem("horarios")) || [];
  horarios.push(novoHorario);
  localStorage.setItem("horarios", JSON.stringify(horarios));
  document.getElementById("novoHorario").value = "";
  carregarHorarios();
}

function editarHorario(index) {
  const horarios = JSON.parse(localStorage.getItem("horarios")) || [];
  const novo = prompt("Editar horário:", horarios[index]);
  if (novo) {
    horarios[index] = novo;
    localStorage.setItem("horarios", JSON.stringify(horarios));
    carregarHorarios();
  }
}

function excluirHorario(index) {
  if (confirm("Deseja excluir este horário?")) {
    const horarios = JSON.parse(localStorage.getItem("horarios")) || [];
    horarios.splice(index, 1);
    localStorage.setItem("horarios", JSON.stringify(horarios));
    carregarHorarios();
  }
}

/*********** AGENDAMENTOS ***********/
function carregarAgendamentos() {
  const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
  const tbody = document.querySelector("#tabelaAgendamentos tbody");
  tbody.innerHTML = "";

  let lucroDiario = 0, lucroSemanal = 0, lucroMensal = 0;
  const hoje = new Date();

  agendamentos.forEach((a, i) => {
    const dataAgendamento = new Date(a.data);
    const diffDias = (hoje - dataAgendamento) / (1000 * 60 * 60 * 24);
    if (diffDias < 1) lucroDiario += a.valor;
    if (diffDias < 7) lucroSemanal += a.valor;
    if (diffDias < 30) lucroMensal += a.valor;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${a.nome}</td>
      <td>${a.servicos.join(", ")}</td>
      <td>R$${a.valor}</td>
      <td>${a.horario}</td>
      <td>
        <button class="btn delete" onclick="excluirAgendamento(${i})">Excluir</button>
      </td>`;
    tbody.appendChild(tr);
  });

  document.getElementById("lucroDiario").innerText = lucroDiario;
  document.getElementById("lucroSemanal").innerText = lucroSemanal;
  document.getElementById("lucroMensal").innerText = lucroMensal;
}

function excluirAgendamento(index) {
  if (confirm("Deseja realmente excluir este agendamento?")) {
    const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
    agendamentos.splice(index, 1);
    localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
    carregarAgendamentos();
  }
}

/*********** FEEDBACKS ***********/
function carregarFeedbacks() {
  const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
  const tbody = document.querySelector("#tabelaFeedbacks tbody");
  tbody.innerHTML = "";

  feedbacks.forEach((f, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${f.nome}</td>
      <td>${f.comentario}</td>
      <td>${f.estrelas} ⭐</td>
      <td>
        <button class="btn reply" onclick="responderFeedback(${i})">Responder</button>
        <button class="btn delete" onclick="excluirFeedback(${i})">Excluir</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

function responderFeedback(index) {
  const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
  const resposta = prompt("Digite a resposta para este feedback:");
  if (resposta) {
    feedbacks[index].resposta = resposta;
    localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
    alert("Resposta adicionada!");
  }
  carregarFeedbacks();
}

function excluirFeedback(index) {
  if (confirm("Excluir este feedback?")) {
    const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
    feedbacks.splice(index, 1);
    localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
    carregarFeedbacks();
  }
}

/*********** RELATÓRIOS ***********/
function baixarRelatorio(periodo) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
  const hoje = new Date();
  const filtrados = agendamentos.filter(a => {
    const dataAgendamento = new Date(a.data);
    const diffDias = (hoje - dataAgendamento) / (1000 * 60 * 60 * 24);
    if (periodo === "diario") return diffDias < 1;
    if (periodo === "semanal") return diffDias < 7;
    if (periodo === "mensal") return diffDias < 30;
  });

  doc.setFontSize(16);
  doc.text(`Relatório ${periodo.toUpperCase()} - Barbearia`, 10, 20);
  let y = 30;
  let total = 0;
  filtrados.forEach(a => {
    doc.setFontSize(12);
    doc.text(`${a.nome} | ${a.servicos.join(", ")} | R$${a.valor} | ${a.horario}`, 10, y);
    y += 10;
    total += a.valor;
  });
  doc.text(`\nTotal: R$${total}`, 10, y + 10);
  doc.save(`relatorio_${periodo}.pdf`);
}
