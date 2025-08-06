import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ReligionSelectionProps {
  userId: string;
  onReligionSelected: () => void;
}

interface ReligionOption {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  image: string;
}

const religions: ReligionOption[] = [
  {
    id: "buddhism",
    name: "佛教修行",
    subtitle: "慈悲為懷・智慧增長",
    description: "通過冥想、經文學習，培養內心平靜與智慧",
    icon: "🏯",
    color: "warm-gold",
    image: "https://images.unsplash.com/photo-1604608672516-da2c2cdd5385?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
  },
  {
    id: "taoism", 
    name: "道教養生",
    subtitle: "順應自然・修身養性",
    description: "學習陰陽平衡，與天地自然和諧共處",
    icon: "☯️",
    color: "sage-green",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
  },
  {
    id: "mazu",
    name: "媽祖護佑", 
    subtitle: "慈悲濟世・護佑平安",
    description: "學習媽祖慈悲精神，關愛他人服務社群",
    icon: "🌊",
    color: "ocean-blue",
    image: "https://images.unsplash.com/photo-1586205076270-e4e3f2c5c3e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
  },
];

export default function ReligionSelection({ userId, onReligionSelected }: ReligionSelectionProps) {
  const [selectedReligion, setSelectedReligion] = useState<string | null>(null);
  const { toast } = useToast();

  const selectReligionMutation = useMutation({
    mutationFn: async (religion: string) => {
      const response = await apiRequest('PUT', `/api/user/${userId}/religion`, { religion });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "信仰選擇完成",
        description: "歡迎開始您的修行之路！",
      });
      onReligionSelected();
    },
    onError: () => {
      toast({
        title: "選擇失敗",
        description: "請重新嘗試選擇您的信仰",
        variant: "destructive",
      });
    },
  });

  const handleReligionSelect = (religionId: string) => {
    setSelectedReligion(religionId);
    selectReligionMutation.mutate(religionId);
  };

  return (
    <div className="fade-in" data-testid="religion-selection">
      <div className="text-center mb-8">
        <h2 className="text-elderly-2xl md:text-elderly-3xl font-semibold text-gray-800 mb-4">
          選擇您的信仰之路
        </h2>
        <p className="text-elderly-base text-warm-gray-600 max-w-2xl mx-auto">
          請選擇與您心靈最接近的信仰，我們將為您打造專屬的修行體驗
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {religions.map((religion) => (
          <Card
            key={religion.id}
            className={`card-hover cursor-pointer border-2 transition-all duration-300 ${
              selectedReligion === religion.id 
                ? `border-${religion.color} shadow-lg` 
                : 'border-transparent hover:border-warm-gold'
            }`}
            onClick={() => handleReligionSelect(religion.id)}
            data-testid={`card-religion-${religion.id}`}
          >
            <CardContent className="p-8">
              <img 
                src={religion.image} 
                alt={religion.name}
                className="w-full h-32 object-cover rounded-xl mb-6"
              />
              
              <div className="text-center">
                <div className={`w-16 h-16 bg-${religion.color} bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-2xl">{religion.icon}</span>
                </div>
                
                <h3 className="text-elderly-xl font-semibold text-gray-800 mb-3">
                  {religion.name}
                </h3>
                
                <p className="text-elderly-base text-warm-gray-600 mb-4 font-medium">
                  {religion.subtitle}
                </p>
                
                <p className="text-elderly-sm text-warm-gray-600 leading-relaxed">
                  {religion.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {selectReligionMutation.isPending && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="w-16 h-16 border-4 border-warm-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-elderly-lg text-gray-800">正在設定您的修行之路...</p>
          </div>
        </div>
      )}
    </div>
  );
}
