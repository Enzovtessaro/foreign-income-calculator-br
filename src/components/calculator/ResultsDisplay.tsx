
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, DollarSign, Receipt, Percent } from "lucide-react";
import { CalculationResults, CalculatorData } from "../Calculator";
import { formatCurrency } from "@/utils/formatters";

interface ResultsDisplayProps {
  results: CalculationResults;
  data: CalculatorData;
}

export const ResultsDisplay = ({ results, data }: ResultsDisplayProps) => {
  // Determine which regime to show based on pro-labore
  const showSimplesNacional = data.proLabore > 0;
  const showLucroPresumido = data.proLabore === 0;

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-slate-50 border-slate-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-500">Valor Bruto</span>
              </div>
              <div className="text-xl font-bold text-slate-700">
                {formatCurrency(results.grossBRL)}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {data.foreignAmount.toLocaleString()} {data.currency}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Receipt className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-blue-500">Recebido PJ</span>
              </div>
              <div className="text-xl font-bold text-blue-600">
                {formatCurrency(results.receivedByPJ)}
              </div>
              <div className="text-xs text-blue-400 mt-1">
                Taxa: {formatCurrency(results.platformFee)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Percent className="w-4 h-4 text-green-500" />
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-green-500">Alíquota Efetiva</span>
                      <Info className="w-3 h-3" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Percentual total de impostos sobre o valor recebido</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="text-xl font-bold text-green-600">
                {showSimplesNacional && 
                  `${((results.simplesNacional.pjTax + results.simplesNacional.pfTax) / results.receivedByPJ * 100).toFixed(1)}%`
                }
                {showLucroPresumido && 
                  `${((results.lucroPresumido.pjTax + results.lucroPresumido.pfTax) / results.receivedByPJ * 100).toFixed(1)}%`
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Regime Result */}
        <div className="flex justify-center">
          {showSimplesNacional && (
            <Card className="w-full max-w-md bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Badge className="bg-blue-500 text-white">
                    Simples Nacional
                  </Badge>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-blue-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        <p>Fator R: {results.simplesNacional.fatorR.toFixed(1)}%</p>
                        <p>{results.simplesNacional.anexo}</p>
                        <p>Alíquota: {results.simplesNacional.aliquota}%</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Impostos PJ:</span>
                    <span className="text-red-600">-{formatCurrency(results.simplesNacional.pjTax)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>INSS + IRPF:</span>
                    <span className="text-red-600">-{formatCurrency(results.simplesNacional.pfTax)}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Líquido Final:</span>
                    <span className="text-green-600">
                      {formatCurrency(results.simplesNacional.netAmount)}
                    </span>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <div className="text-2xl font-bold text-blue-700">
                    {formatCurrency(results.simplesNacional.netAmount)}
                  </div>
                  <div className="text-sm text-blue-500 mt-1">
                    Valor para sua conta pessoal
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {showLucroPresumido && (
            <Card className="w-full max-w-md bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Badge className="bg-green-500 text-white">
                    Lucro Presumido
                  </Badge>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-green-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        <p>IRPJ: {formatCurrency(results.lucroPresumido.irpj)}</p>
                        <p>CSLL: {formatCurrency(results.lucroPresumido.csll)}</p>
                        <p>ISS: {formatCurrency(results.lucroPresumido.iss)}</p>
                        <p>Distribuição isenta de IR</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Impostos PJ:</span>
                    <span className="text-red-600">-{formatCurrency(results.lucroPresumido.pjTax)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Impostos PF:</span>
                    <span className="text-green-600">{formatCurrency(0)}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Líquido Final:</span>
                    <span className="text-green-600">
                      {formatCurrency(results.lucroPresumido.netAmount)}
                    </span>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <div className="text-2xl font-bold text-green-700">
                    {formatCurrency(results.lucroPresumido.netAmount)}
                  </div>
                  <div className="text-sm text-green-500 mt-1">
                    Distribuição de lucros (isenta)
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Disclaimer */}
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-700">
                <p className="font-semibold mb-1">Simulação Estimativa</p>
                <p>Esta calculadora fornece estimativas baseadas nos dados informados. Para orientação precisa, consulte um contador especializado.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};
