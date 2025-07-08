import { Calculator } from "@/components/Calculator";
const Index = () => {
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Calculadora PJ Exterior
          </h1>
          
          <p className="text-lg text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Presta serviços para empresas estrangeiras? Entenda quanto realmente sobra no seu bolso, 
            considerando impostos e taxas, e compare os regimes do Simples Nacional e Lucro Presumido.
          </p>
        </div>

        {/* Calculator */}
        <Calculator />

        {/* How it works section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h3 className="text-3xl font-bold text-slate-800 mb-8 text-center">
            Como Nossa Calculadora Funciona?
          </h3>
          <div className="prose prose-lg max-w-none text-slate-600">
            <p className="mb-6">
              Nossa ferramenta foi desenvolvida para desmistificar a complexidade de trabalhar como 
              Pessoa Jurídica (PJ) para o exterior. Com ela, você simula o seu faturamento em moeda 
              estrangeira e descobre o valor líquido final em Reais, após a dedução de todas as taxas 
              de câmbio e impostos no Brasil.
            </p>
            <p className="mb-8">
              É simples assim: você informa alguns dados, e a calculadora faz todo o trabalho pesado, 
              apresentando uma comparação clara entre os dois regimes tributários mais comuns para 
              prestadores de serviços: o Simples Nacional e o Lucro Presumido.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
              <h4 className="text-xl font-semibold text-blue-800 mb-4">
                Simples Nacional
              </h4>
              <ul className="text-slate-700 space-y-2">
                <li>• Análise do Fator R (Pró-Labore vs Faturamento)</li>
                <li>• Anexo III (≥28%) ou Anexo V (&lt;28%)</li>
                <li>• Alíquotas simplificadas</li>
                <li>• INSS e IRPF sobre Pró-Labore</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
              <h4 className="text-xl font-semibold text-green-800 mb-4">
                Lucro Presumido
              </h4>
              <ul className="text-slate-700 space-y-2">
                <li>• PIS e COFINS zerados (exportação)</li>
                <li>• IRPJ e CSLL sobre lucro presumido (32%)</li>
                <li>• ISS municipal (2% a 5%)</li>
                <li>• Distribuição de lucros isenta de IR</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-amber-800 mb-3">
              ⚠️ Importante
            </h4>
            <p className="text-amber-700">
              Esta calculadora é uma simulação e fornece estimativas com base nos dados informados. 
              As regras tributárias podem ser complexas e exigem análise profissional. Para uma 
              orientação precisa e personalizada para sua situação, consulte um contador especializado!
            </p>
          </div>
        </div>
      </div>
    </div>;
};
export default Index;