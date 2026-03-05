import { Layout } from "@/components/Layout";
import { useUser, useUpdateUser } from "@/hooks/use-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { User as UserType } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { User, Phone, Mail, MapPin, Heart, Bell, Check } from "lucide-react";

type ProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  city: string;
  postalCode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  appointmentReminders: boolean;
  resultAlerts: boolean;
};

export default function Profile() {
  const { data: user, isLoading } = useUser();
  const updateMutation = useUpdateUser();
  const { toast } = useToast();
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<ProfileForm>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dob: "",
      address: "",
      city: "",
      postalCode: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelation: "",
      emailNotifications: true,
      smsNotifications: false,
      appointmentReminders: true,
      resultAlerts: true,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        dob: user.dob || "",
        address: user.address || "",
        city: user.city || "",
        postalCode: user.postalCode || "",
        emergencyContactName: user.emergencyContactName || "",
        emergencyContactPhone: user.emergencyContactPhone || "",
        emergencyContactRelation: user.emergencyContactRelation || "",
        emailNotifications: user.emailNotifications ?? true,
        smsNotifications: user.smsNotifications ?? false,
        appointmentReminders: user.appointmentReminders ?? true,
        resultAlerts: user.resultAlerts ?? true,
      });
    }
  }, [user, reset]);

  const onSubmit = (data: ProfileForm) => {
    updateMutation.mutate(data, {
      onSuccess: () => {
        setSaved(true);
        toast({
          title: "Profile updated",
          description: "Your changes have been saved successfully.",
        });
        setTimeout(() => setSaved(false), 2500);
      },
    });
  };

  if (isLoading) return <Layout><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mt-20" /></Layout>;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2" data-testid="text-profile-title">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information, contact details, and communication preferences.</p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          <Card>
            <CardHeader className="flex flex-row items-center gap-3 flex-wrap">
              <div className="p-2 rounded-lg bg-primary/10">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Patient Details</CardTitle>
                <CardDescription>Your personal and identification information.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <div>
                  <p className="font-semibold text-lg" data-testid="text-profile-name">{user?.firstName} {user?.lastName}</p>
                </div>
              </div>

              <div className="grid gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name <span className="text-destructive">*</span></Label>
                    <Input
                      id="firstName"
                      data-testid="input-first-name"
                      {...register("firstName", { required: "First name is required" })}
                      className={errors.firstName ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.firstName && <p className="text-xs text-destructive" data-testid="error-first-name">{errors.firstName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name <span className="text-destructive">*</span></Label>
                    <Input
                      id="lastName"
                      data-testid="input-last-name"
                      {...register("lastName", { required: "Last name is required" })}
                      className={errors.lastName ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.lastName && <p className="text-xs text-destructive" data-testid="error-last-name">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" type="date" data-testid="input-dob" {...register("dob")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phn">PHN (Provincial Health Number)</Label>
                  <Input id="phn" data-testid="input-phn" value="9876 543 210" readOnly className="bg-muted/30" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3 flex-wrap">
              <div className="p-2 rounded-lg bg-primary/10">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>How your care team can reach you.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                    <Input
                      id="email"
                      type="email"
                      data-testid="input-email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Please enter a valid email address",
                        },
                      })}
                      className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.email && <p className="text-xs text-destructive" data-testid="error-email">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" data-testid="input-phone" {...register("phone")} placeholder="(555) 123-4567" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" data-testid="input-address" {...register("address")} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" data-testid="input-city" {...register("city")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Zip / Postal Code</Label>
                    <Input id="postalCode" data-testid="input-postal-code" {...register("postalCode")} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3 flex-wrap">
              <div className="p-2 rounded-lg bg-primary/10">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Additional Contact</CardTitle>
                <CardDescription>Someone we can reach if needed.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactName">Contact Name</Label>
                    <Input id="emergencyContactName" data-testid="input-emergency-name" {...register("emergencyContactName")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactRelation">Relationship</Label>
                    <Input id="emergencyContactRelation" data-testid="input-emergency-relation" {...register("emergencyContactRelation")} placeholder="e.g., Spouse, Parent" />
                  </div>
                </div>
                <div className="space-y-2 max-w-sm">
                  <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
                  <Input id="emergencyContactPhone" data-testid="input-emergency-phone" {...register("emergencyContactPhone")} placeholder="(555) 000-0000" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3 flex-wrap">
              <div className="p-2 rounded-lg bg-primary/10">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Communication Preferences</CardTitle>
                <CardDescription>Choose how you'd like to receive updates from your care team.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-4 py-3 border-b border-border">
                  <div>
                    <p className="font-medium" data-testid="text-email-notifications-label">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates and reminders via email.</p>
                  </div>
                  <Controller
                    name="emailNotifications"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        data-testid="switch-email-notifications"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="flex items-center justify-between gap-4 py-3 border-b border-border">
                  <div>
                    <p className="font-medium" data-testid="text-sms-notifications-label">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">Get text message alerts to your phone.</p>
                  </div>
                  <Controller
                    name="smsNotifications"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        data-testid="switch-sms-notifications"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="flex items-center justify-between gap-4 py-3 border-b border-border">
                  <div>
                    <p className="font-medium" data-testid="text-appointment-reminders-label">Appointment Reminders</p>
                    <p className="text-sm text-muted-foreground">Reminders before upcoming appointments.</p>
                  </div>
                  <Controller
                    name="appointmentReminders"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        data-testid="switch-appointment-reminders"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="font-medium" data-testid="text-result-alerts-label">Result Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified when new results are available.</p>
                  </div>
                  <Controller
                    name="resultAlerts"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        data-testid="switch-result-alerts"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-3 pb-8">
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-sky-500 font-medium" data-testid="text-save-success">
                <Check className="w-4 h-4" />
                Changes saved
              </span>
            )}
            <Button
              type="submit"
              disabled={updateMutation.isPending || !isDirty}
              data-testid="button-save-profile"
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
