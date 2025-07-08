
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, ArrowRight } from "lucide-react";
import { CalculationResults, CalculatorData } from "../Calculator";
import { formatCurrency } from "@/utils/formatters";

interface CalculationBreakdownProps {
  results: CalculationResults;
  data: CalculatorData;
}

export const CalculationBreakdown = ({ results, data }: CalculationBreakdownProps) => {
  const showSimplesNacional = data.proLabore > 0;
  const showLucroPresumido = data.proLabore === 0;

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Step 1: Currency Conversion */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
              Conversão de Moeda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg">
              <div className="text-center">
                <div className="text-sm text-slate-500">Valor Original</div>
                <div className="font-bold">{data.foreignAmount.toLocaleString()} {data.currency}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <div className="text-center">
                <div className="text-sm text-slate-500">Taxa: {data.exchangeRate.toFixed(4)}</div>
                <div className="font-bold text-blue-600">{formatCurrency(results.grossBRL)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Platform Fees */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
              Custos de Recebimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="text-sm font-medium text-green-700">IOF</div>
                <div className="text-lg font-bold text-green-600">0%</div>
                <div className="text-xs text-green-500">Isento (exportação)</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg text-center">
                <div className="text-sm font-medium text-red-700">Taxa Plataforma</div>
                <div className="text-lg font-bold text-red-600">0,5%</div>
                <div className="text-xs text-red-500">{formatCurrency(results.platformFee)}</div>
              </div>
            </div>
            <div className="mt-3 p-3 bg-blue-50 rounded-lg text-center">
              <div className="text-sm text-blue-600">Valor Recebido na PJ</div>
              <div className="text-xl font-bold text-blue-700">{formatCurrency(results.receivedByPJ)}</div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Tax Calculation */}
        {showSimplesNacional && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
                Cálculo Simples Nacional
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-slate-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Baseado no Fator R (pró-labore vs faturamento)</p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm font-medium mb-2">Fator R: {results.simplesNacional.fatorR.toFixed(1)}%</div>
                <div className="flex items-center gap-2">
                  <Badge variant={results.simplesNacional.fatorR >= 28 ? "default" : "secondary"}>
                    {results.simplesNacional.anexo}
                  </Badge>
                  <span className="text-sm">Alíquota: {results.simplesNacional.aliquota}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="text-sm text-slate-600 mb-1">Impostos PJ</div>
                  <div className="font-bold text-red-600">{formatCurrency(results.simplesNacional.pjTax)}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="text-sm text-slate-600 mb-1">INSS + IRPF</div>
                  <div className="font-bold text-red-600">{formatCurrency(results.simplesNacional.pfTax)}</div>
                </div>
              </div>

              <div className="bg-green-50 p-3 rounded-lg text-center border border-green-200">
                <div className="text-sm text-green-700 mb-1">Valor Líquido Final</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(results.simplesNacional.netAmount)}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {showLucroPresumido && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
                Cálculo Lucro Presumido
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-slate-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Distribuição de lucros é isenta de IR para PF</p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm font-medium mb-2">Composição dos Impostos PJ:</div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>IRPJ: {formatCurrency(results.lucroPresumido.irpj)}</div>
                  <div>CSLL: {formatCurrency(results.lucroPresumido.csll)}</div>
                  <div>ISS: {formatCurrency(results.lucroPresumido.iss)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="text-sm text-slate-600 mb-1">Total Impostos PJ</div>
                  <div className="font-bold text-red-600">{formatCurrency(results.lucroPresumido.pjTax)}</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-sm text-green-600 mb-1">Impostos PF</div>
                  <div className="font-bold text-green-600">{formatCurrency(0)}</div>
                  <div className="text-xs text-green-500">Distribuição isenta</div>
                </div>
              </div>

              <div className="bg-green-50 p-3 rounded-lg text-center border border-green-200">
                <div className="text-sm text-green-700 mb-1">Valor Líquido Final</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(results.lucroPresumido.netAmount)}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
};
