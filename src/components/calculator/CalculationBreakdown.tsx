
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, ArrowRight, TrendingUp } from "lucide-react";
import { CalculationResults, CalculatorData } from "../Calculator";
import { formatCurrency } from "@/utils/formatters";

interface CalculationBreakdownProps {
  results: CalculationResults;
  data: CalculatorData;
}

export const CalculationBreakdown = ({ results, data }: CalculationBreakdownProps) => {
  const showSimplesNacional = data.proLabore > 0;
  const showLucroPresumido = data.proLabore === 0;
  const currentResults = showSimplesNacional ? results.simplesNacional : results.lucroPresumido;

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Resultado Principal */}
        <Card className="bg-white border-0 shadow-lg rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="h-6 w-6 text-green-600" />
                <Badge className={`text-white px-4 py-2 rounded-full ${showSimplesNacional ? 'bg-blue-600' : 'bg-green-600'}`}>
                  {showSimplesNacional ? 'Simples Nacional' : 'Lucro Presumido'}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <p className="text-lg text-gray-600">Renda Líquida Mensal</p>
                <p className="text-5xl font-bold text-gray-900">
                  {formatCurrency(currentResults.netAmount)}
                </p>
              </div>

              {showSimplesNacional && (
                <div className="flex justify-center items-center gap-4 pt-4">
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Info className="w-4 h-4" />
                        <span>Fator R: {results.simplesNacional.fatorR.toFixed(1)}%</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Relação entre pró-labore e faturamento</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <div className="text-sm text-gray-600">
                    {results.simplesNacional.anexo} • {results.simplesNacional.aliquota}%
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detalhamento do Processo */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">Detalhamento</h3>
          
          {/* Conversão de Moeda */}
          <Card className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">Valor Original</div>
                  <div className="font-semibold text-gray-900">
                    {data.foreignAmount.toLocaleString()} {data.currency}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">Taxa: {data.exchangeRate.toFixed(4)}</div>
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(results.grossBRL)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Custos de Recebimento */}
          <Card className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Custos de Recebimento</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-green-50 p-4 rounded-2xl text-center">
                  <div className="text-sm font-medium text-green-700 mb-1">IOF</div>
                  <div className="text-lg font-bold text-green-600">0%</div>
                  <div className="text-xs text-green-600">Isento</div>
                </div>
                <div className="bg-red-50 p-4 rounded-2xl text-center">
                  <div className="text-sm font-medium text-red-700 mb-1">Taxa Plataforma</div>
                  <div className="text-lg font-bold text-red-600">0,5%</div>
                  <div className="text-xs text-red-600">{formatCurrency(results.platformFee)}</div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl text-center">
                <div className="text-sm text-gray-600 mb-1">Valor Recebido na PJ</div>
                <div className="text-xl font-bold text-gray-900">{formatCurrency(results.receivedByPJ)}</div>
              </div>
            </CardContent>
          </Card>

          {/* Impostos */}
          <Card className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Impostos {showSimplesNacional ? 'Simples Nacional' : 'Lucro Presumido'}
                </h4>
              </div>

              {showSimplesNacional && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <div className="text-sm text-gray-600 mb-1">Impostos PJ</div>
                      <div className="font-bold text-red-600">{formatCurrency(results.simplesNacional.pjTax)}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <div className="text-sm text-gray-600 mb-1">INSS + IRPF</div>
                      <div className="font-bold text-red-600">{formatCurrency(results.simplesNacional.pfTax)}</div>
                    </div>
                  </div>
                </div>
              )}

              {showLucroPresumido && (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <div className="text-sm text-gray-600 mb-3">Composição dos Impostos PJ:</div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-center">
                        <div className="text-xs text-gray-500">IRPJ</div>
                        <div className="font-semibold">{formatCurrency(results.lucroPresumido.irpj)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500">CSLL</div>
                        <div className="font-semibold">{formatCurrency(results.lucroPresumido.csll)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500">ISS</div>
                        <div className="font-semibold">{formatCurrency(results.lucroPresumido.iss)}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <div className="text-sm text-gray-600 mb-1">Total Impostos PJ</div>
                      <div className="font-bold text-red-600">{formatCurrency(results.lucroPresumido.pjTax)}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-2xl">
                      <div className="text-sm text-green-600 mb-1">Impostos PF</div>
                      <div className="font-bold text-green-600">{formatCurrency(0)}</div>
                      <div className="text-xs text-green-600">Distribuição isenta</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Disclaimer */}
        <Card className="bg-amber-50 border border-amber-200 rounded-3xl overflow-hidden">
          <CardContent className="p-6">
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
