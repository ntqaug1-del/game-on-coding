import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dice1, ArrowLeft, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '@/components/Footer';

interface DiceResult {
  value: number;
  isRolling: boolean;
}

const DiceRoller: React.FC = () => {
  const [diceType, setDiceType] = useState<string>('d6');
  const [quantity, setQuantity] = useState<number>(1);
  const [results, setResults] = useState<DiceResult[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [modifier, setModifier] = useState<string>('0');
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);

  const diceTypes = [
    { value: 'd4', label: 'd4 (4-sided)' },
    { value: 'd6', label: 'd6 (6-sided)' },
    { value: 'd8', label: 'd8 (8-sided)' },
    { value: 'd10', label: 'd10 (10-sided)' },
    { value: 'd12', label: 'd12 (12-sided)' },
    { value: 'd20', label: 'd20 (20-sided)' },
    { value: 'd100', label: 'd100 (100-sided)' }
  ];

  const rollDice = () => {
    setIsRolling(true);
    const sides = parseInt(diceType.substring(1));
    const newResults: DiceResult[] = Array(quantity).fill(0).map(() => ({
      value: 0,
      isRolling: true
    }));
    setResults(newResults);

    // Simulate rolling animation
    const rollInterval = setInterval(() => {
      setResults(prevResults => 
        prevResults.map(() => ({
          value: Math.floor(Math.random() * sides) + 1,
          isRolling: true
        }))
      );
    }, 100);

    // Stop rolling after 1.5 seconds
    setTimeout(() => {
      clearInterval(rollInterval);
      const finalResults = Array(quantity).fill(0).map(() => ({
        value: Math.floor(Math.random() * sides) + 1,
        isRolling: false
      }));
      setResults(finalResults);
      const sum = finalResults.reduce((acc, curr) => acc + curr.value, 0);
      const modifierValue = parseInt(modifier) || 0;
      setTotal(sum + modifierValue);
      setIsRolling(false);
    }, 1500);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 10) {
      setQuantity(value);
    }
  };

  const handleModifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string, minus sign, or numbers
    if (value === '' || value === '-' || /^-?\d*$/.test(value)) {
      setModifier(value);
      if (value === '' || value === '-') {
        setTotal(results.reduce((acc, curr) => acc + curr.value, 0));
      } else {
        const modifierValue = parseInt(value) || 0;
        setTotal(results.reduce((acc, curr) => acc + curr.value, 0) + modifierValue);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex flex-col">
      <div className="flex-grow">
        <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-12">
          <div className="mb-4 sm:mb-6">
            <Button asChild variant="ghost" className="mb-4 sm:mb-8 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg transform hover:scale-[1.02] transition-all duration-200">
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
          
          <div className="bg-white/80 rounded-xl p-4 sm:p-8 shadow-2xl max-w-4xl mx-auto backdrop-blur-md border border-orange-100">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center">
                <div className="relative h-16 w-16 sm:h-20 sm:w-20 mr-3 sm:mr-4 text-orange-600">
                  <Dice1 className="w-full h-full" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-orange-900">Dice Roller</h1>
                  <p className="text-sm sm:text-base text-orange-700 mt-1">Roll virtual dice for your tabletop games</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></div>
                <span className="text-sm text-orange-700">Ready to roll</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-orange-900">Dice Type</Label>
                  <Select value={diceType} onValueChange={setDiceType}>
                    <SelectTrigger className="w-full bg-white/90 border-orange-200 text-orange-900 hover:border-orange-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200">
                      <SelectValue placeholder="Select dice type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-orange-200 shadow-lg">
                      {diceTypes.map(type => (
                        <SelectItem 
                          key={type.value} 
                          value={type.value}
                          className="text-orange-900 hover:bg-orange-50 focus:bg-orange-50 focus:text-orange-900 cursor-pointer"
                        >
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-orange-900">Quantity (1-10)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-full bg-white/90 border-orange-200 text-orange-900 placeholder-orange-400 hover:border-orange-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    placeholder="Enter quantity"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-orange-900">Modifier</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-orange-400" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-white border-orange-200 text-orange-900">
                          <p>Add or subtract from the total (e.g., +2 or -1)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    type="text"
                    value={modifier}
                    onChange={handleModifierChange}
                    className="w-full bg-white/90 border-orange-200 text-orange-900 placeholder-orange-400 hover:border-orange-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    placeholder="Enter modifier"
                  />
                </div>
                
                <Button
                  onClick={rollDice}
                  disabled={isRolling}
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                >
                  {isRolling ? 'Rolling...' : 'Roll Dice!'}
                </Button>
              </div>
              
              <div className="flex flex-col items-center justify-center">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                  {results.map((result, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`relative h-20 w-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-white text-3xl font-bold transition-all duration-300 shadow-lg ${
                        result.isRolling ? 'animate-pulse' : ''
                      }`}
                    >
                      {result.value}
                    </motion.div>
                  ))}
                </div>
                
                {results.length > 0 && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <p className="text-xl font-semibold text-orange-900">
                      Total: {results.reduce((acc, curr) => acc + curr.value, 0)}
                      {modifier !== '0' && modifier !== '' && (
                        <span className="text-orange-700">
                          {modifier.startsWith('-') ? ` ${modifier}` : ` + ${modifier}`} = {total}
                        </span>
                      )}
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DiceRoller;
