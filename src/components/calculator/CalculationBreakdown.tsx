
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalculationResults, CalculatorData } from "../Calculator";
import { formatCurrency } from "@/utils/formatters";

interface CalculationBreakdownProps {
  results: CalculationResults;
  data: CalculatorData;
}

export const CalculationBreakdown = ({ results, data }: CalculationBreakdownProps) => {
  return (
    <div className="space-y-6">
      {/* Currency Conversion */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-700">
            1. Conversão de Moeda
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm font-medium mb-2">Cálculo:</div>
            <div className="font-mono text-sm">
              {data.foreignAmount.toLocaleString()} {data.currency} × {data.exchangeRate.toFixed(4)} = {formatCurrency(results.grossBRL)}
            </div>
          </div>
          <div className="text-sm text-slate-600">
            <strong>Valor Bruto em R$:</strong> {formatCurrency(results.grossBRL)}
          </div>
        </CardContent>
      </Card>

      {/* Platform Fees */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-700">
            2. Custos de Recebimento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-3 rounded">
              <div className="text-sm font-medium text-green-700">IOF</div>
              <div className="text-lg font-bold text-green-600">0%</div>
              <div className="text-xs text-green-500">Isento para exportação de serviços</div>
            </div>
            <div className="bg-red-50 p-3 rounded">
              <div className="text-sm font-medium text-red-700">Taxa Plataforma</div>
              <div className="text-lg font-bold text-red-600">0,5%</div>
              <div className="text-xs text-red-500">{formatCurrency(results.platformFee)}</div>
            </div>
          </div>
          <div className="text-sm text-slate-600">
            <strong>Valor Recebido pela PJ:</strong> {formatCurrency(results.receivedByPJ)}
          </div>
        </CardContent>
      </Card>

      {/* Tax Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Simples Nacional Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-blue-700">
              3. Simples Nacional - Detalhamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm font-medium mb-2">Fator R:</div>
              <div className="font-mono text-sm mb-2">
                (Pró-Labore × 12) ÷ Faturamento Anual × 100
              </div>
              <div className="font-mono text-sm">
                ({formatCurrency(data.proLabore)} × 12) ÷ ({formatCurrency(results.receivedByPJ)} × 12) × 100 = {results.simplesNacional.fatorR.toFixed(1)}%
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={results.simplesNacional.fatorR >= 28 ? "default" : "secondary"}>
                  {results.simplesNacional.anexo}
                </Badge>
                <span className="text-sm">
                  Alíquota: {results.simplesNacional.aliquota}%
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded">
                <div className="text-sm text-slate-600 mb-1">Impostos PJ (Simples):</div>
                <div className="font-semibold">{formatCurrency(results.simplesNacional.pjTax)}</div>
              </div>

              <div className="bg-slate-50 p-3 rounded">
                <div className="text-sm text-slate-600 mb-1">Impostos PF (INSS + IRPF):</div>
                <div className="font-semibold">{formatCurrency(results.simplesNacional.pfTax)}</div>
              </div>

              <div className="bg-green-50 p-3 rounded border border-green-200">
                <div className="text-sm text-green-700 mb-1">Valor Líquido Final:</div>
                <div className="text-xl font-bold text-green-600">
                  {formatCurrency(results.simplesNacional.netAmount)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lucro Presumido Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-green-700">
              3. Lucro Presumido - Detalhamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm font-medium mb-2">Impostos PJ:</div>
              <div className="space-y-1 text-sm">
                <div>• PIS e COFINS: <span className="text-green-600 font-medium">0%</span> (exportação)</div>
                <div>• IRPJ: {formatCurrency(results.lucroPresumido.irpj)}</div>
                <div>• CSLL: {formatCurrency(results.lucroPresumido.csll)}</div>
                <div>• ISS ({data.issRate}%): {formatCurrency(results.lucroPresumido.iss)}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="bg-slate-50 p-3 rounded">
                <div className="text-sm text-slate-600 mb-1">Total Impostos PJ:</div>
                <div className="font-semibold">{formatCurrency(results.lucroPresumido.pjTax)}</div>
              </div>

              <div className="bg-slate-50 p-3 rounded">
                <div className="text-sm text-slate-600 mb-1">Impostos PF:</div>
                <div className="font-semibold">{formatCurrency(results.lucroPresumido.pfTax)}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {data.proLabore > 0 
                    ? "INSS + IRPF sobre pró-labore" 
                    : "Distribuição de lucros (isenta)"}
                </div>
              </div>

              <div className="bg-green-50 p-3 rounded border border-green-200">
                <div className="text-sm text-green-700 mb-1">Valor Líquido Final:</div>
                <div className="text-xl font-bold text-green-600">
                  {formatCurrency(results.lucroPresumido.netAmount)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formula Summary */}
      <Card className="bg-slate-50">
        <CardHeader>
          <CardTitle className="text-lg text-slate-700">
            Fórmula Final
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="font-mono text-sm bg-white p-4 rounded border">
            <div className="mb-2 text-slate-600">Salário Líquido Final =</div>
            <div className="ml-4">Valor Recebido na PJ</div>
            <div className="ml-4">- Impostos PJ</div>
            <div className="ml-4">- Impostos PF sobre Pró-Labore/Lucros</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
