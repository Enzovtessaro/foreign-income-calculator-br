
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Calculator, DollarSign, Building2, User } from "lucide-react";
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

  return <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Foreign Income Section */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-800">
                Valor Contratado
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="foreignAmount">Valor em Moeda Estrangeira</Label>
                <div className="flex gap-2">
                  <Select value={formData.currency} onValueChange={value => setFormData(prev => ({
                  ...prev,
                  currency: value
                }))}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map(curr => <SelectItem key={curr.value} value={curr.value}>
                          {curr.value}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                  
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                      {getCurrencySymbol(formData.currency)}
                    </span>
                    <Input id="foreignAmount" type="number" step="0.01" value={formData.foreignAmount || ""} onChange={e => setFormData(prev => ({
                    ...prev,
                    foreignAmount: parseFloat(e.target.value) || 0
                  }))} className="text-lg pl-8" placeholder="0.00" required />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PJ Configuration Section */}
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-green-800">
                Configuração da PJ
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="proLabore">Pró-Labore Mensal (R$)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    R$
                  </span>
                  <Input id="proLabore" type="number" step="0.01" value={formData.proLabore || ""} onChange={e => setFormData(prev => ({
                  ...prev,
                  proLabore: parseFloat(e.target.value) || 0
                }))} className="pl-8" placeholder="0.00" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Deixe em branco ou zero para distribuição de lucros isenta
                </p>
              </div>

              <div>
                <Label htmlFor="municipality">Município (opcional)</Label>
                <Input id="municipality" value={formData.municipality} onChange={e => setFormData(prev => ({
                ...prev,
                municipality: e.target.value
              }))} placeholder="Ex: São Paulo" />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="contributeINSS" 
                  checked={formData.contributeINSS}
                  onCheckedChange={(checked) => setFormData(prev => ({
                    ...prev,
                    contributeINSS: checked === true
                  }))}
                />
                <Label htmlFor="contributeINSS" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Contribuir para o INSS
                </Label>
              </div>
              <p className="text-xs text-gray-500">
                ISS: 2% (taxa padrão aplicada automaticamente)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button type="submit" size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg px-12 py-6" disabled={loading}>
          {loading ? <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              Calculando...
            </> : <>
              <Calculator className="mr-2 h-5 w-5" />
              Calcular Impostos
            </>}
        </Button>
      </div>
    </form>;
};
