import { Bell, AlertCircle, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/contexts/NotificationContext";

export function NotificationDropdown() {
  const { notifications, removeNotification } = useNotifications();

  const getNotificationIcon = (text: string) => {
    if (text.toLowerCase().includes('parabéns') || text.toLowerCase().includes('meta')) {
      return <AlertCircle className="h-4 w-4 text-green-600" />;
    }
    if (text.toLowerCase().includes('agenda') || text.toLowerCase().includes('lembre')) {
      return <Info className="h-4 w-4 text-blue-600" />;
    }
    return <Info className="h-4 w-4 text-amber-600" />;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {notifications.length > 0 && (
            <Badge
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
            >
              {notifications.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-sm">Notificações</h3>
          {notifications.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {notifications.length} nova{notifications.length !== 1 ? 's' : ''} notificaç{notifications.length !== 1 ? 'ões' : 'ão'}
            </p>
          )}
        </div>
        
        <div className="max-h-64 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Nenhuma notificação nova
            </div>
          ) : (
            notifications.map((notification, index) => (
              <div
                key={index}
                className="p-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {getNotificationIcon(notification)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground leading-relaxed">
                      {notification}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => removeNotification(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}