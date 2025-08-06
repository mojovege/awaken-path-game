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
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImJnR3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRkZENzAwIi8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0Y1OTUwMCIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ1cmwoI2JnR3JhZGllbnQpIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTAwIiBmb250LXNpemU9IjQ4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj7wn4+vPC90ZXh0Pgo8L3N2Zz4=",
  },
  {
    id: "taoism", 
    name: "道教養生",
    subtitle: "順應自然・修身養性",
    description: "學習陰陽平衡，與天地自然和諧共處",
    icon: "☯️",
    color: "sage-green",
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InRhb0dyYWRpZW50IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzZCN0I4NCIvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM0QTVCNjgiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0idXJsKCN0YW9HcmFkaWVudCkiLz4KPHN2ZyB4PSIxNzUiIHk9Ijc1IiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEwIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiLz4KPHA+PHBhdGggZD0iTSAxMiAyIEEgMTAgMTAgMCAwIDEgMTIgMjIgQSA1IDUgMCAwIDAgMTIgMTIgQSA1IDUgMCAwIDEgMTIgMiIgZmlsbD0id2hpdGUiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSI3IiByPSIxLjUiIGZpbGw9ImJsYWNrIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iMTciIHI9IjEuNSIgZmlsbD0id2hpdGUiLz4KPC9wYXRoPjwvcD4KPC9zdmc+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPumBk+aVmee+qeeUn+OAgeWxseeUsee9rkYvdGV4dD4KPC9zdmc+",
  },
  {
    id: "mazu",
    name: "媽祖護佑", 
    subtitle: "慈悲濟世・護佑平安",
    description: "學習媽祖慈悲精神，關愛他人服務社群",
    icon: "🌊",
    color: "ocean-blue",
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9Im1henVHcmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMzQjgyRjYiLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMTk1MEE0Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9InVybCgjbWF6dUdyYWRpZW50KSIvPgo8cGF0aCBkPSJNIDUwIDEyMCBRIDEwMCAxMDAgMTUwIDEyMCBRIDIwMCAxNDAgMjUwIDEyMCBRIDMwMCAxMDAgMzUwIDEyMCBMIDM1MCAyMDAgTCA1MCAyMDBaIiBmaWxsPSIjM0U3QkY2IiBvcGFjaXR5PSIwLjciLz4KPHBhdGggZD0iTSAzMCAxNDAgUSA4MCA5MCA4MCA5MCA4MCA5MCA4MCA5MCAyNTAgMTQwIFFRIDE0MCAzMjAgMzAwIDE0MCBMIDM3MCAyMDAgTCAzMCAyMDBaIiBmaWxsPSIjNjY5REZGIiBvcGFjaXR5PSIwLjUiLz4KPHRleHQgeD0iMjAwIiB5PSI2MCIgZm9udC1zaXplPSI0OCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+8J+MijwvdGV4dD4KPHRleHQgeD0iMjAwIiB5PSIxNzAiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+5aqW56WW6K2355Oc44CB6K2355Oc5bmz5a6JPC90ZXh0Pgo8L3N2Zz4=",
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
              <div className={`w-full h-32 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br ${
                religion.id === 'buddhism' ? 'from-yellow-400 to-orange-500' :
                religion.id === 'taoism' ? 'from-green-400 to-blue-500' :
                'from-blue-400 to-purple-500'
              }`}>
                <span className="text-6xl text-white drop-shadow-lg">{religion.icon}</span>
              </div>
              
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
