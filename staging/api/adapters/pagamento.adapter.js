async function process({ session_id, data, sessionMgr }) {
  if (!data || !data.valor) throw new Error("data.valor obrigatorio");
  return { tipo: "pagamento", valor: data.valor, metodo: data.metodo || "nao_informado", status: "pendente" };
}
module.exports = { process };
