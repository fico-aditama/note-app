import { Button } from "@/components/ui/button";
import { Moon, Sun, Smartphone, Bell, Lock } from "lucide-react";

export default function Settings() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your preferences and account.</p>
      </div>

      <div className="space-y-6">
        <section className="space-y-4">
            <h2 className="text-xl font-semibold border-b border-border/40 pb-2">Appearance</h2>
            <div className="grid grid-cols-3 gap-4">
                <Button variant="outline" className="h-24 flex-col gap-2 border-2 border-primary bg-primary/5">
                    <Sun className="w-6 h-6" />
                    Light
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2">
                    <Moon className="w-6 h-6" />
                    Dark
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2">
                    <Smartphone className="w-6 h-6" />
                    System
                </Button>
            </div>
        </section>

        <section className="space-y-4">
            <h2 className="text-xl font-semibold border-b border-border/40 pb-2">Notifications</h2>
            <div className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-card/40">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Bell className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive alerts for reminders.</p>
                    </div>
                </div>
                <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all" />
                </div>
            </div>
        </section>

        <section className="space-y-4">
            <h2 className="text-xl font-semibold border-b border-border/40 pb-2">Privacy</h2>
            <div className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-card/40">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary text-secondary-foreground">
                        <Lock className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-medium">Passcode Lock</p>
                        <p className="text-sm text-muted-foreground"> Require FaceID or Passcode to open.</p>
                    </div>
                </div>
                 <div className="w-12 h-6 bg-secondary rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-background rounded-full transition-all" />
                </div>
            </div>
        </section>
      </div>
    </div>
  );
}
