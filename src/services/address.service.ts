export interface AddressLookup { cep: string; logradouro: string; complemento: string; bairro: string; localidade: string; uf: string; ibge: string; erro?: boolean; }
export async function lookupAddressByCep(cep: string): Promise<AddressLookup> {
  const clean = cep.replace(/\D/g, '');
  if (clean.length !== 8) throw new Error('Informe um CEP válido com 8 dígitos.');
  const response = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
  if (!response.ok) throw new Error('Não foi possível consultar o CEP.');
  const data = (await response.json()) as AddressLookup;
  if (data.erro) throw new Error('CEP não encontrado.');
  if (data.ibge) {
    const municipality = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${data.ibge}`);
    if (!municipality.ok) throw new Error('Município não encontrado na base do IBGE.');
  }
  return data;
}
