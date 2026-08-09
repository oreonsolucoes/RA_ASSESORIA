// ============================================================
// documento-br.js
// Validação (dígito verificador) e formatação de CPF e CNPJ.
// Sem dependências externas. Usado em empresas, funcionários e cadastro.
// ============================================================

// Remove tudo que não for dígito
export function apenasDigitos(v) {
  return (v || "").replace(/\D/g, "");
}

// ---------- CPF ----------
export function validarCPF(valor) {
  const cpf = apenasDigitos(valor);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false; // todos iguais (000..., 111...)

  const calcDig = (base, pesoInicial) => {
    let soma = 0;
    for (let i = 0; i < base.length; i++) {
      soma += parseInt(base[i], 10) * (pesoInicial - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  const d1 = calcDig(cpf.slice(0, 9), 10);
  if (d1 !== parseInt(cpf[9], 10)) return false;
  const d2 = calcDig(cpf.slice(0, 10), 11);
  if (d2 !== parseInt(cpf[10], 10)) return false;
  return true;
}

export function formatarCPF(valor) {
  const c = apenasDigitos(valor).slice(0, 11);
  return c
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

// ---------- CNPJ ----------
export function validarCNPJ(valor) {
  const cnpj = apenasDigitos(valor);
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  const calcDig = (base) => {
    // pesos começam em 5 (ou 6) e descem até 2, ciclando
    let peso = base.length - 7;
    let soma = 0;
    for (let i = 0; i < base.length; i++) {
      soma += parseInt(base[i], 10) * peso;
      peso--;
      if (peso < 2) peso = 9;
    }
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const d1 = calcDig(cnpj.slice(0, 12));
  if (d1 !== parseInt(cnpj[12], 10)) return false;
  const d2 = calcDig(cnpj.slice(0, 13));
  if (d2 !== parseInt(cnpj[13], 10)) return false;
  return true;
}

export function formatarCNPJ(valor) {
  const c = apenasDigitos(valor).slice(0, 14);
  return c
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}
