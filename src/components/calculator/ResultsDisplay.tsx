
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Trophy, AlertCircle } from "lucide-react";
import { CalculationResults, CalculatorData } from "../Calculator";
import { formatCurrency } from "@/utils/formatters";

interface ResultsDisplayProps {
  results: CalculationResults;
  data: CalculatorData;
}

export const ResultsDisplay = ({ results, data }: ResultsDisplayProps) => {
  const bestOption = results.simplesNacional.netAmount > results.lucroPresumido.netAmount 
    ? "simples" : "presumido";

  const difference = Math.abs(
    results.simplesNacional.netAmount - results.lucroPresumido.netAmount
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-slate-600 mb-2">
              {formatCurrency(results.grossBRL)}
            </div>
            <div className="text-sm text-slate-500">
              Valor Bruto em R$
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {data.foreignAmount.toLocaleString()} {data.currency} × {data.exchangeRate.toFixed(4)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {formatCurrency(results.receivedByPJ)}
            </div>
            <div className="text-sm text-blue-500">
              Recebido pela PJ
            </div>
            <div className="text-xs text-blue-400 mt-1">
              Após taxa de câmbio (0,5%)
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {formatCurrency(difference)}
            </div>
            <div className="text-sm text-green-500">
              Diferença entre Regimes
            </div>
            <div className="text-xs text-green-400 mt-1">
              Economia potencial
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparison */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Simples Nacional */}
        <Card className={`${bestOption === "simples" ? "ring-2 ring-green-500 bg-green-50" : "bg-white"}`}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-blue-700">
                Simples Nacional
              </CardTitle>
              {bestOption === "simples" && (
                <Badge className="bg-green-500 text-white">
                  <Trophy className="w-3 h-3 mr-1" />
                  Melhor Opção
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600 mb-1">Fator R</div>
              <div className="text-lg font-semibold text-blue-800">
                {results.simplesNacional.fatorR.toFixed(1)}%
              </div>
              <div className="text-xs text-blue-500">
                {results.simplesNacional.anexo} - Alíquota: {results.simplesNacional.aliquota}%
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Impostos PJ:</span>
                <span className="font-medium text-red-600">
                  -{formatCurrency(results.simplesNacional.pjTax)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Impostos PF:</span>
                <span className="font-medium text-red-600">
                  -{formatCurrency(results.simplesNacional.pfTax)}
                </span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Valor Líquido:</span>
                <span className="text-green-600">
                  {formatCurrency(results.simplesNacional.netAmount)}
                </span>
              </div>
            </div>

            <div className="text-center">
              <TrendingUp className="w-6 h-6 mx-auto text-blue-500 mb-2" />
              <div className="text-sm text-slate-500">
                Alíquota efetiva: {((results.simplesNacional.pjTax + results.simplesNacional.pfTax) / results.receivedByPJ * 100).toFixed(2)}%
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lucro Presumido */}
        <Card className={`${bestOption === "presumido" ? "ring-2 ring-green-500 bg-green-50" : "bg-white"}`}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-green-700">
                Lucro Presumido
              </CardTitle>
              {bestOption === "presumido" && (
                <Badge className="bg-green-500 text-white">
                  <Trophy className="w-3 h-3 mr-1" />
                  Melhor Opção
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-600 mb-1">Impostos PJ</div>
              <div className="text-xs text-green-500 space-y-1">
                <div>IRPJ: {formatCurrency(results.lucroPresumido.irpj)}</div>
                <div>CSLL: {formatCurrency(results.lucroPresumido.csll)}</div>
                <div>ISS: {formatCurrency(results.lucroPresumido.iss)}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Impostos PJ:</span>
                <span className="font-medium text-red-600">
                  -{formatCurrency(results.lucroPresumido.pjTax)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Impostos PF:</span>
                <span className="font-medium text-red-600">
                  -{formatCurrency(results.lucroPresumido.pfTax)}
                </span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Valor Líquido:</span>
                <span className="text-green-600">
                  {formatCurrency(results.lucroPresumido.netAmount)}
                </span>
              </div>
            </div>

            <div className="text-center">
              <TrendingDown className="w-6 h-6 mx-auto text-green-500 mb-2" />
              <div className="text-sm text-slate-500">
                Alíquota efetiva: {((results.lucroPresumido.pjTax + results.lucroPresumido.pfTax) / results.receivedByPJ * 100).toFixed(2)}%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendation */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-amber-800 mb-2">
                Recomendação Baseada no Cálculo
              </h3>
              <p className="text-amber-700 text-sm">
                Com base nos dados informados, o regime <strong>
                {bestOption === "simples" ? "Simples Nacional" : "Lucro Presumido"}
                </strong> seria mais vantajoso, proporcionando uma economia de <strong>
                {formatCurrency(difference)}
                </strong> em relação ao outro regime.
              </p>
              <p className="text-amber-600 text-xs mt-2">
                ⚠️ Lembre-se: esta é apenas uma simulação. Consulte sempre um contador 
                especializado para uma análise completa da sua situação específica.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
