
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calculator, DollarSign } from "lucide-react";
import { CalculatorData } from "../Calculator";
import { getCurrencySymbol } from "@/utils/currencyUtils";

interface InputFormProps {
  onCalculate: (data: CalculatorData) => void;
  loading: boolean;
}

export const InputForm = ({
  onCalculate,
  loading
}: InputFormProps) => {
  const [formData, setFormData] = useState<CalculatorData>({
    foreignAmount: 0,
    currency: "USD",
    exchangeRate: 0,
    proLabore: 0,
    municipality: "",
    issRate: 2,
    contributeINSS: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(formData);
  };

  const currencies = [{
    value: "USD",
    label: "USD - Dólar Americano"
  }, {
    value: "EUR",
    label: "EUR - Euro"
  }, {
    value: "GBP",
    label: "GBP - Libra Esterlina"
  }, {
    value: "CAD",
    label: "CAD - Dólar Canadense"
  }, {
    value: "AUD",
    label: "AUD - Dólar Australiano"
  }];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        {/* Valor Contratado */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Valor Contratado
            </h3>
          </div>
          
          <div>
            <Label htmlFor="foreignAmount" className="text-sm font-medium text-gray-700 mb-2 block">
              Valor em Moeda Estrangeira
            </Label>
            <div className="flex gap-3">
              <Select value={formData.currency} onValueChange={value => setFormData(prev => ({
                ...prev,
                currency: value
              }))}>
                <SelectTrigger className="w-24 h-12 rounded-2xl border-gray-200 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {currencies.map(curr => (
                    <SelectItem key={curr.value} value={curr.value}>
                      {curr.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  {getCurrencySymbol(formData.currency)}
                </span>
                <Input 
                  id="foreignAmount" 
                  type="number" 
                  step="0.01" 
                  value={formData.foreignAmount || ""} 
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    foreignAmount: parseFloat(e.target.value) || 0
                  }))} 
                  className="text-lg pl-12 h-12 rounded-2xl border-gray-200 bg-white" 
                  placeholder="0.00" 
                  required 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Configuração da PJ */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Configuração da PJ
          </h3>
          
          <div>
            <Label htmlFor="proLabore" className="text-sm font-medium text-gray-700 mb-2 block">
              Pró-Labore Mensal (R$)
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                R$
              </span>
              <Input 
                id="proLabore" 
                type="number" 
                step="0.01" 
                value={formData.proLabore || ""} 
                onChange={e => setFormData(prev => ({
                  ...prev,
                  proLabore: parseFloat(e.target.value) || 0
                }))} 
                className="pl-12 h-12 rounded-2xl border-gray-200 bg-white" 
                placeholder="0.00" 
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Deixe em branco ou zero para distribuição de lucros isenta
            </p>
          </div>

          <div>
            <Label htmlFor="municipality" className="text-sm font-medium text-gray-700 mb-2 block">
              Município (opcional)
            </Label>
            <Input 
              id="municipality" 
              value={formData.municipality} 
              onChange={e => setFormData(prev => ({
                ...prev,
                municipality: e.target.value
              }))} 
              placeholder="Ex: São Paulo" 
              className="h-12 rounded-2xl border-gray-200 bg-white"
            />
          </div>

          <div className="flex items-center space-x-3">
            <Checkbox 
              id="contributeINSS" 
              checked={formData.contributeINSS}
              onCheckedChange={(checked) => setFormData(prev => ({
                ...prev,
                contributeINSS: checked === true
              }))}
              className="rounded-md"
            />
            <Label htmlFor="contributeINSS" className="text-sm font-medium text-gray-700">
              Contribuir para o INSS
            </Label>
          </div>

          <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-2xl">
            ISS: 2% (taxa padrão aplicada automaticamente)
          </p>
        </div>
      </div>

      <div className="pt-4">
        <Button 
          type="submit" 
          size="lg" 
          className="w-full bg-black hover:bg-gray-800 text-white text-lg py-6 rounded-2xl transition-colors" 
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              Calculando...
            </>
          ) : (
            <>
              <Calculator className="mr-2 h-5 w-5" />
              Calcular Impostos
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
